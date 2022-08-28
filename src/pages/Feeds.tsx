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
          await getFeeds(primaryAccount, 0, 100)
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

export default () => {
  return (
      <FeedsList/>
  );
};
