import * as config from "../lib/config";
import React, { useContext, useEffect, useState } from "react";

import { login,  mintToken } from "../lib/login";
import fetchLSP8Assets from "../lib/lsp8";
import * as storage from "../lib/storage";
import { getFeeds, getIssue, getNumberOfIssue, getOwner, launchNewNFTFeed } from "../lib/feedLauncher";
import {CardsGrid, CardProps} from "../components/Card";
import * as utils from "../lib/utils";
import Button, { CommonRoundedButton } from "../components/button";
import * as inputs from '../components/Input';
import AppBar from "../components/AppBar";
import { FileUploader } from "react-drag-drop-files";
import styled from "styled-components";
const fileTypes = ["JPG", "PNG", "GIF"];
import {apiClient} from "../lib/config";
import { useParams, useNavigate } from "react-router-dom";
import { HeadsUpDatum } from "../generated/headsup_datum_schema";
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
const FeedItem = styled.li`
padding: 20px;
display: flex;
flex-direction: column;
align-items: left;
`
const ControlButton = styled(CommonRoundedButton)` 
padding: 10px;
margin: 10px;
display: flex;
flex-direction: column;
`
const ControlContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-start: left;
`

const FeedControls = (props: {owner: boolean}) => {
  const {owner} = props;
  const nav = useNavigate();
  const {feedAddr} = useParams();
  return (
  <ControlContainer>
    <ControlButton>Mint</ControlButton>
    {owner && <>
    <ControlButton onClick={()=>nav(`/feeds/${feedAddr}/new-entry`)}>Create Entry</ControlButton>
    <ControlButton onClick={()=>nav(`/feeds/${feedAddr}/cover`)}>Edit Cover</ControlButton>
    </>
    }
</ControlContainer>
  )

}
const FeedMetadata = () => {
  const value ='x';
  return (
    <div>
    <div>Title: {value}</div>
    <div>Symbol:</div>
    <div>Description:</div>
    </div>
  )
}


const Feed = () => {
  const [feeds, setFeeds] = useState<string[]>([]);
  const [state] = useContext(storage.globalContext);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [cards, setCards] = useState<CardProps[]>([]);
  const {feedAddr} = useParams();
  const {primaryAccount} = state;


  const displayMetadata = async (feed: string) => {
    if (primaryAccount) {
      const assets = await fetchLSP8Assets(
        feed,
        primaryAccount,
        config.web3.currentProvider
      );
      console.log(JSON.stringify(assets));
    }
  };

  const displayFeeds = () =>
    feeds.map((f) => <FeedItem key={utils.getUniqueKey("feed_")}>
      <a href={`/feed/${f}`}>{f}</a>
      </FeedItem>);

  useEffect(() => {
    async function getFeedEntries() {
      if (primaryAccount && feedAddr) {
        let numIssues = await getNumberOfIssue(feedAddr);
        let issues = [] 
        let issueNo:number[] = []
        for(let i= numIssues; i >= 0; i-- ){
          issueNo.push(i);
          issues.push(getIssue(feedAddr, i));
        }
        let cards: CardProps[] =[];
        (await Promise.allSettled(issues)).forEach((iss, idx: number)=>{
          if(iss.status === "fulfilled"){
            const datum: HeadsUpDatum = iss.value;
            cards.push({
              feedAddr,
              imageSrc: datum.imageUrl ? datum.imageUrl.replace('ipfs://', config.IPFS_GATEWAY_BASE_URL): '',
              title: datum.title || '',
              link: `/feed/${feedAddr}/entry/${issueNo[idx]}` 
            })
          }
        })
        setCards(cards)
        
      }
    }
    getFeedEntries();
  }, [primaryAccount]);
  useEffect(()=> {
    async function checkOwner(){
    if(feedAddr && primaryAccount){
    const accountOwner = await getOwner(feedAddr);
    console.log(accountOwner)
    setIsOwner(accountOwner === primaryAccount);
    }
  }
  checkOwner()
  },[primaryAccount])
  return (
    <Container>
      <FeedControls owner={isOwner}/>
      <FeedMetadata/>
      <CardsGrid cards={cards}/>
    </Container>
  )
}

export default () => {
  return (
      <Feed/>
  );
};
