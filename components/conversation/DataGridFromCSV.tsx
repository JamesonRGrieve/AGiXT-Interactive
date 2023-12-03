import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
import { Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, TextFieldProps } from '@mui/material';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import { alpha, styled } from '@mui/material/styles';
import { useState, useEffect, useContext } from 'react';
import { AGiXTContext, AGiXTState } from '../../types/AGiXTState';

const ODD_OPACITY = 1;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#696a6b',
    '&:hover, &.Mui-hovered': {
      backgroundColor: theme.palette.action.hover,
      '@media (hover: none)': {
        backgroundColor: 'transparent'
      }
    },
    '&.Mui-selected': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY + theme.palette.action.selectedOpacity),
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY + theme.palette.action.selectedOpacity)
        }
      }
    }
  }
}));

export const DataGridFromCSV = ({ state, csvData }: { state: AGiXTState; csvData: any }) => {
  const [open, setOpen] = useState(false);
  const [userMessage, setUserMessage] = useState('Surprise me!');
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const parseCSV = (csvData) => {
    let headers = [];
    const lines = csvData.split('\n');
    if (lines.length === 2) {
      return csvData;
    }
    const rawHeaders = lines[1].split(',');
    headers = rawHeaders.map((header) => header.trim());
    const newRows = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split('","');
      if (values.length === headers.length) {
        const row = {} as any;
        for (let j = 0; j < headers.length; j++) {
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
      .filter((header) => header !== 'id')
      .map((header, index) => ({
        field: header,
        width: Math.max(160, header.length * 10),
        flex: 1,
        resizeable: true,
        headerName: header,
        sx: {
          '& .MuiDataGrid-cell': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }
        }
      }));
    // If none of the rows have a value, don't show the column
    headers = headers.filter((header) => {
      for (let i = 0; i < newRows.length; i++) {
        if (newRows[i][header.field]) {
          return true;
        }
      }
      return false;
    });
    setColumns(headers);
    setRows(newRows);
    console.log('newRows', newRows);
    console.log('headers', headers);
  };
  useEffect(() => {
    parseCSV(csvData);
  }, [csvData]);

  const getInsights = async (userMessage) => {
    state.mutate({ ...state, chatState: { ...state.chatState, isLoading: true } });
    const lines = csvData.split('\n');
    lines.shift();
    lines.pop();
    const newCSVData = lines.join('\n');
    const chainArgs = {
      conversation_name: state.chatConfig.conversationName,
      text: newCSVData
    };
    const response = await state.sdk.runChain('Data Analysis', userMessage, state.agent.name, false, 1, chainArgs);
    state.mutate({ ...state, chatState: { ...state.chatState, isLoading: false, lastResponse: response } });
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleUserMessageChange = (event) => {
    setUserMessage(event.target.value);
  };
  const handleGetInsights = () => {
    getInsights(userMessage);
    setOpen(false);
  };

  return (
    <>
      {rows.length > 1 ? (
        <>
          <StripedDataGrid
            density='compact'
            rows={rows}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5
                }
              }
            }}
            getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
          />
          <br />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <Button color='info' variant='outlined' onClick={handleClickOpen}>
              <TipsAndUpdatesOutlinedIcon />
              &nbsp;Get Insights
            </Button>
          </Box>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Get Insights</DialogTitle>
            <DialogContent>
              <TextField
                margin='dense'
                id='name'
                label='What would you like insights on?'
                fullWidth
                value={userMessage}
                onChange={handleUserMessageChange}
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
              <Button color='error' onClick={handleClose}>
                Cancel
              </Button>
              <Button color='info' onClick={handleGetInsights}>
                Get Insights
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        csvData
      )}
    </>
  );
};
