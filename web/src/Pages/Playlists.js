import React, {useState, useEffect} from 'react';
import Cookies from 'universal-cookie';
import styled from 'styled-components'
import {isMobile} from 'react-device-detect'
import './css/Playlists.css';
import blank_image from '../images/blank_playlist.png'
import blank_profile from '../images/blank_profile.png'

// Load custom components
import Playlist from '../Components/Playlist'
import Loader from '../Components/Loader'
import loading_gif from '../images/loading.gif'
import SDButton from '../Components/SDButton'

// Load Material UI
// Load in the materials-ui components
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Load styling
import FadeIn from 'react-fade-in';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { createMuiTheme } from '@material-ui/core/styles';
import {ThemeProvider} from 'styled-components';

// Set axios, querystring, and cookies objects
const axios = require('axios').default;
const querystring = require('querystring');
const cookies = new Cookies();


const API_URL = process.env.REACT_APP_API_URL

const ButtonWrapper = styled.a`
    color: inherit;
    height:100%;
    text-decoration: none;
    &:focus {
        text-decoration: none;
    }
    &:active {
        text-decoration: none;
	}
	&:hover {
        text-decoration: none;
    }
`

const NewButton = styled(Button)`
  && {
	@media (max-width: 768px) {
	margin:15px;
	width: 60vw;
	height: 60px;
  }
	margin: 30px;
	color: inherit;
	width: 150px;
	height: 50px;
	border-radius: 0px;
	border: solid 1px white;
	box-shadow: 4px 4px;
	&:hover {
		color: white;
		transform: translate(1px,1px);
		opacity: 0.7;
		text-decoration: none;
		box-shadow: 2px 2px;
    }
  }
`

const styles = theme => ({
  profile_image: {
    overflow: 'hidden',
  },
  paper: {
    background: '#212529'
  },
  paper_title: {
    color: '#fff'
  },
  paper_div: {
    padding: '20px'
  }

});

const title_theme = createMuiTheme()

title_theme.typography.h3 = {
  fontSize: '1.2rem',
  '@media (min-width:600px)': {
    fontSize: '1.5rem',
  },
  [title_theme.breakpoints.up('md')]: {
    fontSize: '2.4rem',
  },
};

title_theme.typography.h5 = {
  fontSize: '1.2rem',
  '@media (min-width:600px)': {
    fontSize: '1.5rem',
  },
  [title_theme.breakpoints.up('md')]: {
    fontSize: '2.4rem',
  },
};

const ErrorView = ({ }) => {
    return(
        <div>
			<br>
			</br>
			<br></br>
			<Typography variant="h4">Token Error :( Please go back to the home page</Typography>
				<Typography variant="body1">If error persists, try clearing your browser cache and removing cookies for the site.</Typography>
			<ButtonWrapper >
              <SDButton href="/" variant="outlined"><span> Take me back! </span></SDButton>
            </ButtonWrapper>
		</div>
    )
}

const Playlists = ({}) => {

		const [playlists, setPlaylists] = useState([])
		const [accessToken, setAccessToken] = useState(cookies.get('accessToken'))
		const [user, setUser] = useState(cookies.get('user'))
		const [error, setError] = useState(false)
		
		useEffect(() => {
			fetchPlaylists()
		}, [])
		  
		const fetchPlaylists = async () => {
			var hdrs = {
				'Content-Type': 'application/json',
				'access_token': accessToken
			}
			//console.log('token: ' + this.state.accessToken)

			try {
				let response = await axios.get(API_URL + user.id + '/playlists',{headers: hdrs})
				if(response.status === 200) {
		    		//console.log(response);
		    		const data = await response.data
		    		//console.log(data)
		    		setPlaylists(chunkPlaylists(data,3))
			}

			} catch(err) {
				setError(true)
				cookies.remove('acccessToken')
				cookies.remove('refreshToken')
			}
		}

		const chunkPlaylists = (playlists,cols) => {

			let chunked_playlists = [];
			let chunk = [];

			for(let i = 1; i<=playlists.length;i++) {

				if (typeof playlists[i-1] === 'undefined') {
					continue
				}

				//console.log(typeof playlists[i])
				//console.log(playlists[i])
				//console.log(i)
				if(i%cols === 0) {
					chunk.push(playlists[i-1])
					chunked_playlists.push(chunk)
					chunk = [];
				} else {
					chunk.push(playlists[i-1])

				}
			}

			return chunked_playlists
		}

		return (
			error ? <ErrorView /> : (playlists.length > 0) ? 
		<>
        <br></br>
		<br></br>
        <Container
		>
          <Grid container
                direction={isMobile ? "column" : "row"}
                justify="center"
                alignItems={isMobile ? "center" : "flex-start"}
				style={{width: '100%', minHeight: '100%',margin: isMobile ? 0 : ''}}
				spacing={10}
          >
            <Grid item lg={3} xs={12} style={{height:'100%', padding: isMobile ? 5 : ''}}>
                  <a href={user.external_urls.spotify}>
				  <img
				  	  style={{width: '75%', maxWidth: '300px'}}
                      src={user.images[0] ? user.images[0].url : blank_profile}
                      alt={user.display_name}
                  />
                  </a>
            </Grid>
            <Grid container justify={isMobile ? "center" : "flex-start"} item lg={5} xs={12} style={{height: '100%',padding: isMobile ? 5 : ''}}>
              <ThemeProvider theme={title_theme}>
			  <div style={{textAlign: 'left !important'}}>
                <Typography variant={isMobile ? 'h5' : 'h3'} align={'left'} style={{fontWeight: 400, textAlign: isMobile ? 'center !important' : 'left !important'}}>
					Welcome {user.display_name}!
				</Typography>
                <Typography variant={isMobile ? 'body1' : 'h5'} align={'left'} style={{fontWeight: 100, textAlign: isMobile ? 'center !important' : 'left !important'}}>
					Please select a playlist to continue.
				</Typography>
			  </div>
			  </ThemeProvider>
			</Grid>
			<Grid container justify={isMobile ? "center" : "flex-start"} item lg={3} xs={12} style={{height: '100%',width:'100%', padding: isMobile ? 5 : ''}}>
			<div  style={{textAlign: isMobile ? 'center':'left', width: '100%'}}>
			  <ButtonWrapper >
				  <NewButton style={{marginLeft: '0'}} href="/analysis-select">
					  Back
				  </NewButton>
			  </ButtonWrapper>
			  </div>
            </Grid>
          </Grid>
          <div className="justify-content-center">
			{playlists.map((chunk,key) => {
				return(
					<div className="justify-content-center row card-row" key={key}>
						{chunk.map((playlist,key) => {
							return (
								<div className="col-md-4 col-lg-3 col-xl-3 card-col" key={key}>
									<FadeIn transitionDuration={500}>
										<Playlist 
										   key={key} 
										   name={playlist.name} 
										   img_link={playlist.images[0] ? playlist.images[0].url : {blank_image}} 
										   id={playlist.id} 
										   token={accessToken} 
										   desc={playlist.description} 
										/>
									</FadeIn>
								</div>
							);
						})}
					</div>)
			})}
		</div>
		</Container>
        <br></br>
		</>
		:
		<Loader />
		)
}

export default withStyles(styles)(Playlists);