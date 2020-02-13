import React from 'react';
import './Home.css';

const querystring = require('querystring');
const base_url =  'https://accounts.spotify.com/authorize?'
const payload = {
	client_id: '0ca7dd0007fd4ff2a34c3aab07379970',
	response_type: 'code',
	scope: 'playlist-read-private playlist-read-collaborative user-top-read',
	redirect_uri: 'https://spottydata.herokuapp.com/playlists',
	show_dialog: true
}

const authorize_url = base_url + querystring.stringify(payload)

const Home = () => {

return(
	<header className="masthead home-background">
	  <div className="container h-100">
	    <div className="row h-100 align-items-center">
	      <div className="col-12 text-center">
	        <h1 className="font-weight-bold">Welcome to SpottyData</h1>
	        <br></br>
	        <p className="lead">This site will analyze the songs in your Spotify playlists and display the data to you</p>
	        <br></br>
	  		<a className="btn-lg btn-dark" href={authorize_url}>Let's Go</a>

	      </div>
	    </div>
	  </div>
	</header>
)
}


export default Home