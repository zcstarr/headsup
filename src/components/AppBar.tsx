import styled from "styled-components";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as storage from "../lib/storage";
import * as config from "../lib/config";
import { login } from "../lib/login";
import Button from "./button";
import React, { useContext, useEffect, useState } from "react";
import Icon from "../images/temp-logo.png";
import { ThemeProp } from "./types";
import { useNavigate } from "react-router-dom";
import { getRandomFeed } from "../lib/feedLauncher";
import MessageBox from "./MessageBox";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const Header = styled.div`
  border-style: solid;
  border-color: ${({ theme }: ThemeProp) => theme.colors.primary};
  border-bottom-width: 2px;
`;
const HeaderContent = styled.div`
  padding-top: 2rem;
  padding-bottom: 2rem;
  grid-template-areas: "home menu login";
  grid-template-columns: 4fr 10fr 4fr;
  column-gap: 2rem;
  display: grid;
`
const MenuContainer = styled.div`
  grid-area: menu;
  display:flex;
  flex-direction: row;
  justify-content: center;
  ul {
    display:flex;
    min-width: 500px;
    justify-content:space-evenly;
    li {
      cursor: pointer;
    }
  }
`

const LoginContainer = styled.div`
  grid-area: login;
`

const LeftNav = styled.div``;

const RightNav = styled.div``;

const IconContainer = styled.div`
  grid-area: home;
  display: flex;
  justify-content: flex-end;
`;
const IconImg = styled.img``;
const AnnouncementBar = styled.div`
  background-color: ${({theme}: ThemeProp)=> theme.colors.primary};
`;
const AnnouncementBarContent = styled.div`
  text-align: center;
  padding: 1rem 2rem;
  margin: 0;
  letter-spacing: .1rem;
  cursor: pointer;
}
`;
const MenuLink = styled.div`
  cursor: pointer;
`

const AppBar = () => {
  const [state, dispatch] = useContext(storage.globalContext);
  const { primaryAccount, showMessage } = state;
  const [loggedIn, setLoggedIn] = useState<boolean>(!primaryAccount !== true);
  const [calcRandom, setCalcRandom] =useState<boolean>(false)
  const nav = useNavigate();

  useEffect(()=>{
    pleaseLogin(()=>{})
  },[])

  function pleaseLogin(navFunc: ()=>void){
    return () => {
      if (!loggedIn) {
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
  async function onClickLogin() {
    const account = await login();
    if (account.length !== 0)
      dispatch({
        type: storage.ActionType.LOGIN,
        payload: account[0],
      });
    setLoggedIn(true);
  }
  async function onClickLogout() {
    storage.rmAccount();
    setLoggedIn(false);
    dispatch({
      type: storage.ActionType.LOGOUT,
    });
  }
  useEffect(()=>{
    async function cr(){
    if(calcRandom){
      const newFeed = await getRandomFeed();
      setCalcRandom(false)
      nav(`/feed/${newFeed}`);
    }
  }
  cr()
  },[calcRandom])
  // <Button onClick={loggedIn ? async ()=>onClickLogout() : async ()=>onClickLogin()}>{loggedIn ? "Logout": "Login"} </Button>
  return (
    <>  
    <MessageBox open={showMessage?.show || false} onOk={()=>dispatch({type: storage.ActionType.HIDE_MSG_BOX})}>
    <div>{showMessage?.message ? showMessage?.message : "Performing transactions wait for wallet confirmation"}</div>
    </MessageBox>
    <Container>
      <AnnouncementBar>
        <AnnouncementBarContent onClick={pleaseLogin(()=>nav('/launch'))}>
          CREATE YOUR OWN 🤯 NFT FEED DROP
        </AnnouncementBarContent>
      </AnnouncementBar>
      <Header>
        <HeaderContent>
          <IconContainer> <MenuLink onClick={()=>nav('/')}>Home</MenuLink> </IconContainer>
          <MenuContainer> 
            <ul>
              <li onClick={pleaseLogin(()=>nav('/launch'))}>Feed Launch</li>  
              <li onClick={pleaseLogin(()=>setCalcRandom(true))}>Feed Random</li>  
              <li onClick={pleaseLogin(()=>nav('/profile'))}>Feed Me</li>  
              <li onClick={pleaseLogin(()=>nav('/feeds'))}>Feed Them</li>  
            </ul> 
            </MenuContainer>
          <LoginContainer><MenuLink onClick={loggedIn ? async ()=>onClickLogout() : async ()=>onClickLogin()}>{loggedIn ? "Logout": "Login"}</MenuLink></LoginContainer>
      </HeaderContent>
      </Header>
    </Container>
</>

  );
};
export default AppBar;
