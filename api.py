from dotenv import load_dotenv
import os
import random

load_dotenv()
CLIENT_ID=os.getenv('CLIENT_ID')
CLIENT_SECRET=os.getenv('CLIENT_SECRET')
GENIUS_API_SECRET=os.getenv('GENIUS_ACCESS_TOKEN')

# Import spotify interface + utils libraries
from lib.Spotify import Spotify
from lib.Utils import Utils
utils = Utils()

from lib.lyrics import *

# import flask
from flask import Flask
from flask import jsonify
from flask import request
from flask import render_template
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

#import other necessary modules
import json
from dateutil import parser

# Testing route/main route
@app.route('/')
def api_base():

	return render_template("base.html")

# Testing route/main route
@app.route('/test')
def api_base_test():

	return_string = '''\nroute open for testing\n'''

	return return_string

# Get playlists for a specific user
@app.route('/<username>/playlists', methods=['GET'])
def playlists_get(username):

	access_token = request.headers['access_token']
	spotify = Spotify(access_token)
	playlists = spotify.get_playlists()
	playlists_filtered = []
	for playlist in playlists['items']:
		if playlist['tracks']['total'] == 0:
			continue
		else:
			playlists_filtered.append(playlist)
	del spotify

	return jsonify(playlists_filtered)

# search spotify
@app.route('/search', methods=['GET'])
def search():
	access_token = request.headers['access_token']
	spotify = Spotify(access_token)
	type = request.args.get('type')
	query = request.args.get('query')
	results = spotify.search(query, type)['items']

	return_package = {
		'results': results
	}
	
	return jsonify(return_package)

# testing route to load test the API for getting tracks
@app.route('/playlists/<playlist_id>/tracks', methods=['GET'])
def tracks_get(playlist_id):
	
	access_token = request.headers['access_token']
	spotify = Spotify(access_token)
	tracks = spotify._get_playlist_tracks(playlist_id)['items']
	del spotify

	return jsonify(tracks['items'])

@app.route('/analysis/playlist/<playlist_id>', methods=['GET'])
def full_playlist_analysis(playlist_id):

	# Get access token from the headers and init Spotify objectg
	access_token = request.headers['access_token']
	spotify = Spotify(access_token)

	tracks, track_additions, analysis_list, artist_list, last_update_iso = spotify.get_playlist_items(playlist_id)

	# get most recently added date
	last_update = parser.isoparse(last_update_iso)

	key_data, feel_data, genre_data, tempo_data, duration_data = utils.analyze_playlist(analysis_list,tracks,artist_list)

	timeline_dict = {}
	for isodate in track_additions:
		date = parser.isoparse(isodate)
		date_string = utils.month_int_to_string(date.month) + ' ' + str(date.year)
		if date_string in timeline_dict:
			timeline_dict[date_string] += 1
		else:
			timeline_dict[date_string] = 1

	timeline_labels = [key for key in timeline_dict]
	timeline_data = [timeline_dict[key] for key in timeline_dict]

	payload = {}
	payload['keys'] = key_data
	payload['feel'] = feel_data
	payload['genres'] = genre_data
	payload['tempo'] = tempo_data
	payload['duration'] = duration_data
	payload['last_update'] = last_update
	payload['timeline_labels'] = timeline_labels
	payload['timeline_data'] = timeline_data
 
	del spotify

	return jsonify(payload)

@app.route('/analysis/song/<song_id>', methods=['GET'])
def full_song_analysis(song_id):
	# Get access token from the headers and generate spotify's required header
	access_token = request.headers['access_token']
	spotify = Spotify(access_token)
	analysis_raw = spotify.song_features(song_id)[0]
	analysis = {
		'acousticness': analysis_raw['acousticness'],
		'analysis_url': analysis_raw['analysis_url'],
		'danceability': analysis_raw['danceability'],
		'duration_ms': analysis_raw['duration_ms'],
		'energy': analysis_raw['energy'],
		'id': analysis_raw['id'],
		'instrumentalness': analysis_raw['instrumentalness'],
		'key': utils.int_to_key(analysis_raw['key']),
		'liveness': analysis_raw['liveness'],
		'loudness': analysis_raw['loudness'],
		'mode': utils.int_to_mode(analysis_raw['mode']),
		'speechiness': analysis_raw['speechiness'],
		'tempo': analysis_raw['tempo'],
		'time_signature': analysis_raw['time_signature'],
		'track_href': analysis_raw['track_href'],
		'type': analysis_raw['type'],
		'uri': analysis_raw['uri'],
		'valence': analysis_raw['valence'],
	}
	return_package = {
		'analysis': analysis
	}
	return jsonify(return_package)


@app.route('/analysis/lyrics/playlist/<playlist_id>', methods=['GET'])
def lyrics_analysis(playlist_id):

	# Get access token from the headers and generate spotify's required header
	access_token = request.headers['access_token']
	spotify = Spotify(access_token)
	tracks = spotify._get_playlist_tracks(playlist_id)['items']
	del spotify
 
	tracks = [x['track'] for x in tracks]

	cnt = 0

	# select random sample of songs 
	max_songs=20
	tracks = random.sample(tracks,k=max_songs)

	lyrics_count = {}

	for track in tracks:
		if cnt >= max_songs:
			break
		#print('Track {}/{}'.format(cnt,len(tracks)))
		lyrics = get_lyrics(track)
		if not lyrics:
			continue
		words = parse_lyrics(lyrics)

		for word in words:
			#word = word.capitalize()
			if word in lyrics_count:
				lyrics_count[word] += 1
			else:
				lyrics_count[word] = 1


		cnt += 1
	
	lyrics_count_sorted = {k: v for k, v in sorted(lyrics_count.items(), key=lambda item: item[1], reverse=True)}
	
	# format payload for React library usage
	lyrics_analysis = []
	for key in lyrics_count_sorted:
		lyrics_analysis.append({'text':key,'value':lyrics_count_sorted[key]})

	return jsonify(lyrics_analysis[0:200])

@app.route('/<playlist_id>/recommendations', methods=['GET'])
def playlist_recs(playlist_id):

	# Get access token from the headers and generate spotify's required header
	access_token = request.headers['access_token']
	spotify = Spotify(access_token)
	recs = spotify.get_recommendations()
	del spotify

	return jsonify(recs)

@app.route('/recommendations', methods=['POST'])
def song_recs():

	# Get access token from the headers and generate spotify's required header
	access_token = request.headers['access_token']
	attributes = request.get_json()['attributes']
	seeds = request.get_json()['seeds']

	spotify = Spotify(access_token)
	recs = spotify.get_recommendations(seeds, attributes)
	del spotify

	return_package = {
		'recs': recs
	}

	return jsonify(return_package)

if __name__ == '__main__':
	app.run()
