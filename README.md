#  Feedhead - Reimaging Media as a Token

## Table of Contents
  - [About](#what-the$F@#-is-feedhead)
  - [Where](https://feedhead.xyz)
  - [Why](#why)
  - [How](#how)
  - [Future Use Cases](./FUTURE.md)
  - [Architecture](#architecture)
    - [Overall Architecture](#feedhead-architecture)
    - [Contract Architecture](#contract-architecture)
    - [Projects](#projects)
    - [Contributions](#contributions)
  - [Schedule](#schedule)
  - [Getting Started](#getting-started)
  - [Discord](https://discord.gg/BSrZUxUuXq)

## What the $F@# is Feedhead?

Feedhead is a NFT media feed. think wordpress, mirror.xyz, and tumblr in an NFT. Not only that is consumable as an RSS feed, making it compatible with the existing web2.0 infrastructure that delivers media to all channels today.

Check it out at https://feedhead.xyz

### Why?
Reimagining media consumption, production and interaction is more important today than ever. Feedhead can be the first tool that both consumers and producers turn to, to build a foundation for creating community and energy around ideas and sharing. 

Tokens represent a way to delegate access and control in new and novel ways, we're excited to explore 
see our future use case steps [Future](#future)

### How?
I use Lukso's emphasis on ERC725 smart contract storage to facilitate an easier way to create dynamic content for NFTs. We created a NFT launcher contract, capable of launch NFT collections that are UP owned with, their own storage. 
 
 Each launched NFT contract is a NFT Feed. The feed itself stores it's data in an ERC725Y storage area called `Issues[]` this allows us to make entries for the feed. Issues has a super simple schema `headsup_datum_schema.json`, this allows us to eventually share the spec and iterate on it so other people can consume the feed straight from the contract.

 On the other side of this I created the Feedhead server at https://github.com/zcstarr/headsup-server . It reads smart contract data from an NFT feed and translates it to RSS data. It's api is at https://api.feedhead.xyz . It also facilitates the translation of data into `LSP4Metadata` types to produce `JSONURLs` 
 as well as 


### Architecture
#### Feedhead Architecture
![feedhead_arch](https://user-images.githubusercontent.com/173187/187643971-94a2e4d8-e001-48fc-a5e7-b9a0b5764f6c.png)

#### Contract Architecture
![contract_arch](https://user-images.githubusercontent.com/173187/187644105-76b36bbe-07a0-4d81-afa9-94a0bae809ec.png)

### Frontend Components
- React Frontend with styled components
- Hardhat/typechain used for contract interaction

### Getting started
```sh
git clone git@github.com:zcstarr/headsup.git
cd headsup
yarn install
yarn run compile
# this uses the remote server see instructions for local server
# this requires a PINATA key to facilitate ipfs pinning
# this was done for speed reasons
REACT_APP_HEADSUP_ENV=testnet yarn run start
```
Open up the website http://locahost:9011 enjoy!


### Launching your own local server in another terminal start the server on 8081
```sh
git clone git@github.com:zcstarr/headsup-server.git
cd headsup-server
npm install
PINATA_API_KEY=yourkey PINATA_SECRET=yoursecret npm run start
# you will see 
# Starting Server
```

### Deployment 
Deployment uses CI with circle ci and is currently deployed via cloudformation configuration and elasticbeanstalk. The server is deployed that way as well.
 
 ### Deeper Dive
 See [Future](./FUTURE.md)