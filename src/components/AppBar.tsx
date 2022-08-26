import styled from 'styled-components';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as storage from '../lib/storage';
import * as config from '../lib/config';
import {login} from '../lib/login';
import Button from "./button";
import React, { useContext, useEffect, useState } from 'react';


const AppBar = ()=> {
  const [state, dispatch] = useContext(storage.globalContext)
  const {primaryAccount} = state;
  const [loggedIn, setLoggedIn] = useState<boolean>(!primaryAccount !== true);
  async function onClickLogin(){
  const account = await login();
  if(account.length !== 0)
  dispatch({
    type: storage.ActionType.LOGIN,
    payload: account[0]
  })
  setLoggedIn(true);
}
async function onClickLogout(){
  storage.rmAccount();
  setLoggedIn(false);
  dispatch({
    type: storage.ActionType.LOGOUT,
  })
}
  return (
    <div>
      <Button onClick={loggedIn ? async ()=>onClickLogout() : async ()=>onClickLogin()}>{loggedIn ? "Logout": "Login"} </Button>
    </div>
  )

}
export default AppBar;
