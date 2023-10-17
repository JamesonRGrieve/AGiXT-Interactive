import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { styled } from "@mui/system";

const getRowClassName = (params) => {
  return params.id % 2 === 0 ? "even-row" : "odd-row";
};

export const DataGridFromCSV = ({ csvData }) => {
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
    .map((header) => ({
      field: header,
      width: "20%",
      headerName: header,
      resizeable: true,
    }));

  return (
    <>
      {rows.length > 1 ? (
        <DataGrid
          sx={{
            m: 2,
          }}
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
          getRowClassName={getRowClassName}
        />
      ) : (
        csvData
      )}
    </>
  );
};
