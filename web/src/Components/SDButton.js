import React from 'react';
import styled from 'styled-components';

import {
    Button
} from '@material-ui/core';

const SquareButton = styled(Button)`
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

const SDButton = (props) => {
    return(
    <>
    <SquareButton
        {...props}
    >
        {props.children}
    </SquareButton>
    </>
    )
}

export default SDButton;