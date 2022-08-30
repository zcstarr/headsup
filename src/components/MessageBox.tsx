import React from "react";
import styled from "styled-components";
import { ThemeProp } from "./types"
import * as utils from '../lib/utils';
import { useNavigate } from "react-router-dom";

const MessageDialog = styled.dialog`

display: flex;
flex-direction: column;
width: 400px;
height:200px;
align-items: center;
border-width: 2px;
border-color: black;
border-style: solid;
background-color: white;
justify-content: space-around;
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
`

interface MessageBoxProp {
  children: React.ReactNode;
  open: boolean
  action?: ()=>void
}

export const MessageBox =(props: MessageBoxProp) => {
  const {children, open, action} = props;
  return (
    <MessageDialog>
      {children}
      <MessageButton onClick={()=>action ? action() : close()} >OK</MessageButton>
    </MessageDialog> 
    )
  }