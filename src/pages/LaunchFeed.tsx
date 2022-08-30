import * as config from "../lib/config";
import React, { useContext, useEffect, useState } from "react";

import { login,  mintToken } from "../lib/login";
import fetchLSP8Assets from "../lib/lsp8";
import * as storage from "../lib/storage";
import { getPersonalFeeds, launchNewNFTFeed, setTokenMetadata } from "../lib/feedLauncher";
import * as utils from "../lib/utils";
import Button, { CommonRoundedButton } from "../components/button";
import * as inputs from '../components/Input';
import { MessageBox } from "../components/MessageBox";
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
const MyAlert = styled.dialog`
 

`

const LaunchForm = () => {
  const [feedSymbol, setFeedSymbol] = useState<string | undefined>('');
  const [feedName, setFeedName] = useState<string | undefined>('');
  const [feedDesc, setFeedDesc] = useState<string | undefined>('');
  const [feedAddr, setFeedAddr] = useState<string | undefined>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [coverImage, setCoverImage] = useState<File | undefined>();
  const [submission, setSubmission] = useState<boolean>(false);
  const [message, setMessage] = useState<string>()
  const [state] = useContext(storage.globalContext);
  const {primaryAccount} = state;

  

  const handleChange = (file: File) => {
    console.log(file.arrayBuffer());
    setCoverImage(file);
  };
  useEffect(()=>{
    async function launchFeed(){
    if(submission && primaryAccount){
      alert('here')
      if(feedSymbol && feedName && feedDesc && !feedAddr) {
      // TODO rename to metadata
      alert(feedSymbol + feedName + feedDesc)
      try {
        const metadata = await apiClient.createNftFeedMetadata(feedSymbol, feedName, feedDesc)
        if(!metadata.jsonUrl) throw new Error('jsonurl metadata fail');
        const address = await launchNewNFTFeed(primaryAccount, feedSymbol, feedName, metadata.jsonUrl);
        setOpenDialog(true)
        setFeedAddr(address);
          const formData: FormData = new FormData();
          if(coverImage) formData.append("coverImage", coverImage, coverImage.name);
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
          await setTokenMetadata(primaryAccount, address, value.jsonUrl);
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
        <inputs.InputLabel>Add Cover Image:</inputs.InputLabel>
        <FileUploader
          handleChange={handleChange}
          name="file"
          types={fileTypes}
          multiple={false}
        />
      </InputContainer>
    <InputContainer>
      <CommonRoundedButton onClick={()=>setSubmission(true)}>Launch Feed {submission}</CommonRoundedButton>
    </InputContainer>
    <dialog>
      <div>One More Transaction Required.</div>
      <div>Setting up your token feed data</div>
    </dialog>
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
          await getPersonalFeeds(primaryAccount, 0, 100)
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
