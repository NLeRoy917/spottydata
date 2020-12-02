import React, {useState} from 'react';
import styled from 'styled-components';

import { Switch, Tooltip } from '@material-ui/core';

const Wrapper = styled.div`
    /* border: white solid 1px; */
    border-radius: 5px;
    padding: 15px;
    margin: 10px;
    @media (max-width: 1024px) { /* iPad in portrait  */
		width: 100%;
    }
`

const Select = styled.select`
    padding: 12px;
    margin: 10px;
    color: white;
    border: white solid 1px;
    border-radius: 0px;
    background: none;
    height: 100%;
    font-size: 12px;
    width: 100%;
    &:focus {
        outline: none;
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

const AttributeDropdown = ({attributes, setAttributes, name, options, title, tooltip}) => {

    const [checked, setChecked] = useState(false)

    const toggleChecked = () => {
        setAttributes({...attributes, [name]: {...attributes[name],
            on: !checked
        }})
        setChecked(!checked)
    }

    const handleChange = (e) => {
        setChecked(true)
        setAttributes({...attributes, [name]: {...attributes[name], value: e.target.value, on: true}})
    }

    return(
        <>
        <Wrapper>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', margin: '5px'}}>
        <Title>
            {title || (name.charAt(0).toUpperCase() + name.slice(1))}
        </Title>
        <Switch size="normal" checked={checked} onChange={toggleChecked} color="primary"/>
        </div>
         <LowerWrapper>
          <Select
            value={attributes[name] ? attributes[name].value : undefined}
            onChange={handleChange}
          >
              <option value={undefined}>Any</option>
              {
                options.map((o) => {
                    return (<option value={o.val}>{o.label}</option>)
                }
                    )
              }
          </Select>
          </LowerWrapper>
          </Wrapper>
        </>
    )
}

export default AttributeDropdown;