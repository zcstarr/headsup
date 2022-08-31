import React, { useState } from "react";
import styled from "styled-components";
import { ThemeProp } from "./types"
import * as utils from '../lib/utils';
import { useNavigate } from "react-router-dom";


interface OverlayProps {
  show: boolean
}
const Overlay = styled.div<OverlayProps>`
z-index: ${({ theme }: ThemeProp) => theme.base.zIndices.modalOverlay};
background-color: ${({ theme }: ThemeProp) => theme.colors.black}30;
display: ${(props: OverlayProps)=>props.show ?  'inherit' : 'none'};
position: absolute;
top: 0;
width: 100vw;
height: 100vh;
`

const MessageDialog = styled.div`
position: relative;
top: 20%;
z-index: ${({ theme }: ThemeProp) => theme.base.zIndices.modalControl};
margin: 0 auto;
display: flex;
flex-direction: column;
width: 400px;
height:200px;
align-items: center;
border-width: 2px;
border-color: black;
border-style: solid;
justify-content: space-around;
background-color: white; 
font-weight: 700;
`
const MessageDialogContent = styled.div`
`
const MessageButton = styled.button`

position:relative;
border-style: solid;
border-color: black;
border-width:1px;
padding: 0.5rem;
width: 80%;
justify-self: flex-end;
background-color: ${({ theme }: ThemeProp) => theme.colors.primary};
`

interface MessageBoxProp {
  children: React.ReactNode;
  open: boolean
  onOk: ()=>void
}

export const delay= (time: number): Promise<void>=>{
  return new Promise((resolve)=>{
    setTimeout(resolve,time);
  })
}

export const MessageBox =(props: MessageBoxProp) => {
  const {children, open, onOk} = props;
  return (
    <Overlay show={open}>    
      <MessageDialog>
      <MessageDialogContent>
      {children}
    </MessageDialogContent>
    <MessageButton onClick={()=>onOk()}>OK</MessageButton>
    </MessageDialog> 
    </Overlay>

    )
  }
export default MessageBox;