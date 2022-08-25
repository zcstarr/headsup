import * as config from './lib/config';
import React, { useEffect, useState } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { login, launchNewNFTFeed, mintToken } from './lib/login';
import fetchLSP8Assets from './lib/lsp8';
import * as storage from './lib/storage';
import { getFeedLauncher } from './lib/feedLauncher';
import* as utils from './lib/utils';


export default () => {
  const [account, setAccount] = useState<string | null>(storage.getAccount());
  const [feedAddr, setFeedAddr] = useState<string>('');
  const [feeds, setFeeds] = useState<string[]>([]);
  useEffect(()=>{
    async function tryLogin(){
    if(account === 'undefined' || account === '' || !account){
      const acct = await login()
      if(acct.length) {
        storage.setAccount(acct[0])
        setAccount(acct[0]);

        // fetchLSP8Assets()
        // console.log(acct[0])
        // const feed = await launchNewNFTFeed(acct[0], "test feed", "FEED");
        // setFeedAddr(feed)
        // await mintToken(acct[0],feed);
        //await mintToken(acct[0]);
      }

    }
    if(account){
    const feedLauncher = getFeedLauncher();
     const factoryOwner = await feedLauncher.owner();
     alert(factoryOwner);
    const feeds = utils.parseListResult(await feedLauncher.getNewsletters(account,0,100));
    setFeeds(feeds)
    }
  }
  tryLogin()
  }, [account, feedAddr, feeds]);
  return (
  <div>The real tester {account} with feed {feedAddr}
    {feeds}
  </div>
  )

}

