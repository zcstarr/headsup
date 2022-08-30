import * as config from "../lib/config";
import React, { useContext, useEffect, useState } from "react";

import { login, mintToken } from "../lib/login";
import fetchLSP8Assets from "../lib/lsp8";
import * as storage from "../lib/storage";
import { getPersonalFeeds, launchNewNFTFeed, setCover, setTokenMetadata } from "../lib/feedLauncher";
import * as utils from "../lib/utils";
import Button, { CommonRoundedButton } from "../components/button";
import * as inputs from "../components/Input";
import AppBar from "../components/AppBar";
import { FileUploader } from "react-drag-drop-files";
import styled from "styled-components";
const fileTypes = ["JPG", "PNG", "GIF", "SVG"];
import { apiClient } from "../lib/config";
import { useParams } from "react-router-dom";

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
  const [state] = useContext(storage.globalContext);
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
          /* const metadata = await apiClient.createNftFeedMetadata(
              feedSymbol,
              feedName,
              feedDesc
            );*/
          // apiClient.updateNftCoverData()
          /*if (!metadata.jsonUrl) throw new Error("jsonurl metadata fail");
            const address = await launchNewNFTFeed(
              primaryAccount,
              feedSymbol,
              feedName,
              metadata.jsonUrl


            ); */
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
          await setTokenMetadata(primaryAccount, feedAddr, value.jsonUrl);

        } catch (e) {
          console.error(e);
        } finally {
          setSubmission(false);
        }
      }
    }
    uploadCover();
  }, [submission, primaryAccount, feedDesc, feedAddr, coverImage]);
  return (
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
        <CommonRoundedButton onClick={() => setSubmission(true)}>
          Submit {submission}
        </CommonRoundedButton>
      </InputContainer>
    </Container>
  );
};

export default () => {
  return <FeedCoverForm />;
};
