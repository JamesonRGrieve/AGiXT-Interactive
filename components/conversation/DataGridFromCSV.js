import * as React from "react";
import { DataGrid, GridToolbar, gridClasses } from "@mui/x-data-grid";
import { Button, Box, Dialog } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
const ODD_OPACITY = 1;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.mode === "dark" ? "#333" : "#696a6b",
    "&:hover, &.Mui-hovered": {
      backgroundColor: theme.palette.action.hover,
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      "&:hover, &.Mui-hovered": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
}));

export const DataGridFromCSV = ({
  csvData,
  sdk,
  agentName,
  setIsLoading,
  setLastResponse,
  conversationName,
}) => {
  const parseCSV = (csvData) => {
    const lines = csvData.split("\n");
    if (lines.length === 2) {
      return csvData;
    }
    const rawHeaders = lines[1].split(",");

    const headers = rawHeaders.map((header) => header.trim());

    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      if (values.length === headers.length) {
        const row = {};
        for (let j = 0; j < headers.length; j++) {
          values[j] = values[j].trim();
          if (values[j].startsWith('"') && values[j].endsWith('"')) {
            values[j] = values[j].slice(1, -1);
          }
          row[headers[j]] = values[j];
        }
        if (!row.id) {
          row.id = i;
        }
        rows.push(row);
      }
      if (i === 1 && rows.length > 0) {
        rows.shift();
      }
    }
    return rows;
  };

  const rows = parseCSV(csvData);
  const columns = Object.keys(rows[0])
    .filter((header) => header !== "id")
    .map((header, index) => ({
      field: header,
      width: Math.max(160, (header.length + rows[index][header].length) * 10),
      headerName: header,
      resizable: true,
    }));
  // Handle Get Insights, open a Dialog box
  const getInsights = async (userMessage) => {
    setIsLoading(true);
    const lines = csvData.split("\n");
    lines.shift();
    lines.pop();
    const newCSVData = lines.join("\n");
    console.log(newCSVData);
    let chainArgs = {
      conversation_name: conversationName,
      text: newCSVData,
    };
    const response = await sdk.runChain(
      "Data Analysis",
      userMessage,
      agentName,
      false,
      1,
      chainArgs
    );
    setIsLoading(false);
    setLastResponse(response);
  };

  return (
    <>
      {rows.length > 1 ? (
        <>
          <StripedDataGrid
            density="compact"
            rows={rows}
            columns={columns}
            pageSize={5}
            components={{ Toolbar: GridToolbar }}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
            }
          />
          <br />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button onClick={() => {}} color="info" variant="outlined">
              Get Insights
            </Button>
          </Box>
        </>
      ) : (
        csvData
      )}
    </>
  );
};
