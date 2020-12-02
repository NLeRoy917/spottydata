import React, { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import styled from 'styled-components';
import axios from 'axios';

import {
    Container,
    TextField,
    CircularProgress,
    makeStyles,
} from '@material-ui/core';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Attribute from '../Components/AttributeSlider';
import AttributeDropdown from '../Components/AttributeDropdown';
import AttributeInput from '../Components/AttributeInput';
import SDButton from '../Components/SDButton';

const querystring = require('querystring');
const URL_BASE = process.env.REACT_APP_API_URL

const muiTheme = createMuiTheme({
    palette: {
        primary: {
            main: '#FFF'
        }
    },
    overrides:{
      MuiSlider: {
        thumb:{
        color: "white",
        },
        track: {
          color: '#007bff'
        },
        rail: {
          color: 'black'
        },
        markLabel: {
            color: 'black'
        },
        valueLabel: {
            color: 'white'
        }
      }
  }
  });

const PageHeaderWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    padding: 15px;
`

const PageHeader = styled.h2`
    font-size: 50px;
`

const PageSubHeader = styled.h3`
    font-weight: 200;
    font-size: 30px;
`

const SeedTypeWrapper = styled.div`
    padding: 10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
`

const ParameterForm = styled.div`
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
`

const FormSection = styled.div`
    padding: 5px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
`

const Select = styled.select`
    padding: 15px;
    margin: 10px;
    color: white;
    border: white solid 1px;
    border-radius: 0px;
    background: none;
    height: 100%;
    &:focus {
        outline: none;
    }
`

const SearchField = styled(Autocomplete)`
    width: 500px;
    margin: 10px;
    @media (max-width: 768px) {
		width: 60vw;
  }
`

const Input = styled.input` 
    border: white solid 1px;
    border-radius: 0px;
    background-color: rgba(0,0,0,0);
    padding: 10px;
    color: white;
    font-size: 20px;
    &:focus {
        outline: none;
    }
`

const useStyles = makeStyles({
    inputRoot: {
      color: 'white',
      borderRadius: 0,
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "white",
        color: 'white'
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "white",
        color: 'white'
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "white",
        color: 'white'
      }
    },
    inputLabel: {
        color: 'white',
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "white",
          color: 'white'
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "white",
          color: 'white'
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "white",
          color: 'white'
        }
      },
  });

const FindMusic = () => {

    const classes = useStyles();
    const [seedType, setSeedType] = useState('track');
    const [seeds, setSeeds] = useState([])
    const [query, setQuery] = useState(null)
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [accessToken, setAccessToken] = useState(null)
    const [attributes, setAttributes] = useState([]);

    const availableKeys = [
        {val: 0, label: 'C'}, {val: 1, label: 'C#'}, {val: 2, label: 'D'},
        {val: 3, label: 'D#'}, {val: 4, label: 'E'}, {val: 5, label: 'F'},
        {val: 6, label: 'F#'}, {val: 7, label: 'G'}, {val: 8, label: 'G#'},
        {val: 9, label: 'A'}, {val: 10, label: 'A#'}, {val: 11, label: 'B'},
    ]

    const availableModes = [
        {val: 0, label: 'Minor'}, {val: 1, label: 'Major'}
    ]
    /* The time signature ranges from 3 to 7 indicating time signatures of 3/4, to 7/4. A value of -1 may indicate no time signature, while a value of 1 indicates a rather complex or changing time signature. */
    const availableTimeSignatures = [
        {val: 3, label: '3/4'}, {val: 4, label:'4/4'}, {val: 5, label: '5/4'},
        {val: 6, label: '6/4'}, {val: 7, label: '7/4'}
    ]

    const clientCredentialsFlow = async () => {
        let hdrs = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(process.env.REACT_APP_CLIENT_ID + ':' + process.env.REACT_APP_CLIENT_SECRET)
        }
        let body ={
            grant_type: 'client_credentials'
        }

        let res = await axios.post(`https://accounts.spotify.com/api/token`, querystring.stringify(body), {headers: hdrs})
        if (res.status === 200) {
            let data = res.data
            setAccessToken(data.access_token)
        }
    }

    const debouncedSearch = useDebouncedCallback(
        // function
        (query) => {
          setQuery(query)
          setLoading(true)
          searchSeeds(query)
        },
        // delay in ms
        500
      );
    
    const handleSearchChange = (e) => {
        debouncedSearch.callback(e.target.value)
    }

    const handleSeedTypeChange = (e) => {
        setSearchResults([])
        setSeedType(e.target.value)
        //console.log(e.target.value)
    }

    const searchSeeds = async (query) => {
        if(seedType === 'genre'){
            let hdrs = {
                Authorization: `Bearer ${accessToken}`
            }
            let res = await axios.get(`https://api.spotify.com/v1/recommendations/available-genre-seeds`, {headers: hdrs})
            if(res.status === 200){
                let data = res.data
                setLoading(false)
                setSearchResults(data.genres.map(genre => {
                    return {name: genre}
                }))
            }
        } else{
        if(!query){
            setLoading(false)
            setSearchResults([])
        }
        else{
        let hdrs = {access_token: accessToken}
        let res = await axios.get(`${URL_BASE}/search?type=${seedType}&query=${query}`, {headers: hdrs})
        if(res.status === 200) {
            let data = await res.data
            setSearchResults(data.results)
            setLoading(false)
            // console.log(data.results)
        }
    }}
    }

    const findMusic = async () => {
      let hdrs = {access_token: accessToken}
      let body = {
        attributes: attributes,
        seeds: seeds
      }
      let res = await axios.post(`${URL_BASE}/recommendations`, body, {headers: hdrs})
      if(res.status === 200){
        let data = res.data
        console.log(data)
      }
    }

    useEffect(() => {
        if(!accessToken){clientCredentialsFlow()}
        console.log(seeds)
    }, [seeds])
    return (
        <>
         <Container>
         <PageHeaderWrapper>
           <PageHeader>
               Find new music
           </PageHeader>
         </PageHeaderWrapper>
         <PageHeaderWrapper>
         <PageSubHeader>
             1. Search for seed:
         </PageSubHeader>
         </PageHeaderWrapper>
         <SeedTypeWrapper>
           <Select onChange={handleSeedTypeChange}>
            <option value={'track'}>Track</option>
            <option value={'artist'}>Artist</option>
            <option value={'genre'}>Genre</option>
           </Select>
           <SearchField
            multiple
            classes={classes}
            id="search-bar"
            open={searchOpen}
            onOpen={() => {
              setSearchOpen(true);
            }}
            onClose={() => {
              setSearchOpen(false);
            }}
            onChange={(e,val) => {
                setSeeds(val)
                }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => `${option.name}, ${option.artists ? option.artists[0].name : ''}`}
            options={searchResults}
            loading={loading}
            renderInput={(params) => (
            <TextField
              variant="standard"
              onChange={handleSearchChange}
              {...params}
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? <CircularProgress size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
            )}
           />
           </SeedTypeWrapper>
        <PageHeaderWrapper>
         <PageSubHeader>
             2. Tweak parameters:
         </PageSubHeader>
         </PageHeaderWrapper>
         <ThemeProvider theme={muiTheme}>
           <ParameterForm>
               <FormSection>
                   <Attribute
                     attributes={attributes}
                     setAttributes={setAttributes}
                     name="acousticness"
                     tooltip="A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic."
                   />
                   <Attribute
                     attributes={attributes}
                     setAttributes={setAttributes}
                     tooltip="Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy."
                     name="energy"
                   />
                   <Attribute
                     attributes={attributes}
                     setAttributes={setAttributes}
                     tooltip="float	Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable."
                     name="danceability"
                   />
               </FormSection>
               <FormSection>
                   <Attribute
                     attributes={attributes}
                     setAttributes={setAttributes}
                     tooltip="Predicts whether a track contains no vocals. “Ooh” and “aah” sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly “vocal”. The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0."
                     name="instrumentalness"
                   />
                   <Attribute
                     attributes={attributes}
                     setAttributes={setAttributes}
                     tooltip="Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 0.8 provides strong likelihood that the track is live."
                     name="liveness"
                   />
                   <Attribute
                     attributes={attributes}
                     setAttributes={setAttributes}
                     tooltip="The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). Values typical range between -60 and 0 db."
                     name="loudness"
                   />
               </FormSection>
               <FormSection>
                  <Attribute
                     attributes={attributes}
                     setAttributes={setAttributes}
                     tooltip="The popularity of the track. The value will be between 0 and 100, with 100 being the most popular. The popularity is calculated by algorithm and is based, in the most part, on the total number of plays the track has had and how recent those plays are."
                     defaultVal={50}
                     min={0}
                     max={100}
                     name="popularity"
                   />
                   <Attribute
                     attributes={attributes}
                     setAttributes={setAttributes}
                     tooltip="Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 0.33 most likely represent music and other non-speech-like tracks."
                     name="speechiness"
                   />
                   <Attribute
                     attributes={attributes}
                     setAttributes={setAttributes}
                     tooltip="A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry)."
                     name="valence"
                   />
               </FormSection>
               <FormSection>
                   <AttributeDropdown
                     attributes={attributes}
                     setAttributes={setAttributes}
                     name="key"
                     options={availableKeys}
                     tooltip="The key the track is in. Integers map to pitches using standard Pitch Class notation. E.g. 0 = C, 1 = C♯/D♭, 2 = D, and so on."
                   />
                   <AttributeDropdown
                    attributes={attributes}
                    setAttributes={setAttributes}
                    name="mode"
                    options={availableModes}
                    tooltip="Mode indicates the modality (major or minor) of a track, the type of scale from which its melodic content is derived. Major is represented by 1 and minor is 0."
                   />
                   <AttributeDropdown
                    attributes={attributes}
                    setAttributes={setAttributes}
                    name="time_signature"
                    title="Time Signature"
                    options={availableTimeSignatures}
                    tooltip="An estimated overall time signature of a track. The time signature (meter) is a notational convention to specify how many beats are in each bar (or measure)."
                   />
               </FormSection>
               <FormSection>
               <AttributeInput
                     attributes={attributes}
                     setAttributes={setAttributes}
                     name="bpm"
                     title="Tempo"
                     mask="999 bpm"
                   />
                   <AttributeInput
                    attributes={attributes}
                    setAttributes={setAttributes}
                    name="duration"
                    mask="99:99 min"
                   />
               </FormSection>
           </ParameterForm>
           <PageHeaderWrapper>
         <PageSubHeader>
             3. Search:
         </PageSubHeader>
         </PageHeaderWrapper>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
            <SDButton
              onClick={() => {findMusic()}}
            >
              Find Music
            </SDButton>
          </div>
           </ThemeProvider>
          </Container>
          <br></br>
        </>
    )
}

export default FindMusic;
