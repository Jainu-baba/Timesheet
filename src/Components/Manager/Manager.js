import React from 'react'
import { useNavigate } from "react-router-dom";
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import axios from 'axios';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});





var rows = [
  { id: 1, jobCode: "Testing", empName: "jain", projectCode: 'WFS_1101', total: 35, ViewDetails: "", Comments: "" },

];



const trigger = (row, e) => {
  rows.map(obj => {
    if (obj.id === row.id) {
      obj.Comments = e.target.value; return obj
    }

  });
}

const Manager = () => {
  localStorage.setItem("role", 'manager');
  const columns = [
    { field: 'id', headerName: 'Emp code', width: 90 },
    { field: 'jobCode', headerName: 'job Code', width: 90 },
    {
      field: 'empName',
      headerName: 'Emp Name',
      width: 150,
      editable: true,
    },
    {
      field: 'projectCode',
      headerName: 'Project Code',
      width: 150,
      editable: true,
    },
    {
      field: 'total',
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
      width: 100,
      valueGetter: (params) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
      renderCell: (param) => {
        return (

          <Button onClick={(e) => detailView(param)}><RemoveRedEyeIcon /></Button>
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

          <input type="text" style={{ width: "100%" }} onChange={(e, i) => trigger(params, e)} />

        );
      }
    },
  ];
  const naviagate = useNavigate();
  const detailView = (param) => {
    localStorage.setItem("details", param.id);

    naviagate(`/details/${param.name}/${param.id}`);

  }
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [rowsData, setrowsData] = React.useState(rows);
  const [totalResp, settotalResp] = React.useState(rows);
  const [datesArray, setdatesArray] = React.useState([]);
  const [count, setcount] = React.useState(0);
  const [toastOpen, settoastOpen] = React.useState(false);
  const [rejectoast, setrejectoast] = React.useState(false);
  const [disableButtons, setdisableButtons] = React.useState(true);
  const [selectedDates, setselectedDates] = React.useState("");
 

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    settoastOpen(false);
    setrejectoast(false);
  };
  const apply = () => {
    const checkedRows = selectedRows.map(e => {e.status = "approve"; return e});
    axios.put("/statusChange", checkedRows).then(response => {
    console.log('response:',response);
    settoastOpen(true);
    setrowsData(response.data);
    setcount(count => count + 1);
    setTimeout(() => {
      handleClose();
  }, 2000);
   // setTimeout(() => naviagate("/manager"), 1000);
  }).catch(err => {
    console.log('err:',err);
  })
  }

  const reject = () => {
      const checkedRows = selectedRows.map(e => {e.status = "rejected"; return e});
      axios.put("/statusChange", checkedRows).then(response => {
        //console.log('response:',response);
        setrejectoast(true);
        setrowsData(response.data);
        setcount(count => count + 1);
        setTimeout(() => {
          handleClose();
      }, 2000);
       // setTimeout(() => naviagate("/manager"), 1000);
      }).catch(err => {
        console.log('err:',err);
      })

  }
  var vertical = "top";
  var horizontal = "center";
  useEffect(() => {


    axios.get('/getdata')
    .then((response) => {
     // console.log(response.data);
      settotalResp([...response.data]);
      const unique = [...new Map(response.data.map(item => [item["daterange"], item])).values()];
      setdatesArray(unique);
     
      setselectedDates(response.data[0]?.daterange);
    //  setrowsData(response.data);
    handleDropdownChange(response.data[0]?.daterange, response.data);
     
      })
      .catch((error) => {
         console.log(error)
      });
      
    //  setselectedDates(response.data[0]?.daterange);

  }, [count]);
  const checkItems = async (event, row, index) => {
    console.log(event.target.checked);
    if (event.target.checked) {
      let rowsList = selectedRows;
      rowsList.push(row);
      setSelectedRows(rowsList);
      setdisableButtons(((selectedRows.length > 0) ? false : true));

    }

  }
  const handleDropdownChange = (e, resdata) => {
   // console.log("rowsData", rowsData);
   setselectedDates(e);
let filteredData = resdata.filter((data) => data.daterange === e);
setrowsData(filteredData);
//console.log("filteredData", filteredData);
  }
  return (

    <div className="overall-layout">
      <Snackbar anchorOrigin={{ vertical, horizontal }} open={toastOpen} autoHideDuration={6000} onClose={handleClose} role="alertdialog" aria-labelledby="approve-toast-message">
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Approved {selectedRows.map(e => e.EmpName).toString()}
        </Alert>
      </Snackbar>
      <Snackbar anchorOrigin={{ vertical, horizontal }} open={rejectoast} autoHideDuration={6000} onClose={handleClose} role="alertdialog" aria-labelledby="reject-toast-message">
        <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
          Rejected {selectedRows.map(e => e.EmpName).toString()}
        </Alert>
      </Snackbar>

      <div className="wrapper" role="group" aria-label="Time Sheet Actions">
        <div className="align-header">
        <select value={selectedDates} onChange={(e) => handleDropdownChange(e.target.value, totalResp)} aria-label="Select Date Range">
                            {datesArray.map((range, index) => (
                                <option key={index} value={range.daterange}>
                                    {range.daterange}
                                </option>
                            ))}
                        </select>
         
        </div>
        <div className="align-buttons">
          <div>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" disabled={disableButtons} color="success" onClick={apply} role="button" aria-label="Approve">Approve</Button>
              <Button variant="contained" disabled={disableButtons} color="error" onClick={reject}  role="button" aria-label="Approve">Reject</Button>
            </Stack>
          </div>
          <div>
          </div>
        </div>
      </div>
      <div>
        <Box sx={{ height: 400, width: '100%' }}>
          <table class="table table-bordered text-center">
            <thead className='table-secondary' role="rowgroup">
              <tr className='bg-primary' role='row'>
                <th className='col-md-1' aria-label='Select'>Select</th>
                <th className='col-md-2' aria-label='ProjectCode'>ProjectCode</th>
                <th className='col-md-2' aria-label='JobCode'>JobCode</th>
                <th className='col-md-2' aria-label='EmployeeName'>Emp name</th>
                <th className='col-md-1' aria-label='Total'>Total</th>
                <th className='col-md-1' aria-label='ViewDetails'>ViewDetails</th>
                <th className='col-md-2' aria-label='Comments'>Comments</th>
              </tr>
            </thead>
            <tbody id="table-body">
              {rowsData && rowsData.length > 0 && rowsData.filter((e) => e.status === null).length > 0 ? rowsData.filter((e) => e.status === null).map((row, index) => {
                return (
                  <tr>
                    <td className='col-md-1'>
                      <Checkbox onChange={(e) => checkItems(e, row, index)} aria-label={`Select ${row.name}`}/>
                    </td>
                    <td className='col-md-2' role="cell" tabIndex="0" aria-label={`Project Code: ${row.projectCode}`}>
                      {row.projectCode}
                    </td>
                    <td className='col-md-2'>
                      <div className="container">
                        <div className="row justify-content-md-center">
                          <div className="col-md-12 input" role="cell" tabIndex="0" aria-label={`Job Code: ${row.jobCode}`}>
                            {row.jobCode}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='col-md-2'>
                      <div className="container">
                        <div className="row justify-content-md-center">
                          <div className="col-md-12 input" role="cell" tabIndex="0" aria-label={`Employee Name: ${row.name}`}>
                            {row.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='col-md-1' role="cell" tabIndex="0" aria-label={`Total: ${row.total}`}>{row.total}</td>
                    <td className='col-md-1'>
                      <div className="container">
                        <div className="row justify-content-md-center">
                          <div className="col-md-12 input">
                            <Button onClick={(e) => detailView(row)} aria-label="View Details" role='button' tabIndex={0}><RemoveRedEyeIcon /></Button>
                          </div>

                        </div>
                      </div>
                    </td>
                    <td className='col-md-2'>
                      <div className="container">
                        <div className="row justify-content-md-center">
                          <div className="col-md-12 input">
                            <input type="text" style={{ width: "100%" }} onChange={(e, i) => trigger(row, e)} aria-label="Enter Comments" role="textbox" tabIndex={0}/>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })
                : <p className="noData" aria-label="No Data">No Data</p>}
            </tbody>
          </table>
        </Box>
      </div>
    </div>
  )
}



export default Manager;