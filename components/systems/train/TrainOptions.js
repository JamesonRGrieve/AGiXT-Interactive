import { useState } from "react";
import {
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Container,
} from "@mui/material";
import { useRouter } from "next/router";

export default function TrainOptions({
  data,
  collectionNumber,
  setCollectionNumber,
  limit,
  setLimit,
  minRelevanceScore,
  setMinRelevanceScore,
}) {
  const router = useRouter();
  const tab = router.query.tab || 0;
  return (
    <Container>
      <div className="advanced-options">
        <Typography variant="h6" component="h2" gutterBottom>
          <strong>Predefined Memory Collections</strong>
        </Typography>
        <Typography component="h2" gutterBottom>
          You can use any number above 10 for your own custom collections, but
          0-10 are reserved for the following collections:
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Collection Number</TableCell>
              <TableCell>Collection Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>0</TableCell>
              <TableCell>Default long term memory storage</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>Websearch storage</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2</TableCell>
              <TableCell>RLHF - Positive Feedback memory storage</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>3</TableCell>
              <TableCell>RLHF - Negative Feedback memory storage</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>4-10</TableCell>
              <TableCell>Reserved for future use.</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <br />
        <TextField
          fullWidth
          type="number"
          variant="outlined"
          label="Choose a Collection Number (Default is 0)"
          value={collectionNumber}
          onChange={(e) => {
            setCollectionNumber(e.target.value);
          }}
        />
        {tab == 4 && (
          <>
            <TextField
              type="number"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              label="Limit"
              variant="outlined"
              margin="normal"
              style={{ width: "130px" }}
            />
            <TextField
              type="number"
              value={minRelevanceScore}
              onChange={(e) => {
                let value = parseFloat(e.target.value);
                if (value < 0) value = 0;
                if (value > 1) value = 1;
                setMinRelevanceScore(value);
              }}
              label="Minimum Relevance Score"
              variant="outlined"
              margin="normal"
              inputProps={{
                step: 0.1, // Allow only increments or decrements of 0.1
                min: 0.1, // Minimum value
                max: 1, // Maximum value
              }}
              style={{ width: "200px" }}
            />
          </>
        )}
      </div>
    </Container>
  );
}
