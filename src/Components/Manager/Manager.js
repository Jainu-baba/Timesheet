import React from 'react'
import { useNavigate } from "react-router-dom";
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});



const rows = [
  { id: 1, EmpCode: 1, EmpName: 'Snow', ProjectCode: 'Jon', TotalHours: 35, ViewDetails: "", Comments: "" },
  { id: 2, EmpCode: 2, EmpName: 'Snow', ProjectCode: 'Jon', TotalHours: 35, ViewDetails: "", Comments: "" },
  { id: 3, EmpCode: 3, EmpName: 'Snow', ProjectCode: 'Jon', TotalHours: 35, ViewDetails: "", Comments: "" },
  { id: 4, EmpCode: 4, EmpName: 'Snow', ProjectCode: 'Jon', TotalHours: 35, ViewDetails: "", Comments: "" },
  { id: 5, EmpCode: 5, EmpName: 'Snow', ProjectCode: 'Jon', TotalHours: 35, ViewDetails: "", Comments: "" },
  { id: 6, EmpCode: 6, EmpName: 'Snow', ProjectCode: 'Jon', TotalHours: 35, ViewDetails: "", Comments: "" },
  { id: 7, EmpCode: 7, EmpName: 'Snow', ProjectCode: 'Jon', TotalHours: 35, ViewDetails: "", Comments: "" },
  { id: 8, EmpCode: 8, EmpName: 'Snow', ProjectCode: 'Jon', TotalHours: 35, ViewDetails: "", Comments: "" },
  { id: 9, EmpCode: 9, EmpName: 'Snow', ProjectCode: 'Jon', TotalHours: 35, ViewDetails: "", Comments: "" },
];



const trigger = (row, e) => {
  rows.map(obj => {
    if (obj.id === row.id) {
      obj.Comments = e.target.value; return obj
    }

  });
}

const Manager = () => {
  const columns = [
    { field: 'id', headerName: 'Emp code', width: 90 },
    { field: 'EmpCode', headerName: 'Emp code', width: 90 },
    {
      field: 'EmpName',
      headerName: 'Emp Name',
      width: 150,
      editable: true,
    },
    {
      field: 'ProjectCode',
      headerName: 'Project Code',
      width: 150,
      editable: true,
    },
    {
      field: 'TotalHours',
      headerName: 'Total Hours',
      type: 'number',
      width: 110,
      editable: true,
    },
    {
      field: 'ViewDetails',
      headerName: 'View Details',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
      renderCell: (params) => {
        return (

          <Button onClick={(e) => detailView()}><RemoveRedEyeIcon /></Button>
        );
      }
    },
    {
      field: 'Comments',
      headerName: 'Comments',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
      renderCell: (params) => {
        return (

          <input type="text" onChange={(e, i) => trigger(params, e)} />

        );
      }
    },
  ];
  const naviagate = useNavigate();
  const detailView = () => {
    naviagate("/details")

  }
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [toastOpen, settoastOpen] = React.useState(false);
  const [rejectoast, setrejectoast] = React.useState(false);


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    settoastOpen(false);
    setrejectoast(false);
  };
  const apply = () => {
    settoastOpen(true);

  }

  const reject = () => {
    setrejectoast(true);

  }
  var vertical = "top";
  var horizontal = "center";

  return (

    <div className="overall-layout">
      <Snackbar anchorOrigin={{ vertical, horizontal }} open={toastOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Applied {selectedRows.map(e => e.EmpName).toString()}
        </Alert>
      </Snackbar>
      <Snackbar anchorOrigin={{ vertical, horizontal }} open={rejectoast} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
          Applied {selectedRows.map(e => e.EmpName).toString()}
        </Alert>
      </Snackbar>

      <div className="wrapper">
        <div className="align-header">
          <select disabled className="select">
            <option value="">31-07-2023 - 07-08-2023</option>
          </select>
        </div>
        <div className="align-buttons">
          <div>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" color="success" onClick={apply}>Approve</Button>
              <Button variant="contained" color="error" onClick={reject}>Reject</Button>
            </Stack>
          </div>
          <div>
          </div>
        </div>
      </div>
      <div>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            checkboxSelection
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}

            onRowSelectionModelChange={(ids) => {
              const selectedIDs = new Set(ids);
              const selectedRows = rows.filter((row) =>
                selectedIDs.has(row.id),
              );

              setSelectedRows(selectedRows);
            }}
            pageSizeOptions={[5]}

            disableRowSelectionOnClick
          />
          <pre style={{ fontSize: 10 }}>
            {JSON.stringify(selectedRows, null, 4)}
          </pre>

        </Box>
      </div>
    </div>
  )
}



export default Manager;