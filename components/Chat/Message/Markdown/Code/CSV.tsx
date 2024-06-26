import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import { alpha, styled } from '@mui/material/styles';
import React, { useState, useEffect, ReactNode, useContext } from 'react';
import { InteractiveConfigContext } from '../../../../../types/InteractiveConfigContext';
const ODD_OPACITY = 1;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#696a6b',
    '&:hover, &.Mui-hovered': {
      backgroundColor: theme.palette.action.hover,
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(theme.palette.primary.main, Math.min(1, ODD_OPACITY + theme.palette.action.selectedOpacity)),
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          Math.min(1, ODD_OPACITY + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity),
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            Math.min(1, ODD_OPACITY + theme.palette.action.selectedOpacity),
          ),
        },
      },
    },
  },
}));

export const RendererCSV = ({
  csvData,
  setLoading,
}: {
  csvData: string[];
  setLoading?: (loading: boolean) => void;
}): ReactNode => {
  const [open, setOpen] = useState(false);
  const [userMessage, setUserMessage] = useState('Surprise me!');
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [filteredRows, setFilteredRows] = useState([]);
  const [filteredColumns, setFilteredColumns] = useState([]);
  const [columns, setColumns] = useState([]);
  // console.log('Rendering CSV', csvData);
  useEffect(() => {
    if (!csvData) throw 'No CSV data provided.';
    setError('');
    const rawData = csvData.map((row) =>
      row
        .split(',')
        .map((cell) => cell.trim().replaceAll('"', ''))
        .filter((cell) => cell),
    );
    // console.log('rawData', rawData);
    if (
      !rawData.every((row) => row.length === rawData[0].length) ||
      !rawData[0] ||
      rawData.some((row) => [0, 1].includes(row.length))
    ) {
      // TODO: This doesn't seem to work, it produces a blank placeholder instead of the raw code and an error in the data grid.
      setError('CSV data is not valid.');
      return;
    }

    setColumns(
      (rawData[0][0].toLowerCase().includes('id') ? rawData[0].slice(1) : rawData[0]).map((header) => ({
        field: header,
        width: Math.max(160, header.length * 10),
        flex: 1,
        resizeable: true,
        headerName: header,
        sx: {
          '& .MuiDataGrid-cell': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
        },
      })),
    );
    setRows(
      rawData.slice(1).map((row, index) =>
        rawData[0][0].toLowerCase().includes('id')
          ? {
              id: row[0],
              ...Object.fromEntries(row.slice(1).map((cell, index) => [rawData[0][index + 1], cell])),
            }
          : {
              id: index,
              ...Object.fromEntries(row.map((cell, index) => [rawData[0][index.toString()], cell])),
            },
      ),
    );
  }, [csvData]);
  const context = useContext(InteractiveConfigContext);
  useEffect(() => {
    setFilteredRows(rows);
  }, [rows]);
  useEffect(() => {
    setFilteredColumns(columns);
  }, [columns]);
  const getInsights = async (userMessage): Promise<void> => {
    setLoading(true);
    const stringifiedColumns = filteredColumns.map((header) => header.field);
    const stringifiedRows = filteredRows.map((row) =>
      [row.id, ...filteredColumns.map((header) => row[header.field])].join(','),
    );

    await context.agixt.runChain('Data Analysis', userMessage, context.agent, false, 1, {
      conversation_name: context.overrides.conversationName,
      text: [['id', ...stringifiedColumns].join(','), ...stringifiedRows].join('\n'),
    });
    setLoading(false);
  };
  const gridChange = (state): void => {
    setFilteredRows(
      rows.filter((row) =>
        Object.keys(state.filter.filteredRowsLookup)
          .filter((key) => state.filter.filteredRowsLookup[key.toString()])
          .includes(row.id),
      ),
    );
    setFilteredColumns(
      columns.filter(
        (column) =>
          !Object.keys(state.columns.columnVisibilityModel)
            .filter((key) => !state.columns.columnVisibilityModel[key.toString()])
            .includes(column.field),
      ),
    );
  };
  return rows.length > 0 ? (
    <Box display='flex' flexDirection='column' gap='1rem'>
      {error ? (
        <Typography color='error'>{error}</Typography>
      ) : (
        <>
          <StripedDataGrid
            density='compact'
            rows={rows}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
            onStateChange={gridChange}
          />
          {setLoading && (
            <>
              <Box
                sx={{
                  display: 'flex',
                }}
              >
                <Button
                  color='info'
                  variant='outlined'
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  <TipsAndUpdatesOutlinedIcon />
                  Get Insights
                </Button>
              </Box>
              <Dialog
                open={open}
                onClose={() => {
                  setOpen(false);
                }}
              >
                <DialogTitle>Get Insights</DialogTitle>
                <DialogContent>
                  <TextField
                    margin='dense'
                    id='name'
                    label='What would you like insights on?'
                    fullWidth
                    value={userMessage}
                    onChange={(event) => {
                      setUserMessage(event.target.value);
                    }}
                    onClick={(e) => {
                      if ((e.target as TextFieldProps).value === 'Surprise me!') {
                        setUserMessage('');
                      }
                    }}
                    variant='outlined'
                    color='info'
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    color='error'
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    color='info'
                    onClick={() => {
                      getInsights(userMessage);
                      setOpen(false);
                    }}
                  >
                    Get Insights
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </>
      )}
    </Box>
  ) : (
    csvData
  );
};
export default RendererCSV;
