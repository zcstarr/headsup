import React, { createContext, Dispatch, Reducer } from 'react';

// TODO missing versioning
const APP_STATE = 'appState';
export const initialAppState: GlobalState = JSON.parse(
  localStorage.getItem(APP_STATE) || '{}',
) as GlobalState;

export interface MessageProp {
  message?: string ;
  show: boolean;
}
interface GlobalState {
  primaryAccount?: string;
  activeFeedAddr?: string;
  showMessage?: MessageProp;
}

// eslint-disable-next-line no-shadow
export enum ActionType {
  LOGIN = 'login',
  LOGOUT = 'logout',
  SET_ACTIVE_FEED = 'set_active_feed',
  RM_ACTIVE_FEED = 'rm_active_feed',
  SHOW_MSG_BOX = 'show_msg_box',
  HIDE_MSG_BOX = 'hide_msg_box'
}

type Action =
  | { type: ActionType.LOGIN; payload: string }
  | {
      type: ActionType.LOGOUT;
    }
  | {
      type: ActionType.SET_ACTIVE_FEED;
      payload?: string;
    }
  | {
      type: ActionType.RM_ACTIVE_FEED;
      payload?: string;
    }
  | {
    type: ActionType.HIDE_MSG_BOX;
  } | {
    type: ActionType.SHOW_MSG_BOX;
    payload: MessageProp;
  }
  
  ;

function setGlobalState<T extends keyof GlobalState>(
  key: T,
  state: GlobalState,
  payload: GlobalState[T],
): GlobalState {
  const newState: GlobalState = { ...state };
  newState[key] = payload;
  localStorage.setItem(APP_STATE, JSON.stringify(newState));
  return newState;
}

function clearGlobalState<T extends keyof GlobalState>(
  key: T,
  state: GlobalState,
): GlobalState {
  const newState = { ...state };
  delete newState[key];
  localStorage.setItem(APP_STATE, JSON.stringify(newState));
  return newState;
}

export const globalStorageReducer: Reducer<GlobalState, Action> = (
  state: GlobalState,
  action: Action,
): GlobalState => {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case ActionType.LOGIN:
      return setGlobalState('primaryAccount', state, action.payload);
    case ActionType.LOGOUT:
      return clearGlobalState('primaryAccount', state);
    case ActionType.SET_ACTIVE_FEED:
      return setGlobalState('activeFeedAddr', state, action.payload);
    case ActionType.RM_ACTIVE_FEED:
      return clearGlobalState('activeFeedAddr', state);
    case ActionType.SHOW_MSG_BOX:
      return {...state, showMessage: action.payload}
    case ActionType.HIDE_MSG_BOX:
      return {...state, showMessage: {show: false}}
    default:
      return state;
  }
};

type GlobalContextValue = [GlobalState, Dispatch<Action>];
export const globalContext = createContext<GlobalContextValue>(
  initialAppState as GlobalContextValue,
);

export function setAccount(acct: string) {
  localStorage.setItem('primaryAccount', acct);
}

export function rmAccount() {
  localStorage.removeItem('primaryAccount');
}

export function getAccount(): string | null {
  return localStorage.getItem('primaryAccount');
}

export function setActiveFeedAddr(feed: string) {
  localStorage.setItem('activeFeedAddr', feed);
}

export function getActiveFeedAddr(feed: string) {
  localStorage.setItem('activeFeedAddr', feed);
}
