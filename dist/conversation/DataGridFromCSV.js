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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { DataGrid, GridToolbar, gridClasses } from "@mui/x-data-grid";
import { Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, } from "@mui/material";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import { alpha, styled } from "@mui/material/styles";
import { useState, useEffect } from "react";
var ODD_OPACITY = 1;
var StripedDataGrid = styled(DataGrid)(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["& .".concat(gridClasses.row, ".even")] = {
            backgroundColor: theme.palette.mode === "dark" ? "#333" : "#696a6b",
            "&:hover, &.Mui-hovered": {
                backgroundColor: theme.palette.action.hover,
                "@media (hover: none)": {
                    backgroundColor: "transparent",
                },
            },
            "&.Mui-selected": {
                backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY + theme.palette.action.selectedOpacity),
                "&:hover, &.Mui-hovered": {
                    backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY +
                        theme.palette.action.selectedOpacity +
                        theme.palette.action.hoverOpacity),
                    // Reset on touch devices, it doesn't add specificity
                    "@media (hover: none)": {
                        backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY + theme.palette.action.selectedOpacity),
                    },
                },
            },
        },
        _b);
});
export var DataGridFromCSV = function (_a) {
    var csvData = _a.csvData, sdk = _a.sdk, agentName = _a.agentName, setIsLoading = _a.setIsLoading, setLastResponse = _a.setLastResponse, conversationName = _a.conversationName;
    var _b = useState(false), open = _b[0], setOpen = _b[1];
    var _c = useState("Surprise me!"), userMessage = _c[0], setUserMessage = _c[1];
    var _d = useState([]), rows = _d[0], setRows = _d[1];
    var _e = useState([]), columns = _e[0], setColumns = _e[1];
    var parseCSV = function (csvData) {
        var headers = [];
        var lines = csvData.split("\n");
        if (lines.length === 2) {
            return csvData;
        }
        var rawHeaders = lines[1].split(",");
        headers = rawHeaders.map(function (header) { return header.trim(); });
        var newRows = [];
        for (var i = 1; i < lines.length; i++) {
            var values = lines[i].split('","');
            if (values.length === headers.length) {
                var row = {};
                for (var j = 0; j < headers.length; j++) {
                    values[j] = values[j].trim();
                    if (values[j].startsWith('"') && values[j].endsWith('"')) {
                        values[j] = values[j].slice(1, -1);
                    }
                    if (values[j].startsWith('"')) {
                        values[j] = values[j].slice(1);
                    }
                    if (values[j].endsWith('"')) {
                        values[j] = values[j].slice(0, -1);
                    }
                    row[headers[j]] = values[j];
                }
                if (!row.id) {
                    row.id = i;
                }
                newRows.push(row);
            }
            if (i === 1 && newRows.length > 0) {
                newRows.shift();
            }
        }
        headers = headers
            .filter(function (header) { return header !== "id"; })
            .map(function (header, index) { return ({
            field: header,
            width: Math.max(160, header.length * 10),
            flex: 1,
            resizeable: true,
            headerName: header,
            sx: {
                "& .MuiDataGrid-cell": {
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                },
            },
        }); });
        // If none of the rows have a value, don't show the column
        headers = headers.filter(function (header) {
            for (var i = 0; i < newRows.length; i++) {
                if (newRows[i][header.field]) {
                    return true;
                }
            }
            return false;
        });
        setColumns(headers);
        setRows(newRows);
        console.log("newRows", newRows);
        console.log("headers", headers);
    };
    useEffect(function () {
        parseCSV(csvData);
    }, [csvData]);
    var getInsights = function (userMessage) { return __awaiter(void 0, void 0, void 0, function () {
        var lines, newCSVData, chainArgs, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    lines = csvData.split("\n");
                    lines.shift();
                    lines.pop();
                    newCSVData = lines.join("\n");
                    chainArgs = {
                        conversation_name: conversationName,
                        text: newCSVData,
                    };
                    return [4 /*yield*/, sdk.runChain("Data Analysis", userMessage, agentName, false, 1, chainArgs)];
                case 1:
                    response = _a.sent();
                    setIsLoading(false);
                    setLastResponse(response);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleClickOpen = function () {
        setOpen(true);
    };
    var handleClose = function () {
        setOpen(false);
    };
    var handleUserMessageChange = function (event) {
        setUserMessage(event.target.value);
    };
    var handleGetInsights = function () {
        getInsights(userMessage);
        setOpen(false);
    };
    return (_jsx(_Fragment, { children: rows.length > 1 ? (_jsxs(_Fragment, { children: [_jsx(StripedDataGrid, { density: "compact", rows: rows, columns: columns, pageSize: 5, components: { Toolbar: GridToolbar }, initialState: {
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }, getRowClassName: function (params) {
                        return params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd";
                    } }), _jsx("br", {}), _jsx(Box, { sx: {
                        display: "flex",
                        justifyContent: "flex-end",
                    }, children: _jsxs(Button, { color: "info", variant: "outlined", onClick: handleClickOpen, children: [_jsx(TipsAndUpdatesOutlinedIcon, {}), "\u00A0Get Insights"] }) }), _jsxs(Dialog, { open: open, onClose: handleClose, children: [_jsx(DialogTitle, { children: "Get Insights" }), _jsx(DialogContent, { children: _jsx(TextField, { autoFocus: true, margin: "dense", id: "name", label: "What would you like insights on?", fullWidth: true, value: userMessage, onChange: handleUserMessageChange, onClick: function (e) {
                                    if (e.target.value === "Surprise me!") {
                                        setUserMessage("");
                                    }
                                }, variant: "outlined", color: "info" }) }), _jsxs(DialogActions, { children: [_jsx(Button, { color: "error", onClick: handleClose, children: "Cancel" }), _jsx(Button, { color: "info", onClick: handleGetInsights, children: "Get Insights" })] })] })] })) : (csvData) }));
};
