import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Cookies from 'universal-cookie';

import Layout from '../Components/Layout';
import SearchBar from '../Components/SearchBar';
import SDButton from '../Components/SDButton';
import Song from '../Components/Song';

import {
    Typography,
} from '@material-ui/core';

import axios from 'axios';
const cookies = new Cookies();

const URL_BASE = process.env.REACT_APP_API_URL

const LandingText = styled(Typography)`
	font-weight: 400 !important;
`

const VerticalCenter = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 30px;
`

const SearchButton = styled.button`
    margin: 20px;
    border: white solid 1px;
    padding: 10px;
    border-radius: 25px;
    width: 150px;
    color: white;
    background-color: Transparent;
    background-repeat:no-repeat;
    cursor:pointer;
    overflow: hidden;
    outline:none;
    transition: ease-in-out 0.1s;

    &:hover {
        background: white;
        color: rgba(0, 0, 0, 0.6);
        border: rgba(0, 0, 0, 0.6) solid 1px;
    }

    &:focus {
        outline: none;
    }
`

const ResultsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
`

const SearchPage = ({ }) => {

    const [query, setQuery] = useState('')
    const [accessToken, setAccessToken] = useState(cookies.get('accessToken'))
    const [results, setResults] = useState([]);
    const [noResults, setNoResults] = useState(false);

    const search = async () => {
        if(!query) {
            setResults([])
            return
        }
        let hdrs = {
          'access_token': accessToken
        }
        let res = await axios.get(`${URL_BASE}/search?type=track&query=${query}`, {headers: hdrs})
        if(res.status === 200) {
            let data = await res.data
            setResults(data.results)
            if(data.results.length === 0){setNoResults(true)}
            else{setNoResults(false)}
            // console.log(data.results)
        }
    }

    return(
        <>
        <Layout>
          <VerticalCenter>
            <LandingText
                variant="h4"
                gutterBottom
            >
                Search for a song:
            </LandingText>
            <SearchBar runSearch={search} setQuery={setQuery}/>
            {/* <SearchButton>
                  Search
            </SearchButton> */}
            {
                noResults ? <><p>No Results :(</p></> : ''
            }
            {
              results.map((result, key) => {
                  return(
                      <Song result={result} accessToken={accessToken} />
                  )
              })
          }

          </VerticalCenter>
        </Layout>
        </>
    )
}

export default SearchPage;