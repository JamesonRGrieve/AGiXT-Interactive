import { Button, TextField, Container, Typography } from "@mui/material";
import { setCookie } from "cookies-next";

export default function Auth({ username, userKey, setLoggedIn }) {
  const handleLogin = async () => {
    const authData = btoa(`${username}:${userKey}`);
    if (authData) {
      setCookie("apiKey", authData);
      setLoggedIn(true);
      setCookie("loggedIn", true);
    }
  };
  return (
    <Container>
      <Typography variant="h5" component="h2" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Enter your username"
        type="text"
        value={username}
        fullWidth
      />
      <br />
      <TextField
        label="Enter your password"
        type="text"
        value={userKey}
        fullWidth
      />
      <br />
      <Button
        color="info"
        variant="outlined"
        onClick={handleLogin}
        sx={{ height: "54px" }}
        fullWidth
      >
        Log in
      </Button>
    </Container>
  );
}
