import * as config from "../lib/config";
import React, { useContext, useEffect, useState } from "react";

import { login, launchNewNFTFeed, mintToken } from "../lib/login";
import fetchLSP8Assets from "../lib/lsp8";
import * as storage from "../lib/storage";
import { getPersonalFeeds, getTokenIdMetadata, getTokenMetadata, getTokenName } from "../lib/feedLauncher";
import * as utils from "../lib/utils";
import Button from "../components/button";
import AppBar from "../components/AppBar";
import { FileUploader } from "react-drag-drop-files";
import { getUniqueKey } from "../lib/utils";
import styled from "styled-components";
import { ThemeProp } from "../components/types";
import BannerImg from '../images/banner.png'
import { features } from "process";
import { CardProps, CardsGrid } from "../components/Card";
import { Spacer } from "../components";
import Heading from "../components/Heading";

const fileTypes = ["JPG", "PNG", "GIF"];

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
const BannerContainer = styled.div`
 position: relative;
`
const Banner = styled.div`
  width:  100%;
  height: 500px;
  background: url('${BannerImg}');
  background-size: contain;
  background-repeat: repeat; 
`
const BannerStop = styled.div`
  background-color: ${({ theme }: ThemeProp) => theme.colors.black};
  width: 100%;
  justify-content: center;
  ul {
    color: ${({ theme }: ThemeProp) => theme.colors.secondaryText};
    font-weight: 700;
    text-transform: uppercase;
    display:flex;
    min-width: 500px;
    justify-content:space-between;
  }
`

const FeaturedFeeds = styled.div`
max-width: 500px;
display: grid;
grid-auto-rows: auto;
grid-template-columns: 1fr;
grid-gap: 40px;
align-self:center;
max-width: fit-content;

${({ theme }: ThemeProp) => theme.base.mediaQueries.lg} {
  grid-template-columns: 1fr 1fr;
  align-self:center;
  max-width: 800px;
}
${({ theme }: ThemeProp) => theme.base.mediaQueries.xl} {
  grid-template-columns: 1fr 1fr 1fr;
}
`
interface FeedData {
  feedAddr: string

}

const FeaturedFeed = (props: FeedData)=>{



}

export default () => {
  const [state , dispatch] = useContext(storage.globalContext);
  const {activeFeedAddr, primaryAccount} = state;
  const [feedAddr, setFeedAddr] = useState<string | undefined>(activeFeedAddr);
  const [feeds, setFeeds] = useState<string[]>([]);
  const [featuredCards, setFeaturedCards] = useState<CardProps[]>([]);

  function pleaseLogin(navFunc: ()=>void){
    return () => {
      if (!primaryAccount) {
        dispatch({
          type: storage.ActionType.SHOW_MSG_BOX,
          payload: {
            show: true,
            message: "Please login with your lukso up to get started",
          },
        });
        return;
      }
      return navFunc();
    };
  }



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
    feeds.map((f) => <li key={getUniqueKey("feed_")}>{f}</li>);

  useEffect(()=> {
    async function updateCards(){
      const ff = await getFeaturedCards([
        "0x233F67f95949069D69Af391Ef8e1992EA0570065",
        "0x7a5ACcd1356E35BC870C106175Dc69624B63c615",
        "0x2E33f11de291d64FF1b6764D32cC4C4f40f8beb9",
      ]);
    
      pleaseLogin(()=>{})()
      setFeaturedCards(ff)
    }
    updateCards()
  }, [primaryAccount])

  const getFeaturedCards = async (feedAddrs: string[])=> {
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
    <BannerContainer>
      <Banner/>
    </BannerContainer>
    <BannerStop>
    <ul>
      <li>Feeds</li>
      <li>Feeds</li>
      <li>Feeds</li>
      <li>Feeds</li>
      <li>Feeds</li>
      <li>Feeds</li>
      <li>Feeds</li>
      <li>Feeds</li>
      <li>Feeds</li>
      <li>Feeds</li>
    </ul>
    </BannerStop>
    <Container>
      <Heading> Featured Feeds</Heading>
      <CardsGrid cards={featuredCards}/>
    </Container>
    <Spacer/>
    </>
  );
};
