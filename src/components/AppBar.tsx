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
}
`;
const MenuLink = styled.div`
  cursor: pointer;
`

const AppBar = () => {
  const [state, dispatch] = useContext(storage.globalContext);
  const { primaryAccount } = state;
  const [loggedIn, setLoggedIn] = useState<boolean>(!primaryAccount !== true);
  const nav = useNavigate();
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
  // <Button onClick={loggedIn ? async ()=>onClickLogout() : async ()=>onClickLogin()}>{loggedIn ? "Logout": "Login"} </Button>
  return (
    <Container>
      <AnnouncementBar>
        <AnnouncementBarContent>
          CREATE YOUR OWN 🤯 NFT FEED DROP
        </AnnouncementBarContent>
      </AnnouncementBar>
      <Header>
        <HeaderContent>
          <IconContainer> <MenuLink onClick={()=>nav('/')}>Home</MenuLink> </IconContainer>
          <MenuContainer> 
            <ul>
              <li onClick={()=>nav('/launch')}>Feed Launch</li>  
              <li onClick={()=>alert('coming soon')}>Feed Random</li>  
              <li onClick={()=>nav('/profile')}>Feed Me</li>  
            </ul> 
            </MenuContainer>
          <LoginContainer><MenuLink onClick={loggedIn ? async ()=>onClickLogout() : async ()=>onClickLogin()}>{loggedIn ? "Logout": "Login"}</MenuLink></LoginContainer>
      </HeaderContent>
      </Header>
    </Container>
  );
};
export default AppBar;
