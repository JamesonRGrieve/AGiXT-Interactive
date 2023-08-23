import { sdk } from "../../lib/apiClient";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const providerMap = {
      bard: "Bard",
      chatgpt: "ChatGPT",
      fastchat: "FastChat",
      huggingchat: "HuggingChat",
      kobold: "Kobold",
      llamacpp: "LlamaCPP",
      oobabooga: "Oobabooga",
      openai: "OpenAI",
    };
    const mapped = {};
    await sdk.getProviders().then((response) => {
      response.map((provider) => {
        mapped[provider] =
          provider in providerMap ? providerMap[provider] : provider;
      });
    });
    res.status(200).json(mapped);
  } else {
    res.status(405).json({ message: "Method not allowed. Allows: GET." });
  }
}
