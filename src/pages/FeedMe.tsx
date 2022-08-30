import * as config from "../lib/config";
import React, { useContext, useEffect, useState } from "react";

import { login,  mintToken } from "../lib/login";
import fetchLSP8Assets from "../lib/lsp8";
import * as storage from "../lib/storage";
import { getAllFeeds, getFeedsByTokenHolder, getPersonalFeeds, getTokenIdMetadata, getTokenName, launchNewNFTFeed } from "../lib/feedLauncher";
import * as utils from "../lib/utils";
import Button, { CommonRoundedButton } from "../components/button";
import * as inputs from '../components/Input';
import AppBar from "../components/AppBar";
import { FileUploader } from "react-drag-drop-files";
import styled from "styled-components";
const fileTypes = ["JPG", "PNG", "GIF"];
import {apiClient} from "../lib/config";
import { CardProps, CardsGrid } from "../components/Card";
import { Heading } from "../components/Heading";
import {Spacer} from '../components';

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

const FeedsList = () => {
  const [feeds, setFeeds] = useState<string[]>([]);
  const [state] = useContext(storage.globalContext);
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
    async function checkFeeds() {
      if (primaryAccount) {
        const feeds = utils.parseListResult(
          await getPersonalFeeds(primaryAccount, 0, 100)
        ) as string[];
        setFeeds(feeds);
        displayMetadata(feeds[4]);
      }
    }
    checkFeeds();
  }, [primaryAccount]);
  return (
    <Container>
      <ul>
        {displayFeeds()}
      </ul>
    </Container>
  )
}

/*export default () => {
  return (
      <FeedsList/>
  );
};*/
export default () => {
  const [state , dispatch] = useContext(storage.globalContext);
  const {activeFeedAddr, primaryAccount} = state;
  const [feedAddr, setFeedAddr] = useState<string | undefined>(activeFeedAddr);
  const [feeds, setFeeds] = useState<string[]>([]);
  const [yourCards, setYourCards] = useState<CardProps[]>([]);
  const [yourTokenFeedCards, setYourTokenFeedCards] = useState<CardProps[]>([]);



  const getMetadata = async (feed: string) => {
    if (primaryAccount) {
      const assets = await fetchLSP8Assets(
        feed,
        primaryAccount,
        config.web3.currentProvider
      );
    }
  };
  const displayFeeds = () =>
    feeds.map((f) => <li key={utils.getUniqueKey("feed_")}>{f}</li>);

  useEffect(()=> {
    async function updateCards(){
      if(primaryAccount){
      const feedList = await getAllFeeds(0,100, false);
      const cardAddrs = utils.parseListResult(feedList)
      // TODO should cache here
      const feedCards = await getFeedCards(cardAddrs)
      console.log(cardAddrs)
      const cache: {[x:string]: CardProps} ={};
      feedCards.forEach((feedCard)=> {
       cache[feedCard.feedAddr] = feedCard; 
      })
      const ownedTokenFeed = await getFeedsByTokenHolder(primaryAccount, cardAddrs);
      const personalFeed = utils.parseListResult(await getPersonalFeeds(primaryAccount,0,100));
      const personalFeedCards = await getFeedCards(personalFeed);

      const ownerFeedCards = ownedTokenFeed.map((ownedFeedAddr)=>cache[ownedFeedAddr]);
      setYourCards(personalFeedCards)
      setYourTokenFeedCards(ownerFeedCards)
      }

    }
    updateCards()
  }, [primaryAccount])

  const getFeedCards = async (feedAddrs: string[])=> {
    const featuredNames = await Promise.allSettled(feedAddrs.map((feedAddr)=>getTokenName(feedAddr)));
    const featureds = await Promise.allSettled(feedAddrs.map((feedAddr)=>getTokenIdMetadata(feedAddr)));
    const fcards: CardProps[] = []
    featureds.forEach((f,idx)=>{
      if(f.status === "fulfilled"){
         console.log(f.value)
         const c: CardProps = {
          feedAddr: feedAddrs[idx],
          imageSrc: f.value.imageUrl ||'',
          link: `/feed/${feedAddrs[idx]}`,
          title: featuredNames[idx].status === "fulfilled" ? (featuredNames[idx] as any).value : 'Untitled'  
         }; 
         fcards.push(c)
      }
    });
    return fcards;
  }

  useEffect(() => {
    async function checkFeeds() {

    }
    checkFeeds();
  }, [primaryAccount]);

  return (
    <>
    <Container>
      <Heading>I Made This</Heading>
        <CardsGrid cards={yourCards}/>
      <Heading>Feed Bag</Heading>
        <CardsGrid cards={yourTokenFeedCards}/>
    </Container>
    <Spacer/>
    </>
  );
};

