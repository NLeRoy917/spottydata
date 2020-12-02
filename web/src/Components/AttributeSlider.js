import React, {useState} from 'react';
import styled from 'styled-components';

import {
    Slider,
    IconButton,
    Tooltip,
    Switch
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

const Parameter = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    /* border: white solid 1px; */
    border-radius: 5px;
    padding: 15px;
    margin: 10px;
    @media (max-width: 1024px) { /* iPad in portrait  */
		width: 100%;
    }
`

const ParameterTitle = styled.h4`
    font-size: 24px;
    font-weight: 500px;
`

const GoalSelect = styled.select`
    margin: 5px;
    margin-right: 15px;
    padding: 5px;
    font-size: 12px;
    color: white;
    border: white solid 1px;
    border-radius: 0px;
    background: none;
    height: 100%;
    &:focus {
        outline: none;
    }
`

const Attribute = ({attributes, setAttributes, name, defaultVal, tooltip, min, max}) => {

    const [checked, setChecked] = useState(false);
    const [title, setTitle] = useState(name.charAt(0).toUpperCase() + name.slice(1))

    const toggleChecked = () => {
        setAttributes({...attributes, [name]: {...attributes[name],
            on: !checked
        }})
        setChecked(!checked)
    }

    return(
      <>
        <Parameter>
            <div style={{width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between'}}>
              <div>
              <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between'}}>
              <ParameterTitle>
                  {title}
              </ParameterTitle>
              <Tooltip enterTouchDelay={100} title={tooltip} style={{margin: 10}}>
                <InfoIcon fontSize="small"/>
              </Tooltip>
              </div>
              </div>
              <div>
              <Switch size="normal" checked={checked} onChange={toggleChecked} color="primary"/>
              </div>
            </div>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', gap: '10px'}}>
            <GoalSelect onChange={(e) => setAttributes({...attributes, [name]: {...attributes[name], goal: e.target.value}})}>
                <option value='target'>Target</option>
                <option value='min'>Min</option>
                <option value='max'>Max</option>
            </GoalSelect>
            <Slider
              style={{width: 200}}
              aria-label={`${name}-slider`}
              min={min || 0}
              max={max || 1}
              step={0.01}
              valueLabelDisplay="auto"
              valueLabelFormat={(x) => `${x}`}
              defaultValue={defaultVal || 0.5}
              onChange={(e,val)=> {
                   if(!checked){
                       toggleChecked()
                       setAttributes({...attributes, [name]: {...attributes[name], value: val, on: true}})
                   } else {
                   setAttributes({...attributes, [name]: {...attributes[name], value: val}})
                   }
                   }}
            />
            </div>
        </Parameter>
     </>
    )
}

export default Attribute;