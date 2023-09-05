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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});





var rows = [
  { id: 1, jobCode: "Testing", empName: "jain", projectCode: 'WFS_1101',  total: 35, ViewDetails: "", Comments: "" },
 
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

          <input type="text" style={{width: "100%"}} onChange={(e, i) => trigger(params, e)} />
          
        );
      }
    },
  ];
  const naviagate = useNavigate();
  const detailView = (param) => {
    localStorage.setItem("details", param.id);
    naviagate(`/details/${param.empName}`);

  }
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [rowsData, setrowsData] = React.useState(rows);
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
   
       const arr1 = rowsData.map(e => e.id);  
const arr2 = selectedRows.map(e => e.id);  
let unique1 = arr1.filter((o) => arr2.indexOf(o) === -1);
let unique2 = arr2.filter((o) => arr1.indexOf(o) === -1);

const unique = unique1.concat(unique2);
let finalData = rowsData.filter((o) => unique.includes(o.id));

const empName = localStorage.getItem('employeeName');
console.log(empName);
const dateRange = localStorage.getItem('dateRange');
const dateIndex = localStorage.getItem('selectedDateRangeIndex');
if (empName && dateRange) {
  const empData = { [empName]: { [dateRange]: finalData, dateIndex: dateIndex } };
  let olditems = [];
  olditems.push(JSON.stringify(empData));

  localStorage.setItem('EmployeesData', [...olditems])

}
setrowsData(finalData);
  

  }

  const reject = () => {
    
    const arr1 = rowsData.map(e => e.id);  
const arr2 = selectedRows.map(e => e.id);  
let unique1 = arr1.filter((o) => arr2.indexOf(o) === -1);
let unique2 = arr2.filter((o) => arr1.indexOf(o) === -1);

const unique = unique1.concat(unique2);
let finalData = rowsData.filter((o) => unique.includes(o.id));
const empName = localStorage.getItem('employeeName');
console.log(empName);
const dateRange = localStorage.getItem('dateRange');
const dateIndex = localStorage.getItem('selectedDateRangeIndex');
if (empName && dateRange) {
  const empData = { [empName]: { [dateRange]: finalData, dateIndex: dateIndex } };
  let olditems = [];
  olditems.push(JSON.stringify(empData));

  localStorage.setItem('EmployeesData', [...olditems])
 // localStorage.setItem('EmployeesData', [JSON.stringify(empData)])

}
setrowsData(finalData);
  

  }
  var vertical = "top";
  var horizontal = "center";
  useEffect(() => {
   
    const data = JSON.parse(localStorage.getItem('EmployeesData'));
   data && data.forEach((e, i )=> {
      let strinfy = JSON.parse(e);    
      setselectedDates(Object.keys(Object.values(strinfy)[0])[0]);  
      let arrayData = Object.values(Object.values(strinfy)[0]);
     let rowsArray = arrayData[0].map((obj, index) => {obj["id"] = index;obj["empName"] = Object.keys(strinfy)[0]; return obj} );
     if(localStorage.getItem("approved") === "true") {
      let removeItem = localStorage.getItem("details");

    let sorted =   rowsArray.filter((e, i) => e.id !== Number(removeItem));

     const empName = localStorage.getItem('employeeName');
        console.log(empName);
        const dateRange = localStorage.getItem('dateRange');
        const dateIndex = localStorage.getItem('selectedDateRangeIndex');
        if (empName && dateRange) {
          const empData = { [empName]: { [dateRange]: sorted, dateIndex: dateIndex } };
          let oldArray = [];
          oldArray.push(empData);
    
          localStorage.setItem('EmployeesData', [...oldArray])

        }

      setrowsData([...sorted]); 
     } else {
      setrowsData([...rowsArray]);
     }
          
    })  
}, []);
const checkItems = async(event, row, index) => {
  console.log(event.target.checked);
  if(event.target.checked) {
    let rowsList = selectedRows;
    rowsList.push(row);
 

  setSelectedRows(rowsList);
  setdisableButtons(((selectedRows.length > 0) ? false : true));

  }

}
  return (

    <div className="overall-layout">
      <Snackbar anchorOrigin={{ vertical, horizontal }} open={toastOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Approved {selectedRows.map(e => e.EmpName).toString()}
        </Alert>
      </Snackbar>
      <Snackbar anchorOrigin={{ vertical, horizontal }} open={rejectoast} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
          Rejected {selectedRows.map(e => e.EmpName).toString()}
        </Alert>
      </Snackbar>

      <div className="wrapper">
        <div className="align-header">
          <select disabled className="select" value={selectedDates}>
            <option value="">{selectedDates}</option>
          </select>
        </div>
        <div className="align-buttons">
          <div>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" disabled={disableButtons} color="success" onClick={apply}>Approve</Button>
              <Button variant="contained" disabled={disableButtons} color="error" onClick={reject}>Reject</Button>
            </Stack>
          </div>
          <div>
          </div>
        </div>
      </div>
      <div>
        <Box sx={{ height: 400, width: '100%' }}>
        <table class="table table-bordered text-center">
<thead className='table-secondary'>
    <tr className='bg-primary'>
<th className='col-md-1'>   Select</th>
        <th className='col-md-2'>ProjectCode</th>
        <th className='col-md-2'>JobCode</th>
       
        <th className='col-md-2'>Emp name</th>
        <th className='col-md-1'>Total</th>
<th className='col-md-1' >ViewDetails</th>
<th className='col-md-2' >Comments</th>
    </tr>
</thead>
<tbody id="table-body">
    {rowsData && rowsData.length > 0 ? rowsData.map((row, index) => {
        return (
            <tr>
               <td className='col-md-1'>
               <Checkbox onChange={(e) => checkItems(e,row, index)} />
                </td>
                <td className='col-md-2'>
                   {row.projectCode}

                </td>
                <td className='col-md-2'>
                    <div className="container">
                        <div className="row justify-content-md-center">
                            <div className="col-md-12 input">
                            {row.jobCode}
                            </div>
                            
                        </div>
                    </div>
                </td>
                <td className='col-md-2'>
                    <div className="container">
                        <div className="row justify-content-md-center">
                            <div className="col-md-12 input">
                          {row.empName}
                            </div>
                           
                        </div>
                    </div>
                </td>
                <td className='col-md-1'>{row.total}</td>

                <td className='col-md-1'>
                <div className="container">
                        <div className="row justify-content-md-center">
                            <div className="col-md-12 input">
                            <Button onClick={(e) => detailView(row)}><RemoveRedEyeIcon /></Button>
                            </div>
                           
                        </div>
                    </div>
                </td>
               
                <td className='col-md-2'>
                <div className="container">
                        <div className="row justify-content-md-center">
                            <div className="col-md-12 input">
                            <input type="text" style={{width: "100%"}} onChange={(e, i) => trigger(row, e)} />
                            </div>
                        
                        </div>
                    </div>
                </td>
               
                
            </tr>
        )
    })
  : <p className="noData">No Data</p>}
   
    
</tbody>
</table>


        </Box>
      </div>
    </div>
  )
}



export default Manager;