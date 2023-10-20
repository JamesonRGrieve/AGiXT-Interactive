import {
  Button,
  TextField,
  Container,
  Typography,
  Tooltip,
} from "@mui/material";

export default function Auth({
  handleLogin,
  userKey,
  MenuDarkSwitch,
  darkMode,
  handleToggleDarkMode,
}) {
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
