import * as config from "../lib/config";
import React, { useContext, useEffect, useState } from "react";

import { login, mintToken } from "../lib/login";
import fetchLSP8Assets from "../lib/lsp8";
import * as storage from "../lib/storage";
import { getPersonalFeeds, launchNewNFTFeed, setCover, setTokenMetadata } from "../lib/feedLauncher";
import * as utils from "../lib/utils";
import Button, { CommonRoundedButton, CommonSquareButton } from "../components/button";
import * as inputs from "../components/Input";
import AppBar from "../components/AppBar";
import { FileUploader } from "react-drag-drop-files";
import styled from "styled-components";
const fileTypes = ["JPG", "PNG", "GIF", "SVG"];
import { apiClient } from "../lib/config";
import { useNavigate, useParams } from "react-router-dom";
import MessageBox from "../components/MessageBox";

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
  const [feedSymbol, setFeedSymbol] = useState<string | undefined>("");
  const [feedName, setFeedName] = useState<string | undefined>("");
  const [feedDesc, setFeedDesc] = useState<string | undefined>("");
  const [coverImage, setCoverImage] = useState<File | undefined>();
  const [submission, setSubmission] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string | undefined>();
  const [onOK, setOk] = useState<()=>void>(()=>setModal(false));
  const nav = useNavigate();
  const [state, dispatch] = useContext(storage.globalContext);
  const { feedAddr } = useParams();
  const { primaryAccount } = state;

  const handleChange = (file: File) => {
    console.log(file.arrayBuffer());
    setCoverImage(file);
  };

  useEffect(() => {
    async function uploadCover() {
      if (primaryAccount && feedAddr && submission && feedDesc && coverImage) {
        try {
          const formData: FormData = new FormData();

          formData.append("coverImage", coverImage, coverImage.name);
          formData.append("feedDesc", feedDesc);
          formData.append("feedAddr", feedAddr);

          const result = await fetch(config.COVER_META_ROUTE, {
            method: "POST",
            body: formData,
            mode: "cors",
          });
          const value = (await result.json()) as {
            jsonUrl: string;
            cid: string;
          };
          dispatch({
          type: storage.ActionType.SHOW_MSG_BOX,
          payload: {show: true}})
          await setTokenMetadata(primaryAccount, feedAddr, value.jsonUrl);
          dispatch({
          type: storage.ActionType.SHOW_MSG_BOX,
          payload: {show: true, message: 'Transaction Complete'}})
          setOk(()=> {setModal(false); nav(`/profile`)});
          if(!modal) setModal(true);

        } catch (e) {
        dispatch({
          type: storage.ActionType.SHOW_MSG_BOX,
          payload: {show: true, message: 'Err. something went wrong'}})
        } finally {
          setSubmission(false);
        }
      }else {
        if(submission){
        dispatch({
          type: storage.ActionType.SHOW_MSG_BOX,
          payload: {show: true, message: 'You must set both feed description and an image'}})
          setSubmission(false)
        }
      }
    }
    uploadCover();
  }, [submission, primaryAccount, feedDesc, feedAddr, coverImage]);
  return (
    <>
    <Container>
      <InputContainer>
        <inputs.InputLabel>Enter NFT Feed Description:</inputs.InputLabel>
        <inputs.CommonInput
          onChange={(event) => setFeedDesc(event.target.value)}
        />
      </InputContainer>
      <InputContainer>
        <FileUploader
          handleChange={handleChange}
          name="file"
          types={fileTypes}
          multiple={false}
        />
      </InputContainer>
      <InputContainer>
        <CommonSquareButton onClick={() => setSubmission(true)}>
          Submit {submission}
        </CommonSquareButton>
      </InputContainer>
    </Container>
  </>
  );
};

export default () => {
  return (<>

<FeedCoverForm />

  </>);
};
