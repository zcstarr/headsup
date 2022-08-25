export function setAccount(acct: string) {
  localStorage.setItem('primaryAccount', acct);
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
