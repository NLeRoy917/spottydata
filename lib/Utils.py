import numpy as np

class Utils():
    '''
    Class that provides a few utility functions to work with some of the data recieved fromn spotify
    in addition to providing analysis methods.
    '''
            
    def __init__(self):
        pass
    
    def generate_density(self,array,float=False):
        '''
        Creates a psuedo-density plot. Since Chart.js doesnt have these, I am forced to generate my own. I
        create a histogram with equal bin widths, then map it to a line chart. With proper smoothing on the front-end
        it looks exactly like a density plot.
        '''
        class Hist:
            '''
            Simple histogram class to interface the numpy histogram creation method. Pass
            in an array, and you can generate bins and counts for that data.
            '''
            def __init__(self):
                self.counts = []
                self.bins = []

            def create(self,array): 
                '''
                Generate counts and bins from an array of data. These can be accessed from the counts and bins
                attributes
                '''
            	# generate the counts and bins
            	# note that length(self.bins) = length(self.counts) + 1
                self.counts, self.bins = np.histogram(array)
        
        class Density:
            '''
            Density plot chart data generator. Density plots are a visually-appealing way to display
            distribution data. The JavaScript library used to make charts does not have this, so I emulated it using
            data for a line chart.
            
            Initialize the Density() object, and create it with a histogram object.
            '''
            def __init__(self):
                self.x = []
                self.y =[]

            def create(self,hist):
                '''
                Create density chart from histogram distribution. The bins are mapped to an array of length n-1 using
                their midpoints. Then a final 2 bins are added by adding one more bin length to the end and the
                begining.
                '''
                bins = hist.bins.tolist()
                counts = hist.counts.tolist()
                bins_mid = [0]*(len(bins)-1)    
                # map bins to new array of n-1 using midpoints
                for i in range(len(bins)-1):
                	bins_mid[i] = (bins[i] + bins[i+1])/2   
                # add one bin length to end of bins_mid
                bins_mid.append(bins_mid[-1] + (bins_mid[-1]-bins_mid[-2])) 
                # add one bin legnth to the begining od bins_mid
                bins_mid = [(bins_mid[0] - (bins_mid[1] - bins_mid[0]))] + bins_mid 
                # add zero to begining and end of counts
                counts.append(0)
                counts = [0] + counts   
                if(float==False):
                	self.x = [int(round(val)) for val in bins_mid]
                	self.y = [int(round(val)) for val in counts]
                elif(float==True):
                	self.x = [round(val,2) for val in bins_mid]
                	self.y = [round(val,2) for val in counts]
                 
                 
        # create histogram object and generate the bins with the data
        hist = Hist()
        hist.create(array)  
        # create density plot from the histogram
        density = Density()
        density.create(hist)
          
        return density

    def analyze_playlist(self, analysis_list, tracks, artist_list):
        '''
        This is the method that conducts the analysis for all the tracks in a playlist. It requires the analysis list,
        the track list, and the artist list. It gathers data on each songs key, feel, genre, tempo, and duration.
        '''
        # Init key object
        key_data = {'minor': {'A':0,
        					'A#':0,
        					'B':0,
        					'C':0,
        					'C#':0,
        					'D':0,
        					'D#':0,
        					'E':0,
        					'F':0,
        					'F#':0,
        					'G':0,
        					'G#':0},    
        			'major': {'A':0,
        					'A#':0,
        					'B':0,
        					'C':0,
        					'C#':0,
        					'D':0,
        					'D#':0,
        					'E':0,
        					'F':0,
        					'F#':0,
        					'G':0,
        					'G#':0}
        			}   
        # Init feel data
        feel_data = {
        		  "acousticness" : 0,
        		  "danceability" : 0,
        		  "energy" : 0,
        		  "instrumentalness" : 0,
        		  "liveness" : 0,
        		  "speechiness" : 0
        		}   
        # init empty dicts and variables
        genre_data = {}
        tempo_store = []
        tempo_data = {}
        duration_store = []
        i = 0
        
        # Iterate and parse data
        for analysis,artist in zip(analysis_list,artist_list): 
        	# Get the analysis for the track ONCE
        	i += 1  
        	## STORE KEY DATA ##
        	# Some songs may not have a key or mode, so catch key_not_exist error and pass 
        	# (this would occur for a track that is a podcast or local file)
        	try:
        		if analysis['mode'] == 0:
        			key_data['minor'][self.int_to_key(analysis['key'])] += 1
        		elif analysis['mode'] == 1:
        			key_data['major'][self.int_to_key(analysis['key'])] += 1
        		else:
        			continue
        	except:
        		pass    
        	## STORE FEEL DATA ##
        	try:
        		feel_data['acousticness'] += analysis['acousticness']
        		feel_data['danceability'] += analysis['danceability']
        		feel_data['energy'] += analysis['energy']
        		feel_data['instrumentalness'] += analysis['instrumentalness']
        		feel_data['liveness'] += analysis['liveness']
        		feel_data['speechiness'] += analysis['speechiness'] 
        	except:
        		pass    
        	## STORE GENRE DATA ##
        	try:    
        		# Get Artist data + genres
        		genres = artist['genres']   
        		# Append artist genres to the genre dictionary
        		for genre in genres:    
        			# check that the genre exists in the dictionary
        			if genre not in genre_data:
        				genre_data[genre] = 1
        			else:
        				genre_data[genre] += 1
        	except:
        		pass
        
        	## STORE TEMPO DATA ##
        	try:
        		#analyze track and store tempo
        		tempo_store.append(float(analysis['tempo']))
        	except:
        		pass    
        	## STORE DURATION DATA ##
        	try:
        		duration_store.append(float(analysis['duration_ms'])/1000/60)
        	except:
        		pass
      
                
        ## POST PROCESSING ##   
        # Divide the sum by the number of tracks
        for key in feel_data:
        	feel_data[key] /= (i-1)
        	feel_data[key] *= 100
        
        # create hist object from array of data
        tempo_density = self.generate_density(tempo_store)
        duration_density = self.generate_density(duration_store,float=True)  
        
        tempo_data={'x': tempo_density.x,
        			'y': tempo_density.y}   
        duration_data ={'x': duration_density.x,
        				'y': duration_density.y}

        print('We were able to analyze {}/{} tracks'.format(i,len(tracks)))
        
        return key_data, feel_data, genre_data, tempo_data, duration_data
    
    def int_to_key(self,key_int):
        '''
        Convert a integer key value to the actual key. Spotify only provides the integer value,
        so the actual key must be hard-coded in.
        '''
        if key_int == 0:
        	key = 'C'
        elif key_int == 1:
        	key = 'C#'
        elif key_int == 2:
        	key = 'D'
        elif key_int == 3:
        	key = 'D#'
        elif key_int == 4:
        	key = 'E'
        elif key_int == 5:
        	key = 'F'
        elif key_int == 6:
        	key = 'F#'
        elif key_int == 7:
        	key = 'G'
        elif key_int == 8:
        	key = 'G#'
        elif key_int == 9:
        	key = 'A'
        elif key_int == 10 or key_int == 't':
        	key = 'A#'
        elif key_int == 11 or key_int == 'e':
        	key = 'B'
        else:
        	key = 'no_key'
         
        return key
    
    def int_to_mode(self,mode_int):
        '''
        convert the mode integer to minor or major
        '''
        if mode_int == 0:
        	mode = 'Minor'
        elif mode_int == 1:
        	mode = 'Major'
        else:
        	mode = 'No Mode'

        return mode
    
    def month_int_to_string(self, month_int):
        '''
        convert month int to month string
        '''
        switcher = {
            1: "January",
            2: "February",
            3: "March",
            4: "April",
            5: "May",
            6: "June",
            7: "July",
            8: "August",
            9: "September",
            10: "October",
            11: "November",
            12: "December"
        }
        return switcher.get(month_int, "Invalid month")
