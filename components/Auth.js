import {
  Button,
  TextField,
  Container,
  Typography,
  Divider,
} from "@mui/material";

export default function Auth({ handleLogin, userKey }) {
  return (
    <Container>
      <Typography variant="h5" component="h2" gutterBottom>
        Login
      </Typography>
      <Divider />
      <br />
      <TextField label="Enter your password" type="text" value={userKey} />
      <Button
        color="info"
        variant="contained"
        onClick={handleLogin}
        sx={{ ml: 1 }}
      >
        Log in
      </Button>
    </Container>
  );
}
