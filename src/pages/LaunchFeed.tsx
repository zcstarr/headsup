import * as config from "../lib/config";
import React, { useContext, useEffect, useState } from "react";

import { login,  mintToken } from "../lib/login";
import fetchLSP8Assets from "../lib/lsp8";
import * as storage from "../lib/storage";
import { getFeeds, launchNewNFTFeed } from "../lib/feedLauncher";
import * as utils from "../lib/utils";
import Button, { CommonRoundedButton } from "../components/button";
import * as inputs from '../components/Input';
import AppBar from "../components/AppBar";
import { FileUploader } from "react-drag-drop-files";
import styled from "styled-components";
const fileTypes = ["JPG", "PNG", "GIF"];
import {apiClient} from "../lib/config";
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

const LaunchForm = () => {
  const [feedSymbol, setFeedSymbol] = useState<string | undefined>('');
  const [feedName, setFeedName] = useState<string | undefined>('');
  const [feedDesc, setFeedDesc] = useState<string | undefined>('');
  const [submission, setSubmission] = useState<boolean>(false);
  const [state] = useContext(storage.globalContext);
  const {primaryAccount} = state;

  useEffect(()=>{
    async function launchFeed(){
    if(submission && primaryAccount){
      alert('here')
      if(feedSymbol && feedName && feedDesc) {
      // TODO rename to metadata
      alert(feedSymbol + feedName + feedDesc)
      try {
        const metadata = await apiClient.createNftFeedMetadata(feedSymbol, feedName, feedDesc)
        if(!metadata.jsonUrl) throw new Error('jsonurl metadata fail');
        const address = await launchNewNFTFeed(primaryAccount, feedSymbol, feedName, metadata.jsonUrl);
        console.log(address)
        alert(address)
      }catch(e){
          console.error(e)
      }finally {
        setSubmission(false);
      }
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
      <CommonRoundedButton onClick={()=>setSubmission(true)}>Launch Feed {submission}</CommonRoundedButton>
    </InputContainer>
    </Container>
  )
}

export default () => {
  const [state , dispatch] = useContext(storage.globalContext);
  const {activeFeedAddr, primaryAccount} = state;
  const [feedAddr, setFeedAddr] = useState<string | undefined>(activeFeedAddr);
  const [feeds, setFeeds] = useState<string[]>([]);


  function getUniqueKey(prefix: string): string {
    return `${prefix}_${Math.random()}`;
  }

  const displayMetadata = async (feed: string) => {
    if (primaryAccount) {
      const assets = await fetchLSP8Assets(
        feed,
        primaryAccount,
        config.web3.currentProvider
      );
      alert(JSON.stringify(assets));
    }
  };
  const displayFeeds = () =>
    feeds.map((f) => <li key={getUniqueKey("feed_")}>{f}</li>);

  useEffect(() => {
    async function checkFeeds() {
      if (primaryAccount) {
        const feeds = utils.parseListResult(
          await getFeeds(primaryAccount, 0, 100)
        ) as string[];
        setFeeds(feeds);
        displayMetadata(feeds[0]);
        setFeedAddr(feeds[0]);
      }
    }
    checkFeeds();
  }, [primaryAccount]);

  return (
      <LaunchForm/>
  );
};
