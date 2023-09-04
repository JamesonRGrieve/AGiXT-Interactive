// components/FileMode.js
import { Button, Container, Typography, Input } from "@mui/material";

export default function FileTraining({ onTrain }) {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    onTrain(file);
  };

  return (
    <Container>
      <Typography variant="h5">Train from Files</Typography>
      <Typography>
        The agent will accept zip files, any kind of plain text file, PDF files,
        CSV, XLSX, and more. The agent will read the files into its long term
        memory.
      </Typography>
      <Input type="file" onChange={handleFileUpload} />
      <Button variant="contained" color="primary">
        Upload
      </Button>
    </Container>
  );
}
