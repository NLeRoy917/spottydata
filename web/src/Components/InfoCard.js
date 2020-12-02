import React from 'react';
import styled from 'styled-components';

import {
    Paper,
    Tooltip
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

const FullCard = styled(Paper)`
    padding: 30px;
    background: #212529;
    height: 100%;
    color: inherit;
`

const TooltipWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

const InnerWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    direction: row;
    justify-content: space-between;
    align-items: center;
    height: 80%;
`

const InfoTitle = styled.h4`
    text-align: left;
    font-weight: 500;
    font-size: 2.0rem;

`

const InfoContent = styled.p`
    text-align: left;
    font-size: 1.5rem ;
`

const InfoCard = (props) => {
    return(
        <>
          <FullCard
            elevation={3}
          >
          <TooltipWrapper>
          <InfoTitle>
              {props.title}
          </InfoTitle>
            <Tooltip title={props.tooltip}>
              <InfoIcon />
            </Tooltip>
          </TooltipWrapper>
          <InnerWrapper>
          <div>
          <InfoContent>
              {props.content}
          </InfoContent>
          </div>
          <div>
            {props.children}
          </div>
          </InnerWrapper>
          </FullCard>
        </>
    )
}

export default InfoCard;