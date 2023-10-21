import {
  Button,
  TextField,
  Container,
  Typography,
  Tooltip,
} from "@mui/material";
import { setCookie, getCookie } from "cookies-next";

export default function Auth({
  username,
  userKey,
  MenuDarkSwitch,
  darkMode,
  handleToggleDarkMode,
  setLoggedIn,
}) {
  const handleLogin = async () => {
    if (process.env.USING_JWT !== "true") {
      const authData = btoa(`${username}:${userKey}`);
      if (authData) {
        setCookie("apiKey", authData);
        setLoggedIn(true);
        setCookie("loggedIn", true);
      }
      return;
    } else {
      setCookie("apiKey", userKey);
      setLoggedIn(true);
      setCookie("loggedIn", loggedIn);
    }
  };
  // If USING_JWT env var is true, then we need a username and password screen to go to auth provider
  if (process.env.USING_JWT !== "true") {
    return (
      <Container>
        <Typography variant="h5" component="h2" gutterBottom>
          <Tooltip
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <MenuDarkSwitch
              checked={darkMode}
              onChange={handleToggleDarkMode}
            />
          </Tooltip>
          Login
        </Typography>
        <TextField label="Enter your username" type="text" value={username} />
        <TextField label="Enter your password" type="text" value={userKey} />
        <Button
          color="info"
          variant="outlined"
          onClick={handleLogin}
          sx={{ ml: 1, height: "54px" }}
        >
          Log in
        </Button>
      </Container>
    );
  }
  return (
    <Container>
      <Typography variant="h5" component="h2" gutterBottom>
        <Tooltip
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <MenuDarkSwitch checked={darkMode} onChange={handleToggleDarkMode} />
        </Tooltip>
        Login
      </Typography>
      <TextField label="Enter your password" type="text" value={userKey} />
      <Button
        color="info"
        variant="outlined"
        onClick={handleLogin}
        sx={{ ml: 1, height: "54px" }}
      >
        Log in
      </Button>
    </Container>
  );
}
