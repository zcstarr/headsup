import * as config from "../lib/config";
import React, { useContext, useEffect, useState } from "react";

import { login,  mintToken } from "../lib/login";
import fetchLSP8Assets from "../lib/lsp8";
import * as storage from "../lib/storage";
import { getPersonalFeeds, getTokenIdMetadata, getTokenName, launchNewNFTFeed } from "../lib/feedLauncher";
import * as utils from "../lib/utils";
import Button, { CommonRoundedButton } from "../components/button";
import * as inputs from '../components/Input';
import AppBar from "../components/AppBar";
import { FileUploader } from "react-drag-drop-files";
import styled from "styled-components";
const fileTypes = ["JPG", "PNG", "GIF"];
import {apiClient} from "../lib/config";
import { CardProps, CardsGrid } from "../components/Card";
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
  const [featuredCards, setFeaturedCards] = useState<CardProps[]>([]);



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
      const ff = await getFeedCards(["0xd9E9a9A032d3878b65A60ec7F96b6Fd2859C981c", "0x4136F42F40ee8F25afd6d1A604138Dd162f82F6d"])
      setFeaturedCards(ff)
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
      <div>Latest Feeds</div>
      <CardsGrid cards={featuredCards}/>
      <div>
        <ul>{displayFeeds()}</ul>
      </div>
      <div> Create Your Own</div>
      <div>
        The real tester {primaryAccount} with feed {feedAddr}
      </div>
      <DragDrop/>
    </Container>
    </>
  );
};

