import React, {useState} from 'react';
import styled from 'styled-components';

import SearchIcon from '@material-ui/icons/Search';
import {IconButton} from '@material-ui/core'

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    outline: none;
`

const ArrowWrapper = styled.div`
    border-radius: 10px;
    border: white 2px solid;
`

const Search = styled.input`
    border-radius: 0px;
    background-color: white;
    border: solid white 1px;
    border-radius: 25px;
    padding: 10px;
    padding-left: 30px;
    padding-right: 30px;
    height: 50px;
    width: 300px;
    font-size: 16px;
    box-shadow: rgba(0, 0, 0, 0.6) 3px 3px;
    transition: ease-in-out 0.1s;
    margin: 20px;

    && {
	@media (max-width: 768px) {
        width: 70%
    }
    }
    
    &:focus {
        outline: none;
        box-shadow: rgba(0, 0, 0, 0.6) 6px 6px;
    }
`

const SearchBar = ({ setQuery, runSearch }) => {
    return(
        <>
         <Wrapper>
          <Search onKeyDown={(e) => {if(e.keyCode === 13){runSearch()}}} onChange={(e) => {setQuery(e.target.value)}}/>
           <IconButton fill="white" style={{outline: 'none', fill: 'white'}}>
            <SearchIcon onClick={()=> runSearch()}fontSize="large" fill="white" style={{fill: 'white'}}/>
           </IconButton>
         </Wrapper>
        </>
    )
}

export default SearchBar;