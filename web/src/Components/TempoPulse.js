import React from 'react';
import styled from 'styled-components';

const Pulse = styled.div`

  left: 50%;
  top: 50%;
  position: relative;
  transform: translateX(-50%) translateY(-50%);
  width: 30px;
  height: 30px;
  
  &:before {
    content: '';
    position: absolute;
    display: block;
    width: 300%;
    height: 300%;
    box-sizing: border-box;
    margin-left: -100%;
    margin-top: -100%;
    border-radius: 45px;
    background-color: ${props => props.color};
    animation: pulse-ring ${props => 60/props.bpm}s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
  }
  
  &:after {
    content: '';
    position: absolute;
    left: 0; 
    top: 0;
    display: block;
    width: 100%;
    height: 100%;
    background-color: white;
    border-radius: 15px;
    box-shadow: 0 0 8px rgba(0,0,0,.3);
    animation: pulse-dot 1.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) -.4s infinite;
  }


@keyframes pulse-ring {
  0% {
    transform: scale(.33);
  }
  80%, 100% {
    opacity: 0;
  }
}

@keyframes pulse-dot {
  0% {
    transform: scale(.8);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(.8);
  }
}
`

const TempoPulse = ({ bpm, color }) => {

    return(
        <Pulse color={color} bpm={bpm}></Pulse>
    )

}

export default TempoPulse;