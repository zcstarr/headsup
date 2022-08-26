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
import { getFeeds } from './lib/feedLauncher';
import* as utils from './lib/utils';
import Button from './components/button';
import AppBar from './components/AppBar';
import Home from "./pages/Home"
import LaunchFeed from "./pages/LaunchFeed"


function loginLogout(){

}




export default () => {
return (<Router>
  <AppBar/>
    <Routes>
      <Route index element={<Home />} />
      <Route path="/home" element={<Home/>}/>
      <Route path="/launch" element={<LaunchFeed/>}/>
    </Routes>
</Router>)

}

