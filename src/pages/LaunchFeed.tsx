import * as config from "../lib/config";
import React, { useContext, useEffect, useState } from "react";

import { login,  mintToken } from "../lib/login";
import fetchLSP8Assets from "../lib/lsp8";
import * as storage from "../lib/storage";
import { getPersonalFeeds, launchNewNFTFeed, setTokenMetadata } from "../lib/feedLauncher";
import * as utils from "../lib/utils";
import Button, { CommonRoundedButton, CommonSquareButton } from "../components/button";
import * as inputs from '../components/Input';
import { MessageBox } from "../components/MessageBox";
import AppBar from "../components/AppBar";
import { FileUploader } from "react-drag-drop-files";
import styled from "styled-components";
const fileTypes = ["JPG", "PNG", "GIF"];
import {apiClient} from "../lib/config";
import { useNavigate } from "react-router-dom";
function DragDrop() {
  const [file, setFile] = useState<File | undefined>();
  useEffect(()=> {
    if(file){
     
    }
  })
  const handleChange = (file: File) => {
    console.log(file.arrayBuffer())
    setFile(file);
  };
  return (
    <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
  );
}

const Container = styled.div`
padding: 20px;
display: flex;
flex-direction: column;
justify-content: space-between;
align-items: center;
`;
const InputContainer = styled.div`
padding: 20px;
display: flex;
flex-direction: column;
align-items: left;
`
const MyAlert = styled.dialog`
 

`

const LaunchForm = () => {
  const [feedSymbol, setFeedSymbol] = useState<string | undefined>('');
  const [feedName, setFeedName] = useState<string | undefined>('');
  const [feedDesc, setFeedDesc] = useState<string | undefined>('');
  const [feedAddr, setFeedAddr] = useState<string | undefined>('');
  const [coverImage, setCoverImage] = useState<File | undefined>();
  const [submission, setSubmission] = useState<boolean>(false);
  const [state, dispatch] = useContext(storage.globalContext);
  const nav = useNavigate()
  const {primaryAccount} = state;

  

  const handleChange = (file: File) => {
    setCoverImage(file);
  };
  useEffect(()=>{
    async function launchFeed(){
    if(submission && primaryAccount){
      setSubmission(false);
      if(feedSymbol && feedName && feedDesc && coverImage && !feedAddr) {
      // TODO rename to metadata
      try {
        const metadata = await apiClient.createNftFeedMetadata(feedSymbol, feedName, feedDesc)
        if(!metadata.jsonUrl) throw new Error('jsonurl metadata fail');
        dispatch({
          type: storage.ActionType.SHOW_MSG_BOX,
          payload: {show: true, message: 'Sign transaction 1 of 2 with your wallet'}});
        const address = await launchNewNFTFeed(primaryAccount, feedSymbol, feedName, metadata.jsonUrl);
        dispatch({
          type: storage.ActionType.SHOW_MSG_BOX,
          payload: {show: true, message: 'Transaction 1 of 2 complete'}});
        setFeedAddr(address);
          const formData: FormData = new FormData();
          formData.append("coverImage", coverImage, coverImage.name);
          formData.append("feedDesc", feedDesc);
          formData.append("feedAddr", address);
          const result = await fetch(config.COVER_META_ROUTE, {
            method: "POST",
            body: formData,
            mode: "cors",
          });
          const value = (await result.json()) as {
            jsonUrl: string;
            cid: string;
          };
        dispatch({
          type: storage.ActionType.SHOW_MSG_BOX,
          payload: {show: true, message: 'Sign transaction 2 of 2 with your wallet'}});
          await setTokenMetadata(primaryAccount, address, value.jsonUrl);
        dispatch({
          type: storage.ActionType.SHOW_MSG_BOX,
          payload: {show: true, message: 'Transaction 2 of 2 complete'}});
          nav(`/feed/${address}`)
      }catch(e){
        dispatch({
          type: storage.ActionType.SHOW_MSG_BOX,
          payload: {show: true, message: 'Error something went wrong'}});
          console.error(e)
      }finally {
        setSubmission(false);
      }
      }else {
        if(!feedSymbol || !feedName || !feedDesc || !coverImage){
        dispatch({
          type: storage.ActionType.SHOW_MSG_BOX,
          payload: {show: true, message: 'You must set symbol, name, image, and description'}});
        }
          setSubmission(false)
        }
      }
    }
    launchFeed()
  },[submission, primaryAccount])
  
  return (
    <Container>
     <InputContainer>
      <inputs.InputLabel>Enter NFT Feed Symbol</inputs.InputLabel>
      <inputs.CommonInput onChange={(event)=>setFeedSymbol(event.target.value)}/>
    </InputContainer>
    <InputContainer>
     <inputs.InputLabel>Enter NFT Feed Name</inputs.InputLabel>
      <inputs.CommonInput onChange={(event)=>setFeedName(event.target.value)}/>
    </InputContainer>
    <InputContainer>
     <inputs.InputLabel>Enter NFT Feed Description:</inputs.InputLabel>
      <inputs.CommonInput onChange={(event)=>setFeedDesc(event.target.value)}/>
    </InputContainer>
      <InputContainer>
        <inputs.InputLabel>Add Cover Image:</inputs.InputLabel>
        <FileUploader
          handleChange={handleChange}
          name="file"
          types={fileTypes}
          multiple={false}
        />
      </InputContainer>
    <InputContainer>
      <CommonSquareButton onClick={()=>setSubmission(true)}>Launch Feed {submission}</CommonSquareButton>
    </InputContainer>
    </Container>
  )
}

export default () => {
  const [state , dispatch] = useContext(storage.globalContext);
  const {activeFeedAddr, primaryAccount} = state;

  return (
      <LaunchForm/>
  );
};
