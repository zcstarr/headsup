import * as config from './lib/config';
import React, { useEffect, useState } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { login, launchNewNFTFeed, mintToken } from './lib/login';
import fetchLSP8Assets from './lib/lsp8';
import * as storage from './lib/storage';
import { getPersonalFeeds } from './lib/feedLauncher';
import* as utils from './lib/utils';
import Button from './components/button';
import AppBar from './components/AppBar';
import Home from "./pages/Home";
import Mint from "./pages/Mint";
import LaunchFeed from "./pages/LaunchFeed";
import Feeds from "./pages/Feeds";
import Feed from "./pages/Feed";
import FeedMe from "./pages/FeedMe";
import FeedEntryNew from './pages/FeedEntryNew';
import FeedEntry from './pages/FeedEntry';
import FeedCover from './pages/FeedCover';


function loginLogout(){

}




export default () => {
return (<Router>
  <AppBar/>
    <Routes>
      <Route index element={<Home />} />
      <Route path="/home" element={<Home/>}/>
      <Route path="/profile" element={<FeedMe/>}/>
      <Route path="/launch" element={<LaunchFeed/>}/>
      <Route path="/feeds" element={<Feeds/>}/>
      <Route path="/feeds/:feedAddr/" element={<Feeds/>}/>
      <Route path="/feeds/:feedAddr/cover" element={<FeedCover/>}/>
      <Route path="/feeds/:feedAddr/new-entry" element={<FeedEntryNew/>}/>
      <Route path="/feed/:feedAddr/entry/:feedIssue" element={<FeedEntry/>}/>
      <Route path="/feed/:feedAddr/mint" element={<Mint/>}/>
      <Route path="/feed/:feedAddr" element={<Feed/>}/>
    </Routes>
</Router>)

}

