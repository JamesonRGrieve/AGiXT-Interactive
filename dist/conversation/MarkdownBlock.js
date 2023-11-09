var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import clipboardCopy from "clipboard-copy";
import { IconButton } from "@mui/material";
import { DataGridFromCSV } from "./DataGridFromCSV";
import { ContentCopy as ContentCopyIcon, Download as DownloadIcon, } from "@mui/icons-material";
export default function MarkdownBlock(_a) {
    var content = _a.content, chatItem = _a.chatItem, sdk = _a.sdk, setIsLoading = _a.setIsLoading, setLastResponse = _a.setLastResponse, conversationName = _a.conversationName, agentName = _a.agentName;
    var langMap = {
        "": "txt",
        python: "py",
        javascript: "js",
        typescript: "ts",
        html: "html",
        css: "css",
        json: "json",
        yaml: "yaml",
        markdown: "md",
        shell: "sh",
        bash: "sh",
        sql: "sql",
        java: "java",
        c: "c",
        cpp: "cpp",
        csharp: "cs",
        go: "go",
        rust: "rs",
        php: "php",
        ruby: "rb",
        perl: "pl",
        lua: "lua",
        r: "r",
        swift: "swift",
        kotlin: "kt",
        scala: "scala",
        clojure: "clj",
        elixir: "ex",
        erlang: "erl",
        haskell: "hs",
        ocaml: "ml",
        pascal: "pas",
        scheme: "scm",
        coffeescript: "coffee",
        fortran: "f",
        julia: "jl",
        lisp: "lisp",
        prolog: "pro",
        vbnet: "vb",
        dart: "dart",
        fsharp: "fs",
        groovy: "groovy",
        perl6: "pl",
        powershell: "ps1",
        puppet: "pp",
        qml: "qml",
        racket: "rkt",
        sas: "sas",
        verilog: "v",
        vhdl: "vhd",
        apex: "cls",
        matlab: "m",
        nim: "nim",
    };
    var renderMessage = function () {
        var message = content.toString();
        var match = message.match(/#(.*?)(?=\n|$)/);
        if (match) {
            if (message.includes("GENERATED_IMAGE:")) {
                var base64Image = match[1].replace("GENERATED_IMAGE:", "").trim();
                var formattedImage = base64Image.toString("base64");
                return message.replace(match[0], "![Generated Image](data:image/png;base64,".concat(formattedImage, ")"));
            }
            if (message.includes("GENERATED_AUDIO:")) {
                var base64Audio = match[1].replace("GENERATED_AUDIO:", "").trim();
                var formattedAudio = base64Audio.toString("base64");
                return message.replace(match[0], "![Generated Audio](data:audio/wav;base64,".concat(formattedAudio, ")"));
            }
        }
        if (message.includes("```csv")) {
            // Get the csv data between ```csv and ```
            var csvData = message
                .split("```csv")[1]
                .split("```")[0]
                .replace(/\n/g, "\r\n");
            return DataGridFromCSV({
                csvData: csvData,
                sdk: sdk,
                agentName: agentName,
                setIsLoading: setIsLoading,
                setLastResponse: setLastResponse,
                conversationName: conversationName,
            });
        }
        return content;
    };
    var generateId = function (text) {
        return text ? text.toLowerCase().replace(/[^\w]+/g, "-") : "";
    };
    var handleAnchorClick = function (e) {
        var href = e.target.getAttribute("href");
        if (href.startsWith("#")) {
            e.preventDefault();
            var id = href.slice(1);
            var element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
        else {
            e.preventDefault();
            window.open(href, "_blank");
        }
    };
    var renderHeader = function (Tag, children) {
        var text = "";
        if (children && children[0]) {
            text = children[0];
        }
        var id = generateId(text);
        return _jsx(Tag, { id: id, children: children });
    };
    var renderLink = function (_a) {
        var node = _a.node, children = _a.children, props = __rest(_a, ["node", "children"]);
        var isExternal = props.href && !props.href.startsWith("#");
        return (_jsx("a", __assign({}, props, { target: isExternal ? "_blank" : undefined, rel: isExternal ? "noopener noreferrer" : undefined, onClick: isExternal ? undefined : handleAnchorClick, children: children })));
    };
    return (_jsx(_Fragment, { children: content.includes("```csv") ? (renderMessage(content)) : (_jsx(ReactMarkdown, { children: renderMessage(content), className: "react-markdown", components: {
                a: renderLink,
                h1: function (_a) {
                    var node = _a.node, children = _a.children;
                    return renderHeader("h1", children);
                },
                h2: function (_a) {
                    var node = _a.node, children = _a.children;
                    return renderHeader("h2", children);
                },
                h3: function (_a) {
                    var node = _a.node, children = _a.children;
                    return renderHeader("h3", children);
                },
                h4: function (_a) {
                    var node = _a.node, children = _a.children;
                    return renderHeader("h4", children);
                },
                ol: function (_a) {
                    var children = _a.children;
                    return _jsx("ol", { style: { paddingLeft: "2em" }, children: children });
                },
                li: function (_a) {
                    var children = _a.children;
                    return _jsx("li", { style: { marginBottom: "0.5em" }, children: children });
                },
                code: function (_a) {
                    var _b;
                    var node = _a.node, inline = _a.inline, children = _a.children, props = __rest(_a, ["node", "inline", "children"]);
                    if (inline) {
                        return (_jsx("span", { style: {
                                backgroundColor: "darkgray",
                                borderRadius: "3px",
                                padding: "0.2em",
                                fontFamily: "monospace",
                            }, children: children }));
                    }
                    var codeBlockRef = React.useRef(null);
                    var language = (_b = props.className) === null || _b === void 0 ? void 0 : _b.replace(/language-/, "");
                    var fileExtension = langMap[language] || "txt";
                    var ts = chatItem
                        ? chatItem.timestamp
                            .replace(/ /g, "-")
                            .replace(/:/g, "-")
                            .replace(/,/g, "")
                        : new Date().toLocaleString().replace(/[^0-9]/g, "");
                    var fileName = chatItem
                        ? "".concat(chatItem.role, "-").concat(ts, ".").concat(fileExtension)
                        : "".concat(ts, ".").concat(fileExtension);
                    return (_jsxs(_Fragment, { children: [_jsx("br", {}), _jsxs("div", { className: "code-block", ref: codeBlockRef, children: [_jsxs("div", { className: "code-title", children: [_jsx(IconButton, { onClick: function () {
                                                    if (codeBlockRef.current) {
                                                        var actualCode = codeBlockRef.current.querySelector("code");
                                                        clipboardCopy(actualCode.innerText);
                                                    }
                                                }, children: _jsx(ContentCopyIcon, {}) }), _jsx(IconButton, { onClick: function () {
                                                    if (codeBlockRef.current) {
                                                        var actualCode = codeBlockRef.current.querySelector("code");
                                                        var element = document.createElement("a");
                                                        var file = new Blob([actualCode.innerText], {
                                                            type: "text/plain;charset=utf-8",
                                                        });
                                                        element.href = URL.createObjectURL(file);
                                                        element.download = fileName;
                                                        document.body.appendChild(element);
                                                        element.click();
                                                    }
                                                }, children: _jsx(DownloadIcon, {}) }), fileName, " | ", language] }), _jsx("div", { className: "code-container", children: language in langMap ? (_jsx(SyntaxHighlighter, __assign({}, props, { children: children, language: language, PreTag: "div", style: a11yDark }))) : (_jsx("code", __assign({ className: "code-block" }, props, { children: children }))) })] }), _jsx("br", {})] }));
                },
            } })) }));
}
