var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, TextField, Container, Typography } from "@mui/material";
import { getCookie, setCookie } from "cookies-next";
import { Box, CssBaseline, ThemeProvider, Tooltip } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
var MenuDarkSwitch = styled(Switch)(function (_a) {
    var theme = _a.theme;
    return ({
        width: 62,
        height: 34,
        padding: 7,
        "& .MuiSwitch-switchBase": {
            margin: 1,
            padding: 0,
            transform: "translateX(6px)",
            "&.Mui-checked": {
                color: "#fff",
                transform: "translateX(22px)",
                "& .MuiSwitch-thumb:before": {
                    backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"20\" width=\"20\" viewBox=\"0 0 20 20\"><path fill=\"".concat(encodeURIComponent("#fff"), "\" d=\"M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z\"/></svg>')"),
                },
                "& + .MuiSwitch-track": {
                    opacity: 1,
                    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
                },
            },
        },
        "& .MuiSwitch-thumb": {
            backgroundColor: theme.palette.colorblind
                ? theme.palette.mode === "dark"
                    ? "#000"
                    : "#fff"
                : theme.palette.mode === "dark"
                    ? "#003892"
                    : "#f0e70a",
            width: 32,
            height: 32,
            "&:before": {
                content: "''",
                position: "absolute",
                width: "100%",
                height: "100%",
                left: 0,
                top: 0,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"20\" width=\"20\" viewBox=\"0 0 20 20\"><path fill=\"".concat(encodeURIComponent("#000"), "\" d=\"M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z\"/></svg>')"),
            },
        },
        "& .MuiSwitch-track": {
            opacity: 1,
            backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
            borderRadius: 20 / 2,
        },
    });
});
export default function Auth(_a) {
    var _this = this;
    var username = _a.username, userKey = _a.userKey, setLoggedIn = _a.setLoggedIn;
    var handleLogin = function () { return __awaiter(_this, void 0, void 0, function () {
        var authData;
        return __generator(this, function (_a) {
            authData = btoa("".concat(username, ":").concat(userKey));
            if (authData) {
                setCookie("apiKey", authData);
                setLoggedIn(true);
                setCookie("loggedIn", true);
            }
            return [2 /*return*/];
        });
    }); };
    var handleToggleDarkMode = function () {
        setDarkMode(!darkMode);
        setCookie("dark", !darkMode);
    };
    var _b = useState(username), user = _b[0], setUser = _b[1];
    var _c = useState(userKey), pass = _c[0], setPass = _c[1];
    var dark = getCookie("dark") || true;
    var _d = useState(dark), darkMode = _d[0], setDarkMode = _d[1];
    var themeGenerator = function (darkMode) {
        return createTheme({
            palette: {
                mode: darkMode ? "dark" : "light",
                primary: {
                    main: darkMode ? "#000000" : "#273043",
                },
            },
        });
    };
    var theme = themeGenerator(darkMode);
    return (_jsxs(ThemeProvider, { theme: theme, children: [_jsx(CssBaseline, {}), _jsx(Box, { sx: {
                    display: "flex",
                    marginRight: "1px",
                    marginLeft: "1px",
                }, children: _jsx("main", { style: {
                        maxWidth: "100%",
                        flexGrow: 1,
                        transition: theme.transitions.create("margin", {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                        }),
                    }, children: _jsxs(Box, { fullWidth: true, sx: {
                            mb: 2,
                            mt: 0,
                            mr: 2,
                            ml: 2,
                            display: "flex",
                            flexDirection: "column",
                        }, children: [_jsx(Box, { sx: {
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    mt: "5px",
                                    mb: 1,
                                }, children: _jsxs(Tooltip, { title: darkMode ? "Switch to Light Mode" : "Switch to Dark Mode", children: [_jsx(MenuDarkSwitch, { checked: darkMode, onChange: handleToggleDarkMode }), "\u00A0\u00A0\u00A0\u00A0\u00A0"] }) }), _jsx(Typography, { variant: "h3", component: "h1", gutterBottom: true, sx: { textAlign: "center", mt: -5 }, children: "AGiXT User Login" }), _jsx(TextField, { label: "Enter your username", type: "text", value: user, onChange: function (e) { return setUser(e.target.value); }, fullWidth: true, color: "info", autoComplete: "off" }), _jsx("br", {}), _jsx(TextField, { label: "Enter your password", type: "password", value: pass, onChange: function (e) { return setPass(e.target.value); }, fullWidth: true, color: "info", autoComplete: "off" }), _jsx("br", {}), _jsx(Button, { color: "info", variant: "outlined", onClick: handleLogin, sx: { height: "54px", fontSize: "1.5rem", fontWeight: "bold" }, fullWidth: true, children: "Log in" })] }) }) })] }));
}
