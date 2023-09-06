import { Typography, Input } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/router";
import { sdk } from "../../../../lib/apiClient";

export default function FileTraining({ collectionNumber = 0 }) {
  const [learnStatus, setLearnStatus] = useState("");
  const router = useRouter();
  const agentName = router.query.agent;

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);

    for (let file of files) {
      await onTrain(file);
    }
  };

  const onTrain = async (file) => {
    setLearnStatus(
      `${agentName} is learning from the file: ${file.name}. Please wait.`
    );
    const fileContent = await file.text();
    const fileName = file.name;
    await sdk.learnFile(agentName, fileName, fileContent, collectionNumber);
    setLearnStatus(
      `${agentName} has finished learning from the file: ${file.name}.`
    );
  };

  return (
    <>
      <Typography>
        The agent will accept zip files, any kind of plain text file, PDF files,
        CSV, XLSX, and more. The agent will read the files into its long term
        memory.
      </Typography>
      <br />
      <Input
        type="file"
        inputProps={{ multiple: true }}
        onChange={handleFileUpload}
      />
      <br /> <br />
      <Typography>{learnStatus}</Typography>
    </>
  );
}
