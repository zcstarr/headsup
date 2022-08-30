import React, { ReactNode } from "react";
import styled from "styled-components";
import { ThemeProp } from "./types"
import * as utils from '../lib/utils';
import { useNavigate } from "react-router-dom";
import {CommonButton} from "./button";

export interface MessageProp {
  show: boolean,
  // eslint-disable-next-line react/require-default-props
  children?: ReactNode,
  width?: string,
  height?: string,
  title: string,
  // eslint-disable-next-line react/require-default-props
  titleOk?: string,
  // eslint-disable-next-line react/require-default-props
  titleCancel? : string,
  // eslint-disable-next-line react/require-default-props
  onOk?: ()=> void,
  // eslint-disable-next-line react/require-default-props
  onCancel?: ()=> void
}


const MessageBoxContainer = styled.div<{active: boolean, width?:string, height?:string}>`
  height: ${(props)=>props.height ? props.height : "400px"};
  width: ${(props)=>props.width ? props.width : "350px"};
  z-index: ${({theme}: ThemeProp)=>theme.base.zIndices.modal};
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  position: fixed;
  background-color: white;
  visibility: ${(props: {active: boolean})=>props.active ? "visible": "hidden"};
  display: flex;
  flex-direction: column;
  filter: drop-shadow(7px 7px 19px #000000A3);

`
const MessageBoxTitleContainer = styled.div`
  flex: 1;
  justify-content: space-between;
  align-items: center;
  display: flex;
  font-weight: 900;
`

const MessageBoxTitle = styled.span`
  margin-left: 20px;
  font-size: 1.2rem;
  text-transform: capitalize;
`
export const MessageBoxExit = styled.div`
  font-size: 1.1rem;
  margin-right: 20px;
  color: ${({theme}: ThemeProp)=>theme.colors.successSecondary};
  cursor: pointer;
`

const MessageBoxBodyContainer = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top-width: 2px;
  border-top-style: solid;
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-color: ${({theme}: ThemeProp)=>theme.colors.gray};
`

const MessageBoxControlContainer = styled.div`
  flex: 1;

`
const MessageBoxControl = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`

const OkButton = styled.div`
width: 100px;
height: 50px;
font-weight: 900;
align-text: center;
text-transf
border-color: black;
border-width: 2px;
cursor: pointer;
background-image: linear-gradient(to right,
    ${({theme}: ThemeProp)=>theme.colors.primary}7F,
    ${({theme}: ThemeProp)=>theme.colors.primary}B3);
${({ theme }: ThemeProp) => theme.base.mediaQueries.sm} {
  width: 80%;
}
`
const MessageBoxOverlay = styled.div<{show: boolean}>` 
filter: blur(5px) grayscale(50%);
transition: background .05s ease-in;
opacity: ${(props) => props.show ? 1 : 0};
background: ${(props) => props.show ? `${props.theme.colors.black}E6` : `${props.theme.colors.primary}00`};
z-index: ${ (props) => props.show ? `${props.theme.base.zIndices.modalOverlay}` : -1};
  position: fixed;
  top: 0;
  left: 0;
  min-width: 100%;
  margin: 0;
  height: 100%;
`
const OverlayShrink = styled.div`
transform: scale(0.9)
` 
export interface  MessageBoxProps {
  onOk: ()=>void, 
  onCancel: ()=> void, 
  show: boolean

}
/*
        <!--<MessageBoxTitleContainer>
          <MessageBoxTitle>{title}</MessageBoxTitle>
          <MessageBoxExit onClick={onCancel}>X</MessageBoxExit>
        </MessageBoxTitleContainer> -->
        */
export const MessageBox: React.FC<MessageProp> = (props: MessageProp)=> {
  const {onOk, onCancel, title, titleOk, show, children} = props;

  return(
    <>
      <MessageBoxOverlay show={show} onClick={onCancel}>
        <OverlayShrink/>
      </MessageBoxOverlay>
      <MessageBoxContainer id={`message-box-${show}`} className={ show ? "messagebox showing" : "messagebox"} active={show}>
       <MessageBoxTitleContainer>
          <MessageBoxTitle>{title}</MessageBoxTitle>
          <MessageBoxExit onClick={onCancel}>X</MessageBoxExit>
        </MessageBoxTitleContainer>
        <MessageBoxBodyContainer>
          {children}
        </MessageBoxBodyContainer>
        <MessageBoxControlContainer>
          <MessageBoxControl>
            <OkButton onClick={onOk}> {titleOk || "Ok"}</OkButton> 
          </MessageBoxControl>
        </MessageBoxControlContainer>
      </MessageBoxContainer>
    </>
  )
}

export default MessageBox;