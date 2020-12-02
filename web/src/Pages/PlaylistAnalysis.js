// load core react + custom components
import React from 'react';
import { isMobile } from 'react-device-detect'
import styled from 'styled-components'
import './css/Analysis.css';
import ChartContainer from '../Components/ChartContainer'
import KeyChart from '../Components/KeyChart'
import GenreChart from '../Components/GenreChart'
import FeelChart from '../Components/FeelChart'
import TempoChart from '../Components/TempoChart'
import DurationChart from '../Components/DurationChart'
import PlaylistTimeline from '../Components/PlaylistTimeline'
import LyricCloud from '../Components/LyricCloud'
import Loader from '../Components/Loader'
import loading_gif from '../images/loading.gif'
import TempoPulse from '../Components/TempoPulse';
// Load in the materials-ui components
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Load styling
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { createMuiTheme } from '@material-ui/core/styles';
import {ThemeProvider} from 'styled-components';

// Import Vibrant.js
import * as Vibrant from 'node-vibrant'

const querystring = require('querystring');
const axios = require('axios').default;

const URL_BASE = process.env.REACT_APP_API_URL

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

const PlaylistDescription = styled(Typography)`
    font-size: 1.5 rem;
`

const KeySignature = styled.img`
  height: 100px;
  width: 120px;
`

const PlaylistOwner = styled.h1`

  font-size: 1.8em;
  word-wrap: break-word;
  text-align: left;

`

