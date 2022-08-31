import * as config from "../lib/config";
import React, { useContext, useEffect, useState } from "react";

import { login, mintToken } from "../lib/login";
import fetchLSP8Assets from "../lib/lsp8";
import MessageBox, { delay } from "../components/MessageBox";
import * as storage from "../lib/storage";
import { getPersonalFeeds, getIssue, getNumberOfIssue, launchNewNFTFeed, setCover, setNewIssue } from "../lib/feedLauncher";
import * as utils from "../lib/utils";
import Button, { CommonRoundedButton, CommonSquareButton } from "../components/button";
import * as inputs from "../components/Input";
import AppBar from "../components/AppBar";
import { FileUploader } from "react-drag-drop-files";
import styled from "styled-components";
const fileTypes = ["JPG", "PNG", "GIF", "SVG"];
import { apiClient } from "../lib/config";
import { useNavigate, useParams } from "react-router-dom";
import { HeadsUpDatum } from "../generated/headsup_datum_schema";
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";


interface FeedParam {
  feedAddr?: string;
}



function DragDrop() {
  const [file, setFile] = useState<File | undefined>();
  useEffect(() => {
    if (file) {
    }
  });
  const handleChange = (file: File) => {
    console.log(file.arrayBuffer());
    setFile(file);
  };
  return (
    <FileUploader
      handleChange={handleChange}
      name="file"
      types={fileTypes}
      multiple={false}
    />
  );
}

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;
const InputContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: left;
`;

const FeedCoverForm = () => {
  const [entryTitle, setEntryTitle] = useState<string | undefined>("");
  const [entryImage, setEntryImage] = useState<File | undefined>();
  const [entryContent, setEntryContent] = useState<string | undefined>();
  const [submission, setSubmission] = useState<boolean>(false);
  const [state, dispatch] = useContext(storage.globalContext);
  const nav = useNavigate();
  const { feedAddr } = useParams();
  const { primaryAccount, showMessage } = state;

  const handleChange = (file: File) => {
    console.log(file.arrayBuffer());
    setEntryImage(file);
  };

  useEffect(() => {
    async function uploadNewEntry() {
      if ( (entryContent || entryImage) && primaryAccount && feedAddr && submission && entryTitle) {
        setSubmission(false)
       dispatch({
            type: storage.ActionType.SHOW_MSG_BOX,
          payload: {show: true}});
        try {
          const formData: FormData = new FormData();
          if(entryImage) {
            formData.append("entryImage", entryImage, entryImage.name);
            const result = await fetch(config.IMAGE_ROUTE, {
              method: "POST",
              body: formData,
              mode: "cors",
            });
          }
          let ipfsUrl: string | undefined = undefined;
          if(entryImage){
          // formData.append("entryContent", entryContent);
          // formData.append("entryTitle", entryTitle);
          const result = await fetch(config.IMAGE_ROUTE, {
            method: "POST",
            body: formData,
            mode: "cors",
          });
          const {cid} = await result.json() as {cid: string};
          ipfsUrl = `ipfs://${cid}`;
         }
          const datum: HeadsUpDatum  = {
            content: entryContent,
            imageUrl: ipfsUrl, 
            title:  entryTitle,
          };
          const content = JSON.stringify(datum);
          console.log(content)
          debugger
          const hexxed = config.web3.utils.utf8ToHex(content);
          const result = await setNewIssue(primaryAccount,feedAddr,hexxed);
          const numEntries = await getNumberOfIssue(feedAddr);
         dispatch({
          type: storage.ActionType.SHOW_MSG_BOX,
          payload: {show: true, message: 'New issue created'}});
          await delay(1000)
          nav(`/feed/${feedAddr}/entry/${numEntries-1}`);
   
        } catch (e) {
        dispatch({
          type: storage.ActionType.SHOW_MSG_BOX,
          payload: {show: true, message: 'Error could not complete tx'}});
        } finally {
          setSubmission(false);
        }
      } else {
        if( submission){
          setSubmission(false)
        let message; 
        if(!entryContent && !entryImage){
          message ="Either Image or Content must be set"
        }
        if(!entryTitle){
          message ="Must set title"
          
        }
        dispatch({
          type: storage.ActionType.SHOW_MSG_BOX,
          payload: {show: true, message: message}});
      }
      }
    }
    uploadNewEntry();
  }, [submission, primaryAccount, feedAddr, entryTitle]);
  return (
    <Container>
      <InputContainer>
        <inputs.InputLabel>Entry Title:</inputs.InputLabel>
        <inputs.CommonInput
          onChange={(event) => setEntryTitle(event.target.value)}
        />
      </InputContainer>
      <InputContainer>
        <inputs.InputLabel>Entry Content:</inputs.InputLabel>
      <MDEditor
        value={entryContent}
        preview="edit"
        onChange={setEntryContent}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
      />
      </InputContainer>

      <InputContainer>
        <inputs.InputLabel>Entry Image:</inputs.InputLabel>
        <FileUploader
          handleChange={handleChange}
          name="file"
          types={fileTypes}
          multiple={false}
        />
      </InputContainer>
      <InputContainer>
        <CommonSquareButton onClick={() => setSubmission(true)}>
          Add Entry {submission}
        </CommonSquareButton>
      </InputContainer>
    </Container>
  );
};



export default () => {
  return <FeedCoverForm />;
};
