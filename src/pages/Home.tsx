import * as config from "../lib/config";
import React, { useContext, useEffect, useState } from "react";

import { login, launchNewNFTFeed, mintToken } from "../lib/login";
import fetchLSP8Assets from "../lib/lsp8";
import * as storage from "../lib/storage";
import { getFeeds } from "../lib/feedLauncher";
import * as utils from "../lib/utils";
import Button from "../components/button";
import AppBar from "../components/AppBar";
import { FileUploader } from "react-drag-drop-files";

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
    <div>
      <div>
        Your feeds
        <ul>{displayFeeds()}</ul>
      </div>
      <div>
        The real tester {primaryAccount} with feed {feedAddr}
      </div>
      <DragDrop/>
    </div>
  );
};