const styles = theme => ({
  playlist_image: {
    overflow: 'hidden',
  },
  paper: {
    background: '#212529',
    height: "100%"
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

const button_theme = createMuiTheme({
  palette: {
    primary: {main: '#87F5FB'},
  },
  status: {
    danger: 'orange',
  },
});

// Find nth Index function
function nthIndex(str, pat, n){
    var L= str.length, i= -1;
    while(n-- && i++<L){
        i= str.indexOf(pat, i);
        if (i < 0) break;
    }
    return i;
}


class PlaylistAnalysis extends React.Component {

		  constructor(props) {
    		super(props);
    		this.state = {
          authCode: querystring.parse(window.location.href.slice(window.location.href.indexOf('?')+1)).code,
    			accessToken: querystring.parse(window.location.href.slice(window.location.href.indexOf('?')+1)).access_token,
    			id: querystring.parse(window.location.href.slice(window.location.href.indexOf('?')+1)).id,
    			name: querystring.parse(window.location.href.slice(window.location.href.indexOf('?')+1)).name,
          playlist: null,
    			key_data: null,
          fav_key: null,
		        genre_data: null,
		        feel_data: null,
            tempo_data: null,
            tempo_avg: null,
            lyrics_data: null,
            palette: null,
            last_update: null

    		}

  		}

  		componentDidMount() {
  			//console.log(this.state.accessToken)
         this.fetchPlaylist()
  			 this.fetchAnalysis()
         this.fetchLyrics()

  		}

      componentWillUnmount() {
        document.body.style.background = "#2e2f32";
      }

      fetchPlaylist = async () => {
          const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.state.accessToken
          }

        const response = await axios.get(`https://api.spotify.com/v1/playlists/${this.state.id}`, {headers: headers})

        if(response.status === 200) {
              //console.log(response)
              const data = await response.data
              this.setState({playlist: data})
              //console.log(this.state.playlist)
              this.getVibrant()
        }
      }

      getVibrant = () => {
        Vibrant.from(this.state.playlist.images[0].url).getPalette()
               .then((palette) => {
                console.log(palette)
                //document.body.style.backgroundImage = `radial-gradient(ellipse at top,rgba(${palette.Vibrant.r},${palette.Vibrant.g},${palette.Vibrant.b},0.5),
                                                                                      //rgba(${palette.Muted.r},${palette.Muted.g},${palette.Muted.b},0.4),
                                                                                      
                                                                                      //#2e2f32)`
                this.setState({palette: palette})})

      }


      fetchAnalysis = async () => {
        const headers = {
        'access_token': this.state.accessToken
         }

        const response = await axios.get(URL_BASE + `/analysis/playlist/${this.state.id}`, {headers})

        if(response.status === 200){
            //console.log(response) 
            const data = await response.data

            var sortable = [];
              for (var genre in data.genres) {
                  sortable.push([genre, data.genres[genre]]);
              }

              sortable.sort(function(a, b) {
                  return b[1]- a[1];
              })

              var genresSorted = {}

              sortable.forEach((item) => {
              genresSorted[item[0]]=item[1]
              })

            // slice the object
            var genres_sliced = {}
            var max = 6
            var cnt = 1
            for(let genre in genresSorted) {
              genres_sliced[genre] = genresSorted[genre]
              cnt++
              if(cnt >= max) {
                break
              }
            }

            // Calculate psuedo-average tempo
            var tempo_avg = 0
            var sum = 0
            for(let i = 0; i<data.tempo.x.length; i++){
              tempo_avg += (data.tempo.x[i]*data.tempo.y[i])
              sum += data.tempo.y[i]
            }
            tempo_avg /= sum

            var major_key_max = Object.keys(data.keys.major).reduce((a, b) => data.keys.major[a] > data.keys.major[b] ? a : b);
            var minor_key_max = Object.keys(data.keys.minor).reduce((a, b) => data.keys.minor[a] > data.keys.minor[b] ? a : b);

            //console.log(major_key_max)
            //console.log(minor_key_max)

            if(data.keys.major[major_key_max] >= data.keys.minor[minor_key_max]) {
              this.setState({fav_key: `${major_key_max} major`})
              this.getKeySignatureImg()
            } else
              this.setState({fav_key: `${minor_key_max} minor`})
              this.getKeySignatureImg()

            this.setState({tempo_avg:Math.round(tempo_avg)})
            this.setState({key_data: data.keys})
            this.setState({genre_data: genres_sliced})
            this.setState({feel_data: data.feel})
            this.setState({tempo_data: data.tempo})
            this.setState({duration_data: data.duration})
            this.setState({last_update: data.last_update})
            this.setState({timeline_labels: data.timeline_labels})
            this.setState({timeline_data: data.timeline_data})
          }
            }

        fetchLyrics = async () => {
          const headers = {
          'access_token': this.state.accessToken
           }

          const response = await axios.get(URL_BASE + `/analysis/lyrics/playlist/${this.state.id}`, {headers})

          if(response.status === 200){
              //console.log(response) 
              const data = await response.data
              this.setState({lyrics_data: data})
              this.setState({fav_lyric: data[0].text})
              //console.log(this.state.lyrics_data)

          }
        }
      
        getKeySignatureImg = () => {
          switch(this.state.fav_key) {
            case 'A major':
              this.setState({key_img: require('../images/chords_imgs/amaj.png')})
              break
            case 'A minor':
              this.setState({key_img: require('../images/chords_imgs/amin.png')})
              break
            case 'A# major':
              this.setState({key_img: require('../images/chords_imgs/asmaj.png')})
              break
            case 'A# minor':
              this.setState({key_img: require('../images/chords_imgs/asmin.png')})
              break
            case 'B major':
              this.setState({key_img: require('../images/chords_imgs/bmaj.png')})
              break
            case 'B minor':
              this.setState({key_img: require('../images/chords_imgs/bmin.png')})
              break
            case 'C major':
              this.setState({key_img: require('../images/chords_imgs/amin.png')})
              break
            case 'C minor':
              this.setState({key_img: require('../images/chords_imgs/cmin.png')})
              break
            case 'C# major':
              this.setState({key_img: require('../images/chords_imgs/csmaj.png')})
              break;
            case 'C# minor':
              this.setState({key_img: require('../images/chords_imgs/csmin.png')})
              break
            case 'D major':
              this.setState({key_img: require('../images/chords_imgs/dmaj.png')})
              break
            case 'D minor':
              this.setState({key_img: require('../images/chords_imgs/dmin.png')})
              break
            case 'D# major':
              this.setState({key_img: require('../images/chords_imgs/dsmaj.png')})
              break
            case 'D# minor':
              this.setState({key_img: require('../images/chords_imgs/dsmin.png')})
              break
            case 'E major':
              this.setState({key_img: require('../images/chords_imgs/emaj.png')})
              break
            case 'E minor':
              this.setState({key_img: require('../images/chords_imgs/emin.png')})
              break
            case 'F major':
              this.setState({key_img: require('../images/chords_imgs/fmaj.png')})
              break
            case 'F minor':
              this.setState({key_img: require('../images/chords_imgs/fmin.png')})
              break
            case 'F# major':
              this.setState({key_img: require('../images/chords_imgs/fsmaj.png')})
              break
            case 'F# minor':
              this.setState({key_img: require('../images/chords_imgs/fsmin.png')})
              break
            case 'G major':
              this.setState({key_img: require('../images/chords_imgs/gmaj.png')})
              break
            case 'G minor':
              this.setState({key_img: require('../images/chords_imgs/gmin.png')})
              break
            case 'G# major':
              this.setState({key_img: require('../images/chords_imgs/gsmaj.png')})
              break
            case 'G# minor':
              this.setState({key_img: require('../images/chords_imgs/gsmin.png')})
              break
            
            
          }
        }

  		render() {

        const { classes } = this.props;

        if(this.state.key_data && this.state.genre_data && this.state.feel_data && this.state.tempo_data && this.state.duration_data && this.state.palette && this.state.last_update) {
  			return (
        <div>
        <br></br>
        <Container>
          <Grid container spacing={3}
                direction="row"
                justify="center"
                alignItems="flex-start"
          >
            <Grid item lg={2} xs={3} style={{height: '100%'}}>
              <Card className={classes.playlist_image}>
                <CardActionArea>
                  <a href={this.state.playlist.external_urls.spotify}>
                    <CardMedia
                      style = {{ height: 'auto', width: "max", paddingTop: '100%'}}
                      image={this.state.playlist.images[0].url}
                      title={this.state.playlist.name}
                      justify="center"
                    />
                  </a>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item lg={8} xs={9}>
              <ThemeProvider theme={title_theme}>
                <Typography variant={'h3'} align={'left'} style={{fontWeight: 400}}>{this.state.playlist.name}</Typography>
                <PlaylistDescription variant={isMobile ? 'body1' : 'h5'} align={'left'} style={{fontWeight: 100}}>{this.state.playlist.description}</PlaylistDescription>
              </ThemeProvider>
            </Grid>
            <Grid item lg={2} xs={12}>
              <Grid container spacing={3}
                direction="column"
                justify="center"
                alignItems="center"
              >
                <ThemeProvider theme={button_theme}>
                  <Grid item>
                  <ButtonWrapper>
                    <NewButton href="/playlists">
                      Analyze Another
                    </NewButton>
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <NewButton href={`${process.env.REACT_APP_BASE_URL}`}>
                      Home
                    </NewButton>
                  </ButtonWrapper>
                      {/* //<a className="btn-lg btn-light" href={`${process.env.REACT_APP_REDIRECT_URI}`}>Analyze Another</a> */}
                  </Grid>
                </ThemeProvider>
              </Grid>
            </Grid>
          </Grid>
          <hr style={{'borderColor':'#212529'}}></hr>


          <Grid container spacing={2}
            direction="row"
            justify="space-between"
            alignItems="stretch"

          >
            <Grid item lg={3} xs={6}>
              <Paper elevation={3} className={classes.paper}>
                <div className={classes.paper_div}>
                  <h6 align="left" className={classes.paper_title}>Total Tracks</h6>
                  <h1 align="left" className={classes.paper_title}>{this.state.playlist.tracks.total}</h1>
                </div>
              </Paper>
            </Grid>
            <Grid item lg={3} xs={6}>
              <Paper elevation={3} className={classes.paper}>
                <div className={classes.paper_div}>
                 <h6 align="left" className={classes.paper_title}>Followers</h6>
                 <h1 align="left" className={classes.paper_title}>{this.state.playlist.followers.total}</h1>
                </div>
              </Paper>
            </Grid>
            <Grid item lg={3} xs={6}>
              <Paper elevation={3} className={classes.paper}>
                <div className={classes.paper_div}>
                <h6 align="left" className={classes.paper_title}>Playlist Owner</h6>
                <PlaylistOwner align="left" className={classes.paper_title}>{this.state.playlist.owner.id}</PlaylistOwner>
                </div>
              </Paper>
            </Grid>
            <Grid item lg={3} xs={6} align="stretch">
              <Paper elevation={3} className={classes.paper}>
                <div className={classes.paper_div}>
                  <h6 align="left" className={classes.paper_title}>Last Updated</h6>
                  <h2 align="left" className={classes.paper_title}>{this.state.last_update.slice(0,nthIndex(this.state.last_update,' ',4))}</h2>
                </div>
              </Paper>
            </Grid>
          </Grid>

          <br></br>

          <Grid container spacing={2}
            direction="row"
            justify="space-between"
            alignItems="flex-start"
          >
            <Grid item lg={4} s={6} xs={12}>
              <ChartContainer title="Keys">
                {this.state.key_data ? <KeyChart data={this.state.key_data} palette={this.state.palette}/> : ' '}
              </ChartContainer>
            </Grid>
            <Grid item lg={4} s={6} xs={12}>
              <ChartContainer title="Genres">
                {this.state.genre_data ? <GenreChart data={this.state.genre_data} palette={this.state.palette}/> : ' '}
              </ChartContainer>
            </Grid>
            <Grid item lg={4} s={6} xs={12}>
               <ChartContainer title="Tempo">
                {this.state.tempo_data ? <TempoChart data={this.state.tempo_data} palette={this.state.palette}/> : ' '}
              </ChartContainer>
            </Grid>
          </Grid>

          <br></br>

          <Grid container spacing={2}
            direction="row"
            justify="space-between"
            alignItems="stretch"
            style={{height: '100%'}}
          >
            <Grid item lg={4} md={4} s={6} xs={12}>
              <ChartContainer title="Playlist Feel" style={{height: '100%'}}>
                {this.state.feel_data ? <FeelChart data={this.state.feel_data} palette={this.state.palette}/> : ' '}
              </ChartContainer>
            </Grid>
            <Grid item lg={4} md={4} s={6} xs={12}>
              <ChartContainer title="Duration" style={{height: '100%'}}>
                {this.state.duration_data ? <DurationChart data={this.state.duration_data} palette={this.state.palette} /> : ' '}
              </ChartContainer>
            </Grid>
            <Grid item lg={4} md={4} s={6} xs={12} style={{height: '100%'}}>
                <Grid container spacing={2}
                  direction="column"
                  justify="center"
                  alignItems="stretch"
                >
                  <Grid item>
                    <Paper elevation={3} className={classes.paper}>
                      <div className={classes.paper_div}>
                        <h6 align="left" className={classes.paper_title}>Favorite Key</h6>
                        <Grid container direction="row" justify="space-between" alignItems="center" style={{width: '100%'}}>
                          <Grid item>
                            <h2 align="left" className={classes.paper_title}>{this.state.fav_key}</h2>
                          </Grid>
                          <Grid item>
                            <KeySignature src={this.state.key_img} />
                          </Grid>
                        </Grid>
                      </div>
                    </Paper>
                  </Grid>
                  <Grid item>
                    <Paper elevation={3} className={classes.paper}>
                      <div className={classes.paper_div}>
                        <h6 align="left" className={classes.paper_title}>Average Tempo</h6>
                        <Grid container direction="row" justify="space-between" alignItems="center" style={{width: '85%'}}>
                          <Grid item>
                          <h2 align="left" className={classes.paper_title}>{this.state.tempo_avg}</h2>
                          </Grid>
                          <Grid item>
                            <TempoPulse bpm={this.state.tempo_avg} color={this.state.palette.Vibrant.hex} />
                          </Grid>
                        </Grid>
                      </div>
                    </Paper>
                  </Grid>
                </Grid>
            </Grid>
          </Grid>
          <br></br>
          <Grid container spacing={2}
            direction="row"
            justify="center"
            alignItems="stretch"
          >
          <Grid item lg={6} md={6} s={6} xs={12} style={{height: '100%'}}>
            <ChartContainer title="Timeline (beta)">
              {
                this.state.timeline_data ?
                <PlaylistTimeline labels={this.state.timeline_labels} data={this.state.timeline_data} palette={this.state.palette}/>
                : ' '
              }
            </ChartContainer>
          </Grid>
          <Grid item lg={6} md={6} s={6} xs={12}>
              <ChartContainer title="Lyrics">
                  {this.state.lyrics_data ? 
                    <LyricCloud data={this.state.lyrics_data} palette={this.state.palette}/> : 
                    <Loader image={loading_gif} message="Analyzing Lyrics.. This one takes awhile...." img_dimensions={{height:200,width:200}}></Loader> 
                  }
                  {this.state.lyrics_data ? <h5 align="left" className={classes.paper_title}>Favorite Lyric: "{this.state.fav_lyric}"</h5> : ' '}
              </ChartContainer>
          </Grid>  
          </Grid>
        </Container>
        <br></br>
        </div>
  			)}

        // Return Loader if not all data is here

        else {
          return(
            <Loader image={loading_gif} message="Analyzing... should only be a few seconds..."></Loader>
            )
        }
  		}

}

PlaylistAnalysis.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PlaylistAnalysis);
