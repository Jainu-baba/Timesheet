import React from 'react'
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Grid } from '@mui/material';
import DateRange from './DateRange.json';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

export default function TimeSheet() {
    const naviagate = useNavigate();
    const role = localStorage.getItem("role") ?? 'employee';
    const [employeeName, setEmployeeName] = useState('');
    const [selectedRange, setSelectedRange] = useState(null);
    const [dateRanges, setDateRanges] = useState(DateRange);
    const [selectedDates, setSelectedDates] = useState(['', '', '', '', '', '', '']);

    const [open, setOpen] = React.useState(false);   
    const [selectedDate, setselectedDate] = React.useState(null);
    var vertical = "top";
    var horizontal = "center";
    const [toastOpen, settoastOpen] = React.useState(false);
    const [rejectoast, setrejectoast] = React.useState(false);

    const BacktoManagerApprove = () => {
        localStorage.setItem("approved", true);
        settoastOpen(true);
        setTimeout(() => naviagate("/manager"), 1000);
       


    }
    const BacktoManagerRejected = () => {
        setrejectoast(true);
        setTimeout(() => naviagate("/manager"), 1000);
        localStorage.setItem("approved", true);


    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    useEffect(() => {
        setDateRanges(DateRange);
        localStorage.setItem("approved", false);
        if(!window.location.href.includes("details")) {
            localStorage.setItem('EmployeesData', JSON.stringify([]));
        }
     
        if (window.location.href.includes("details")) {        
         const employeesData= JSON.parse(localStorage.getItem('EmployeesData'));
         const pathname = window.location.pathname;
         const name = pathname.split("/")[2];
         setEmployeeName(name);
         console.log(employeesData);    
       let date = employeesData.length && Object.values(JSON.parse(employeesData[0]))[0].dateIndex;
       setselectedDate(date);
       setSelectedRange(dateRanges[date]);
       setSelectedDates(dateRanges[date]?.dates)
        };
      
      
    }, []);

    const handleEmployee = (empName) => {
        setEmployeeName(empName);
        localStorage.setItem('employeeName', empName);
        localStorage.setItem(empName, '');
    }

    const handleToastClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        settoastOpen(false);
        setrejectoast(false);
      };

    const submitData = () => {

        const empData = localStorage.getItem("empData");
        console.log(JSON.parse(empData));
        let oldData = localStorage.getItem('EmployeesData') ? JSON.parse(localStorage.getItem('EmployeesData')) : [];
        oldData.push(empData);
        localStorage.setItem('EmployeesData', JSON.stringify(oldData));
        handleClickOpen();
        setTimeout(() => {
            handleClose();
        }, 2000);
    }


    const handleDropdownChange = (event) => {
        const selectedIndex = event.target.value;
        setSelectedRange(dateRanges[selectedIndex]);
        setSelectedDates(dateRanges[selectedIndex].dates);
        const edata = dateRanges[selectedIndex].fromDate + '-' + dateRanges[selectedIndex].toDate;
        localStorage.setItem('dateRange', edata);
        const empName = localStorage.getItem('employeeName');
        let empData = localStorage.getItem(empName);
        localStorage.setItem('selectedDateRangeIndex', selectedIndex);
        empData = { [edata]: []};
        localStorage.setItem(empName, JSON.stringify(empData));

    };
    return (
        <>
            <Snackbar anchorOrigin={{ vertical, horizontal }} open={toastOpen} autoHideDuration={6000} onClose={handleToastClose}>
                <Alert onClose={handleToastClose} severity="success" sx={{ width: '100%' }}>
                    Applied successfully
                </Alert>
            </Snackbar>
            <Snackbar anchorOrigin={{ vertical, horizontal }} open={rejectoast} autoHideDuration={6000} onClose={handleToastClose}>
                <Alert onClose={handleToastClose} severity="warning" sx={{ width: '100%' }}>
                    Rejected successfully
                </Alert>
            </Snackbar>
            <Snackbar anchorOrigin={{ vertical, horizontal }} open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
         Submitted timesheet
        </Alert>
      </Snackbar>
            <Grid container spacing={4} className='mb-20' style={{ margin: 'auto', padding: '5px' }}>
                <Grid item xs>
                    <select className='entry-selectbox' value={employeeName} onChange={(event) => handleEmployee(event.target.value)} aria-label="Select Employee">
                        <option>Employee Name</option>
                        <option>Bhargavi</option>
                        <option>Karthik</option>
                        <option>Ejaz</option>
                        <option>Rakesh</option>
                        <option>Jainu</option>
                    </select>
                </Grid>
                <Grid item xs={role === 'manager' ? 6 : 8}>
                    <select className='entry-selectbox' value={selectedDate} onChange={handleDropdownChange} aria-label="Select Date Range">
                        <option value={null}>Select a date range</option>
                        {dateRanges.map((range, index) => (
                            <option key={index} value={index}>
                                {range.fromDate} - {range.toDate}
                            </option>
                        ))}
                    </select>
                </Grid>
                <Grid item xs>
                    {role !== 'manager' && <button onClick={submitData} disabled={!(employeeName && selectedRange) ? 'true' : ''} className='timesheet-button' aria-label="Submit Data">submit</button>}
                    {role === 'manager' && <Stack direction="row" spacing={2}>
                        <Button variant="contained" color="success" onClick={(e) => BacktoManagerApprove()}>Approve</Button>
                        <Button variant="contained" color="error" onClick={(e) => BacktoManagerRejected()} >Reject</Button>
                    </Stack>}
                </Grid>
            </Grid>

            <Grid container spacing={3} className='mb-20' style={{ margin: 'auto', padding: '5px' }}>
                <Grid item xs={4}>
                    <Grid container spacing={3}>
                        <Grid item>
                            <div className="rs-btn-disabled" aria-disabled="true">Project Code</div>
                        </Grid>
                        <Grid item>
                            <div className="rs-btn-disabled" aria-disabled="true">Job Code</div>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Grid container spacing={2}>
                        {selectedDates && selectedDates.length > 0 && selectedDates.map((date) => {
                            return <Grid item>
                                <div className="rs-btn-disabled w-30" aria-label={date ? `Date ${date}` : "No Date"} tabIndex={0} role="cell">{date ?? ''}</div>
                            </Grid>
                        })}
                    </Grid>
                </Grid>
                <Grid item xs={2}>
                    <div className="rs-btn-disabled w-50" aria-label="Total" role="cell">total</div>
                </Grid>
            </Grid>

        </>
    );
}



