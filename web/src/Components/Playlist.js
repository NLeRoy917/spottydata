import React, {useState, useEffect} from 'react';
import { useInView } from 'react-hook-inview'
import styled from 'styled-components';

import './css/Playlist.css';
import { createMuiTheme } from '@material-ui/core/styles';
import {ThemeProvider} from 'styled-components';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

// Import Vibrant.js
import * as Vibrant from 'node-vibrant';

const card_theme = createMuiTheme({
  palette: {
    primary: {
      main: '#e6fafc', contrastText: "#fff"
    }
  },
  h6: {

  }
});

const Wrapper = styled(Card)`
  margin-left: 7px;
  margin-right: 7px;
  transition: box-shadow ease-in-out 0.1s !important;

  && {
	  @media (max-width: 768px) {
      box-shadow: ${props => props.inView ? props.boxShadow : 'none'};
      transform: ${props => props.inView ? 'translate(-4.5,-4.5px)' : 'none'};
    }
    }

  &:hover {
    /*border: solid ${props => props.palette ? props.palette.Vibrant.hex : 'white'} 1px;*/
    /* box-shadow: ${props => props.palette ? props.palette.Vibrant.hex : 'white'} 10px 10px; */
    box-shadow: ${props => props.boxShadow ? props.boxShadow : 'white 10px 10px'};
    transform: translate(-4.5px,-4.5px);
    border: ${props => props.palette.LightVibrant.hex ? props.palette.LightVibrant.hex : ''} 2px solid;
  &:active {
    box-shadow: ${props => props.boxShadow ? props.boxShadow : 'white 5px 5px'};
    transform: translate(-2px,-2px);
  }
  }
`

const Link = styled.a`
  text-decoration: none;
  &:hover{
    text-decoration: none;
  }
`

const querystring = require('querystring');
const REDIRECT_BASE = process.env.REACT_APP_BASE_URL + '/playlist-analysis?'

const Playlist = ({name, img_link, token, authCode, id, desc, setName}) => {

  const [ref, inView] = useInView({
    threshold: 1
  });
  
  const [palette, setPalette] = useState();
  const [boxShadowString, setBoxShadowString] = useState('');

  useEffect(() => {
    if(!palette){getVibrant(img_link)}
  }, [])

  const getVibrant = (img_link) => {
    
    Vibrant.from(img_link).getPalette()
         .then((palette) => {
        // console.log(palette)
        let color = palette.LightVibrant.hex
        setPalette(palette)
        setBoxShadowString(
          `1px 1px ${color}, 
          1.5px 1.5px ${color},
          2px 2px ${color},
          2.5px 2.5px ${color},
          3px 3px ${color},
          3.5px 3.5px ${color}, 
          4px 4px ${color},
          4.5px 4.5px ${color}, 
          5px 5px ${color},
          5.5px 5.5px ${color}, 
          6px 6px ${color},
          6.5px 6.5px ${color}, 
          7px 7px ${color},
          7.5px 7.5px ${color}, 
          8px 8px ${color},
          8.5px 8.5px ${color}, 
          9px 9px ${color}`
        )
    })
  }

  const generateURL = (access_token,playlist_id,name,authCode) => {
    let payload = {
      access_token: access_token,
      code: authCode,
      id: playlist_id,
      name: name
    }
    let url_query = querystring.stringify(payload)

    return REDIRECT_BASE + url_query
  }

  return(
    <div>
    {boxShadowString ? 
    <Link href={generateURL(token,id,name,authCode)}>
            <ThemeProvider theme={card_theme}>
                  <Wrapper 
                    elevation={0} 
                    square={true}
                    palette={palette}
                    boxShadow={boxShadowString}
                    inView={inView}
                    ref={ref}
                  >
                    <CardActionArea>
                      <CardMedia
                        style = {{ height: "300", width: "max", paddingTop: '100%'}}
                        image={img_link}
                        title="Image title"
                      />
                      <CardContent className='playlist-card' style={{height: '100%'}}>
                        <Typography className='playlist-card'
                          theme={card_theme}
                          variant="h6"
                        >
                          {name}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Wrapper>
            </ThemeProvider>
          </Link>
    : ' '}
    </div>
  )
  }

export default Playlist;
