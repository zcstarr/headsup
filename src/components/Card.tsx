import React from "react";
import styled from "styled-components";
import { ThemeProp } from "./types"
import * as utils from '../lib/utils';
import { useNavigate } from "react-router-dom";

const CardContainer = styled.div`
 display: flex;
 flex-direction: column;
 border-style: solid;
 border-width: 1px;
 border-radius: 2px;
 border-color: ${({theme}: ThemeProp)=>theme.colors.gray};
 cursor: pointer;
 transition: border-color 0.1s ease-in;
 :hover {
  border-color: black;
}

`

const CardDataContainer = styled.div`
 padding: 10px;
 width: 300px;
 height: 375px;

`

const CardImageContainer = styled.div`


`

const CardTitleContainer = styled.div`


`

const CardImage = styled.img`
 

`

const CardTitle = styled.span`

  text-align:left;

`

export interface CardProps {

  title: string,
  imageSrc: string,
  feedAddr: string,
  link: string,
}

export const Card =(props: CardProps) => {
  const nav = useNavigate();
  const {title, imageSrc} = props;
  return (
    <CardContainer onClick={()=>nav(props.link)}>
       <CardDataContainer>
       <CardImageContainer >
        <CardImage src={imageSrc}/> 
       </CardImageContainer>
       <CardTitleContainer>
       <CardTitle>{title}</CardTitle>
      </CardTitleContainer>
    </CardDataContainer>
    </CardContainer>
  )
}

export const CardGridContainer = styled.div`
max-width: 500px;
display: grid;
grid-auto-rows: auto;
grid-template-columns: 1fr;
grid-gap: 40px;
align-self:center;
max-width: fit-content;

${({ theme }: ThemeProp) => theme.base.mediaQueries.lg} {
  grid-template-columns: 1fr 1fr;
  align-self:center;
}
${({ theme }: ThemeProp) => theme.base.mediaQueries.xl} {
  grid-template-columns: 1fr 1fr 1fr;
}

`

export const CardsGrid = (props: {cards: CardProps[]})=>{

  const {cards} = props;
  return (<CardGridContainer>
  { cards.map((card)=>
   (
    <Card {...card} key={utils.getUniqueKey('entrycard_')}/>
    ))} 
  </CardGridContainer>)
} 