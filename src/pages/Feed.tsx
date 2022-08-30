import * as config from "../lib/config";
import React, { useContext, useEffect, useState } from "react";

import { login,  mintToken } from "../lib/login";
import fetchLSP8Assets from "../lib/lsp8";
import * as storage from "../lib/storage";
import { getPersonalFeeds, getIssue, getNumberOfIssue, getOwner, getTokenName, launchNewNFTFeed } from "../lib/feedLauncher";
import {CardsGrid, CardGridContainer, CardProps, Card} from "../components/Card";
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
  display: grid;
  grid-template-areas: "left-control blank right-control";
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 2rem;
  grid-gap: 40px;
`
const ControlMintContainer = styled.div`
  grid-area: left-control;
  display: flex;
  justify-content: flex-start;
`

const MintControl = styled.div`

`
const Blank = styled.div`
  grid-area: blank;
  min-width: 200px;
`
const FeedName = styled.div`
  font-family: cooper-black-std, sans-serif;
  font-size: 3rem;
  padding: 2rem;
  text-transform: uppercase;
`
const EditControls = styled.div`
  grid-area: right-control;
  display: flex;
  justify-content: flex-end;

`
const EditControl = styled.div`
  padding: 20px;
  cursor: pointer;
`

const FeedControls = (props: {owner: boolean}) => {
  const {owner} = props;
  const nav = useNavigate();
  const {feedAddr} = useParams();
  return (
  <ControlContainer>
    <ControlMintContainer>
      <MintControl>Mint</MintControl>
    </ControlMintContainer>
    <Blank></Blank>
    <EditControls>
    {owner && <>
    <EditControl onClick={()=>nav(`/feeds/${feedAddr}/new-entry`)}>New Entry</EditControl>
    <EditControl onClick={()=>nav(`/feeds/${feedAddr}/cover`)}>Edit Details</EditControl>
    </> }
    </EditControls>
</ControlContainer>
  )
}


export const FeedGrid = (props: {cards: CardProps[], owner: boolean})=> {
  const {cards, owner} = props;
  return (
  <CardGridContainer>
   <FeedControls owner={owner}></FeedControls> 
  { cards.map((card)=>
   (
    <Card {...card} key={utils.getUniqueKey('entrycard_')}/>
    ))} 
  </CardGridContainer>)
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
  const [feedName, setFeedName] = useState<string>('Searching for feed name...')
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

  useEffect(()=>{
    async function helper(){
      if(feedAddr){
    const name = await getTokenName(feedAddr);
    setFeedName(name)
      }
    }
    helper()
  }, [feedAddr])
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
      <FeedName>{feedName}</FeedName>
      <FeedControls owner={isOwner}/>
      <CardsGrid cards={cards}/>
    </Container>
  )
}

export default () => {
  return (
      <Feed/>
  );
};
