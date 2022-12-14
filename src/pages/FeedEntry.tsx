import * as config from "../lib/config";
import React, { useContext, useEffect, useState } from "react";

import { login,  mintToken } from "../lib/login";
import fetchLSP8Assets from "../lib/lsp8";
import * as storage from "../lib/storage";
import { getPersonalFeeds, getIssue, getNumberOfIssue, getOwner, launchNewNFTFeed, mintFeed } from "../lib/feedLauncher";
import {CardsGrid, CardProps} from "../components/Card";
import * as utils from "../lib/utils";
import Button, { CommonRoundedButton, CommonSquareButton } from "../components/button";
import * as inputs from '../components/Input';
import AppBar from "../components/AppBar";
import { FileUploader } from "react-drag-drop-files";
import styled from "styled-components";
const fileTypes = ["JPG", "PNG", "GIF"];
import {apiClient} from "../lib/config";
import { useParams, useNavigate } from "react-router-dom";
import { HeadsUpDatum } from "../generated/headsup_datum_schema";
import rehypeParse from 'rehype-parse'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'

import BN from "bn.js";
import { delay } from "../components/MessageBox";
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
position: relative;
padding: 20px;
display: flex;
flex-direction: column;
justify-content: space-between;
align-items: center;
max-width: 768px;
margin: 0 auto;
margin-top:80px;
`;

const FeedTitleContainer = styled.div`

`
const FeedTitle = styled.span`
font-size: 4rem;
`

const FeedImageContainer = styled.div`
`

const FeedImage = styled.img`

`

const MintButton = styled(CommonSquareButton)`
padding:0;
align-self:flex-start;
margin-bottom: 10px;
`
const FeedControls = styled.div`
display: flex;
flex-direction: row-direction;
justify-content: space-between;
`
const FeedContentContainer = styled.div`


`

const FeedContent = styled.div`


`
const FeedUserData = styled.div`


`
/*const FeedButton = styled.div`
  padding: 0px;
  cursor: pointer;
  border: black;
  border-bottom-width: 1px;
  transition: border-style 0.1s ease-in;
  :hover {
    border-style: solid;
  }
`*/
const FeedButton = styled(MintButton)`
  border: black;
`
const FeedLink = styled.div`
text-align: left;
font-size: 1rem;
cursor: pointer;
align-self:flex-start;
margin-bottom: 10px;
`

// TODO fix view layer sanitizer that breaks html 
async function cleanUp(content: string): Promise<any>{
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(content);
    console.log(result)
    return String(result) 
}

const FeedEntry = () => {
  const [feeds, setFeeds] = useState<string[]>([]);
  const [state, dispatch] = useContext(storage.globalContext);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const {feedAddr, feedIssue} = useParams();
  const [isMinting, setMinting] = useState<boolean>(false);
  const nav = useNavigate();
  const {primaryAccount} = state;
  const [feedDatum, setFeedDatum] = useState<HeadsUpDatum| undefined>();
  const [cleanedContent, setCleanedContent] = useState<string>('');

  useEffect(() => {
    async function getFeedEntry() {
      if (primaryAccount && feedAddr && feedIssue && !feedDatum) {
          const iss = await getIssue(feedAddr, new BN(feedIssue).toNumber());
          let datum: HeadsUpDatum = iss;
            datum.imageUrl = datum.imageUrl ? datum.imageUrl.replace('ipfs://', config.IPFS_GATEWAY_BASE_URL): '',
            datum.content = datum.content;
            console.log(iss, datum, feedIssue)
            if(datum.content){
              const cleaned = await cleanUp(datum.content)
              setCleanedContent(cleaned);
            }
            setFeedDatum(datum)
            
        }
        
      }
    getFeedEntry();
  }, [primaryAccount]);

  useEffect(()=>{
    async function mint(){
      if(isMinting && primaryAccount && feedAddr){
        dispatch({
          type: storage.ActionType.SHOW_MSG_BOX,
          payload: {show: true}})
        try {

        setMinting(false);
        await mintFeed(primaryAccount, feedAddr)
        }catch(e){
        setMinting(false);
        dispatch({
          type: storage.ActionType.SHOW_MSG_BOX,
          payload: {show: true, message: 'Something went wrong'}})
        }
        dispatch({
          type: storage.ActionType.SHOW_MSG_BOX,
          payload: {show: true, message: 'Your token was minted'}})
         await delay(1000)
        setMinting(false);
         nav('/profile#feedbag');
      }
    }
    mint()
  }, [primaryAccount, isMinting])
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
      <FeedControls>
        <MintButton onClick={()=>setMinting(true)}>Feed Mint</MintButton>
        <FeedButton onClick={()=>nav(`/feed/${feedAddr}`)}>Back to Feed</FeedButton>
      </FeedControls>
      <FeedImageContainer>
        <FeedImage src={feedDatum?.imageUrl}></FeedImage>
      </FeedImageContainer>
      <FeedTitleContainer>
      <FeedTitle>{feedDatum?.title}</FeedTitle>
      </FeedTitleContainer>
      <FeedContentContainer>
        <FeedContent >
          <FeedUserData dangerouslySetInnerHTML={{__html: cleanedContent}}></FeedUserData>
        </FeedContent>
      </FeedContentContainer>
    </Container>
  )
}

export default () => {
  return (
      <FeedEntry/>
  );
};
