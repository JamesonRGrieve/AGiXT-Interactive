import "../styles/globals.css";
import { useState, useEffect } from "react";
import { getCookie, setCookie } from "cookies-next";
import Head from "next/head";
import Auth from "../components/Auth";
/* 
All of the following vars are optional and will default to the values below if not set. 
Add desired variables that you want to configure to your .env.local file.

Example of the default vars for the UI:
AGIXT_SERVER=http://localhost:7437
AGIXT_AGENT=gpt4free
AGIXT_INSIGHT_AGENT=gpt4free
AGIXT_CONVERSATION_NAME=Convert Extensions to new ones
AGIXT_SHOW_CONVERSATION_BAR=true
AGIXT_FILE_UPLOAD_ENABLED=false
AGIXT_DARKMODE=true

Prompt mode example (In addition to the default vars):

AGIXT_MODE=prompt
AGIXT_PROMPT_NAME=Chat
AGIXT_PROMPT_CATEGORY=Default

Chain mode example (In addition to the default vars):

AGIXT_MODE=chain
AGIXT_CHAIN=Postgres Chat
AGIXT_CHAIN_ARGS={}
AGIXT_USE_SELECTED_AGENT=true
*/

export default function App({ Component, pageProps }) {
  // Login
  const [loggedIn, setLoggedIn] = useState(false);
  const [userKey, setUserKey] = useState("");
  const [username, setUsername] = useState("");
  const AGiXTServer =
    process.env.NEXT_PUBLIC_AGIXT_SERVER || "http://localhost:7437";
  const agentName = process.env.NEXT_PUBLIC_AGIXT_AGENT || "gpt4free";
  const insightAgent =
    process.env.NEXT_PUBLIC_AGIXT_INSIGHT_AGENT || "gpt4free";
  const mode = process.env.NEXT_PUBLIC_AGIXT_MODE || "prompt";
  // Prompt Mode Options
  const promptName = process.env.NEXT_PUBLIC_AGIXT_PROMPT_NAME || "Chat";
  const promptCategory =
    process.env.NEXT_PUBLIC_AGIXT_PROMPT_CATEGORY || "Default";
  // Chain Mode Options
  const selectedChain = process.env.NEXT_PUBLIC_AGIXT_CHAIN || "Postgres Chat";
  const useSelectedAgent =
    process.env.NEXT_PUBLIC_AGIXT_USE_SELECTED_AGENT || true;
  const envChainArgs = process.env.NEXT_PUBLIC_AGIXT_CHAIN_ARGS || "{}";
  let chainArgs = {};
  try {
    chainArgs = JSON.parse(envChainArgs);
  } catch (e) {
    console.error(e);
  }
  // UI Options
  const dark = process.env.NEXT_PUBLIC_AGIXT_DARKMODE || true;
  const fileUploadEnabled =
    process.env.NEXT_PUBLIC_AGIXT_FILE_UPLOAD_ENABLED || false;
  const showConversationBar =
    process.env.NEXT_PUBLIC_AGIXT_SHOW_CONVERSATION_BAR || true;
  let convo = process.env.NEXT_PUBLIC_AGIXT_CONVERSATION_NAME;
  if (showConversationBar) {
    const cookieConvo = getCookie("conversationName");
    if (cookieConvo) {
      convo = cookieConvo;
    }
  }
  const [conversationName, setConversationName] = useState(
    convo || "Convert Extensions to new ones"
  );
  useEffect(() => {
    // Login
    if (userKey) {
      const loggedInC = getCookie("loggedIn");
      if (loggedInC) {
        setLoggedIn(true);
      }
      const userApiKey = getCookie("apiKey");
      if (userApiKey) {
        setUserKey(userApiKey);
      }
    }
  }, [userKey]);
  if (!loggedIn) {
    return (
      <Auth username={username} userKey={userKey} setLoggedIn={setLoggedIn} />
    );
  }
  return (
    <>
      <Head>
        <title>{conversationName}</title>
      </Head>
      <Component
        {...pageProps}
        AGiXTServer={AGiXTServer}
        agentName={agentName}
        insightAgent={insightAgent}
        conversationName={conversationName}
        setConversationName={setConversationName}
        showConversationBar={showConversationBar}
        dark={dark}
        enableFileUpload={fileUploadEnabled}
        mode={mode}
        promptName={promptName}
        promptCategory={promptCategory}
        selectedChain={selectedChain}
        chainArgs={chainArgs}
        useSelectedAgent={useSelectedAgent}
        setLoggedIn={setLoggedIn}
      />
    </>
  );
}
