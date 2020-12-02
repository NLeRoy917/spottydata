import { Switch } from '@material-ui/core';
import React, {useState} from 'react';
import styled from 'styled-components';

import InputMask from "react-input-mask";

const Wrapper = styled.div`
    /* border: white solid 1px; */
    border-radius: 5px;
    padding: 15px;
    margin: 10px;
    width: 250px;
    height: 100%;
    @media (max-width: 1024px) { /* iPad in portrait  */
		width: 100%;
    }
`

const Title = styled.h4`
    font-size: 24px;
    font-weight: 500px;
    text-align: left;
`

const LowerWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

const Input = styled(InputMask)`
    width: 100%;
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

const GoalSelect = styled.select`
    margin: 10px;
    margin-right: 15px;
    padding: 5px;
    font-size: 14px;
    color: white;
    border: white solid 1px;
    border-radius: 0px;
    background: none;
    height: 100%;
    &:focus {
        outline: none;
    }
`

const AttributeInput = ({ attributes, setAttributes, inputType, name, mask, title }) => {

    const [checked, setChecked] = useState(false);

    const toggleChecked = () => {
        setAttributes({...attributes, [name]: {...attributes[name],
            on: !checked
        }})
        setChecked(!checked)
    }

    const handleChange = (e) => {
        // replace all numeric characters to remove mask
        let value = e.target.value.replace(/\D/g,'');
        setAttributes({...attributes, [name]: {value: value, on: true}})
        setChecked(true)
    }

    return (
        <>
         <Wrapper>
         <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', margin: '5px'}}>
         <Title>
           {title || (name.charAt(0).toUpperCase() + name.slice(1))}
         </Title>
         
        <Switch size="normal" checked={checked} onChange={toggleChecked} color="primary"/>
        </div>
           <LowerWrapper>
           <GoalSelect onChange={(e) => setAttributes({...attributes, [name]: {...attributes[name], goal: e.target.value}})}>
                <option value='target'>Target</option>
                <option value='min'>Min</option>
                <option value='max'>Max</option>
        </GoalSelect>
            <Input
              mask={mask}
              onChange={handleChange} 
              value={attributes[name] ? attributes[name].value : ''} 
              alwaysShowMask={true}
              maskChar="-"
              type={inputType}
            />
            
           </LowerWrapper>
         </Wrapper>
        </>
    )
}

export default AttributeInput;