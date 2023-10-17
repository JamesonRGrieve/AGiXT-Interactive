import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

export const DataGridFromCSV = ({ csvData }) => {
  const parseCSV = (csvData) => {
    const lines = csvData.split("\n");
    // Count the lines, if there is only one, return it.
    if (lines.length === 2) {
      return csvData;
    }
    const rawHeaders = lines[1].split(",");

    // Trim the header values to remove any leading/trailing whitespace
    const headers = rawHeaders.map((header) => header.trim());
    console.log(headers);
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      if (values.length === headers.length) {
        const row = {};
        for (let j = 0; j < headers.length; j++) {
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
    .filter((header) => header !== "id") // Exclude "id" field
    .map((header) => ({
      field: header,
      headerName: header,
      width: "20%",
    }));

  return (
    <>
      {rows.length > 1 ? (
        <DataGrid
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
        />
      ) : (
        csvData
      )}
    </>
  );
};
