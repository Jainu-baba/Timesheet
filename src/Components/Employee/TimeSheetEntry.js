import React, { useEffect } from 'react'
import { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from "react-router-dom";
import DateRange from './DateRange.json';
import projectData from "../../mock-data/project-codes.json";
import jobData from "../../mock-data/job-codes.json";
import Select from 'react-select';
import MuiAlert from '@mui/material/Alert';
import "./Table.css";
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const TimeSheetEntry = () => {
    const naviagate = useNavigate();
    const role = localStorage.getItem("role") ?? 'employee';
    const [dateRanges, setDateRanges] = useState(DateRange);
    const [selectedDates, setSelectedDates] = useState(['', '', '', '', '', '', '']);
    const [selectedRange, setSelectedRange] = useState(null);
    const [selectedDate, setselectedDate] = React.useState(null);
    const [comments,setComments] = useState('');
    const [open, setOpen] = React.useState(false); 
    const [currentpojectCode,setcurrentpojectCode] = React.useState(null);
    const [currentjobCode,setcurrentjobCode] = React.useState(null);

    const [suggestions, setSuggestions] = useState([]);
    const [text, setText] = useState('');
    const [jobtext, setjobText] = useState('');

    // const [items, setItems] = useState([]);


    const [timeSheetRows, setTimeSheetRows] = useState([
        { projectCode: '', jobCode: '', day1: 0, day2: 0, day3: 0, day4: 0, day5: 0, day6: 0, day7: 0, total: 0 }]
       );

    // dayswise column sum
    const [day1Total, setDay1Total] = useState(0);
    const [day2Total, setDay2Total] = useState(0);
    const [day3Total, setDay3Total] = useState(0);
    const [day4Total, setDay4Total] = useState(0);
    const [day5Total, setDay5Total] = useState(0);
    const [day6Total, setDay6Total] = useState(0);
    const [day7Total, setDay7Total] = useState(0);
    

    const [projectCodes, setProjectCodes] = useState([]);
    const [employeeName, setEmployeeName] = useState('');
    const [jobCodes, setJobCodes] = useState([]);
    var vertical = "top";
    var horizontal = "center";
    const [toastOpen, settoastOpen] = React.useState(false);
    const [rejectoast, setrejectoast] = React.useState(false);
    const [employees, setEmployees] = useState(
        ['Bhargavi',
            'Karthik',
            'Rakesh']);
    const [employee, setEmployee] = useState('');

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
    const handleToastClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        settoastOpen(false);
        setrejectoast(false);
      };



    useEffect(() => {
        setEmployees(['Bhargavi',
            'Karthik',
            'Rakesh'])
        setDateRanges(DateRange);
        setSelectedDates(DateRange[0].dates)
        console.log(DateRange[0].dates);
        setProjectCodes(projectData);
        setJobCodes(jobData);
        if (window.location.href.includes("details")) {        
            const employeesData= JSON.parse(localStorage.getItem('EmployeesData'));
            const pathname = window.location.pathname;
            const name = pathname.split("/")[2];
            setEmployeeName(name);
            console.log(employeesData);    
          let date = employeesData.length && Object.values(JSON.parse(employeesData[0]))[0].dateIndex;
          setselectedDate(date);
          setSelectedRange(dateRanges[date]);
          setSelectedDates(dateRanges[date]?.dates);
       
          if(employeesData && employeesData.length) {
              const selectedView = Number(localStorage.getItem('details'));
           let timesheetData =   Object.values(Object.values(JSON.parse(employeesData[0]))[0])[0];
          let updateTable =  timesheetData[selectedView]
           setTimeSheetRows([updateTable]);
           setDay1Total( parseInt(updateTable['day1']));
           setDay2Total(parseInt(updateTable['day2']));
           setDay3Total(parseInt(updateTable['day3']));
           setDay4Total(parseInt(updateTable['day4']));
           setDay5Total(parseInt(updateTable['day5']));
           setDay6Total(parseInt(updateTable['day6']));
           setDay7Total(parseInt(updateTable['day7']));
           };
           if(window.location.href.includes("details")) {
          
            
            }
       
        }
    }, []);
   


    const handleEmployee = (empName) => {
        setEmployeeName(empName);
        localStorage.setItem('employeeName', empName);
        localStorage.setItem(empName, '');
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
        empData = { [edata]: [] };
        localStorage.setItem(empName, JSON.stringify(empData));

    };


    const addTableRow = () => {
        const rows = timeSheetRows;
        rows.push({ projectCode: '', jobCode: '', day1: 0, day2: 0, day3: 0, day4: 0, day5: 0, day6: 0, day7: 0, total: 0 });
        setTimeSheetRows([...rows]);
        console.log(rows);
    }
    const deleteTableRow = (index) => {
        console.log('index:', index);

        const rows = [...timeSheetRows];
        rows.splice(index, 1);


        setDay1Total(rows.reduce((total, row) => total + parseInt(row['day1']), 0));
        setDay2Total(rows.reduce((total, row) => total + parseInt(row['day2']), 0));
        setDay3Total(rows.reduce((total, row) => total + parseInt(row['day3']), 0));
        setDay4Total(rows.reduce((total, row) => total + parseInt(row['day4']), 0));
        setDay5Total(rows.reduce((total, row) => total + parseInt(row['day5']), 0));
        setDay6Total(rows.reduce((total, row) => total + parseInt(row['day6']), 0));
        setDay7Total(rows.reduce((total, row) => total + parseInt(row['day7']), 0));



        setTimeSheetRows([...rows]);
    };

    
    const suggestionSelectedVal = (key, index, value, type) => {
        const rows = [...timeSheetRows];
        rows[index][key] = value;
        setTimeSheetRows([...rows]);
    }
    const handleProjectCode = (code, i, data ) => {
        if(code === "projectCode") {
            setcurrentpojectCode(data);
        }
        if(code === "jobCode") {
            setcurrentjobCode(data);
        }
      
timeSheetRows.map((obj, index) => {
    if(index === i) {
        obj[code] = data.value
        return obj;
    }
   
} 

);

    }
    const changeTimeSheetData = async(key, index, value) => {
        console.log('key:', key, 'index:', index, 'value:', value);
        const rows = [...timeSheetRows];
        rows[index][key] = value;
        console.log('das:', document.getElementById(`auto_suggestion_${index}`));


        if (key === 'projects') {
            let suggestions = [];
            if (value.length > 0) {
                const regex = new RegExp(`^${value}`, 'i');
                suggestions = projectCodes.map(ele => ele.code).sort().filter(v => regex.test(v));
                setSuggestions(suggestions);
            }

            const root = document.getElementById(`auto_suggestion_${index}_srchList`);
            for await (const suggestion of suggestions) {
                const optionElement = `<option onClick={(e) => {${suggestionSelectedVal(key, index, suggestion, 'project')}}>${suggestion}</option>`;
                root.innerHTML += optionElement;
            }
        }
        if (key === 'projectCode') {
            getJobCodes(value);
        } else if (key !== 'projectCode' && key !== 'jobCode' && key !== 'total') {
            const oldValue = parseInt(rows[index][key]);
            console.log('oldValue', oldValue);

            console.log('total:', Math.min(parseInt(rows[index]['day1']), 16) + Math.min(parseInt(rows[index]['day2']), 16) + Math.min(parseInt(rows[index]['day3']), 16) + Math.min(parseInt(rows[index]['day4']), 16) + Math.min(parseInt(rows[index]['day5']), 16) + Math.min(parseInt(rows[index]['day6']), 16) + Math.min(parseInt(rows[index]['day7']), 16))
            rows[index]['total'] = Math.min(parseInt(rows[index]['day1']), 16) + Math.min(parseInt(rows[index]['day2']), 16) + Math.min(parseInt(rows[index]['day3']), 16) + Math.min(parseInt(rows[index]['day4']), 16) + Math.min(parseInt(rows[index]['day5']), 16) + Math.min(parseInt(rows[index]['day6']), 16) + Math.min(parseInt(rows[index]['day7']), 16);
        }

        setDay1Total(rows.reduce((total, row) => total + parseInt(row['day1']), 0));
        setDay2Total(rows.reduce((total, row) => total + parseInt(row['day2']), 0));
        setDay3Total(rows.reduce((total, row) => total + parseInt(row['day3']), 0));
        setDay4Total(rows.reduce((total, row) => total + parseInt(row['day4']), 0));
        setDay5Total(rows.reduce((total, row) => total + parseInt(row['day5']), 0));
        setDay6Total(rows.reduce((total, row) => total + parseInt(row['day6']), 0));
        setDay7Total(rows.reduce((total, row) => total + parseInt(row['day7']), 0));

        setTimeSheetRows([...rows]);
        const empName = localStorage.getItem('employeeName');
        console.log(empName);
        const dateRange = localStorage.getItem('dateRange');
        const dateIndex = localStorage.getItem('selectedDateRangeIndex');
        if (empName && dateRange) {
          const empData = { [empName]: { [dateRange]: rows, dateIndex: dateIndex } };
    
          localStorage.setItem("empData", JSON.stringify(empData))
    
        }
    }

    const getJobCodes = (projectCode) => {
        console.log(jobData);
        const jobs = jobData.filter((job) => job.projectCode === projectCode);
        setJobCodes(jobs);
        
    }

    const submitData = () => {
        const empName = localStorage.getItem('employeeName');
        console.log(empName);
        const dateRange = localStorage.getItem('dateRange');
        const dateIndex = localStorage.getItem('selectedDateRangeIndex');
        if (empName && dateRange) {
          const empData = { [empName]: { [dateRange]: timeSheetRows, dateIndex: dateIndex } };
    
          localStorage.setItem("empData", JSON.stringify(empData))
    
        }

        const NewempData = localStorage.getItem("empData");
        console.log(JSON.parse(NewempData));
        let oldData = localStorage.getItem('EmployeesData') ? JSON.parse(localStorage.getItem('EmployeesData')) : [];
        oldData.push(NewempData);
        localStorage.setItem('EmployeesData', JSON.stringify(oldData));
       handleClickOpen();
        setTimeout(() => {
           handleClose();
        }, 2000);
    }

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
         Timesheet Submitted Successfully
        </Alert>
      </Snackbar>
            <div class="container mt-4">
                <div class="employee-select">
                     <select className={role !== 'manager' ? 'employee-name' : 'employee-name disabled' }  value={employeeName} onChange={(event) => handleEmployee(event.target.value)}>
                    <option>Employee Name</option>
                        <option>Bhargavi</option>
                        <option>Karthik</option>
                        <option>Ejaz</option>
                        <option>Rakesh</option>
                        <option>Jainu</option>
                    </select> 
                  
                    <div className='col-md-7'>
                        <select className={role !== 'manager' ? 'employee-name' : 'employee-name disabled' }  value={selectedDate} onChange={handleDropdownChange}>
                            {dateRanges.map((range, index) => (
                                <option key={index} value={index}>
                                    {range.fromDate} - {range.toDate}
                                </option>
                            ))}
                        </select>
                    </div>
                    {role !== 'manager' && <button class="btn btn-primary" onClick={submitData} disabled={!(employeeName && timeSheetRows[0].projectCode.length>0 && timeSheetRows[0].jobCode.length>0) ? 'true' : ''} className='timesheet-button'>Submit</button>}
                    {role === 'manager' && <Stack direction="row" spacing={2}>
                        <Button variant="contained" color="success" onClick={(e) => BacktoManagerApprove()}>Approve</Button>
                        <Button variant="contained" color="error" onClick={(e) => BacktoManagerRejected()} >Reject</Button>
                    </Stack>}
                </div>

                <table class="table table-bordered text-center" cellspacing="0">
                    <thead className='table-secondary'>
                        <tr className='bg-primary'>
                            <th className='col-md-3'>ProjectCode</th>
                            <th className='col-md-3'>JobCode</th>
                            {selectedDates && selectedDates.length > 0 && selectedDates.map((date, index) => {
                                return <th key={index}>{date ?? ''}</th>
                            })}
                            {role !== 'manager' && <th className='col-md-1'>Delete</th>}
                            <th className='col-md-2' Style={'width:12px;'}>Total</th>
                        </tr>
                    </thead>
                    <tbody id="table-body">
                        {timeSheetRows && timeSheetRows.length > 0 && timeSheetRows.map((row, index) => {
                            return (
                                <tr>
                                    <td lassName='col-md-3'>
                                        <div className="container">
                                            <div className="row justify-content-md-center">
                                                <div className="col-md-12 input">
                                                {role === 'manager' &&  <input type="text" disabled value={row.projectCode}   role="textbox"/>}
                                                {role !== 'manager' &&
                                                <Select
                                               defaultValue={currentpojectCode}
                                                value={{value: row.projectCode, label:row.projectCode }}
                                                   options={projectData}
                                                   onChange={(e) => handleProjectCode("projectCode",index, e)}
                                                   />
       
        
                            } 
                                                </div>
                                               
                                             
                                            </div>
                        
                                        </div>

                                    </td>
                                    <td lassName='col-md-3'>
                                        <div className="container">
                                            <div className="row justify-content-md-center">
                                                <div className="col-md-12 input">
                                                {role === 'manager' &&  <input typ="text" value={row.jobCode}  disabled style={{height: "35px"}} role="textbox"/>}
                                                {role !== 'manager' &&  
                                                <Select
                                                    defaultValue={currentjobCode}
                                                    value={{value: row.jobCode, label: row.jobCode }}
                                                 
                                                   options={jobCodes}
                                                   onChange={(e) => handleProjectCode("jobCode",index, e)}
                                                   />
                                            }
                                                 
                                                </div>
                                               
                                            </div>
                                        </div>
                                    </td>
                                    <td><input type="text" class="form-control text-center" value={row.day1} onChange={(event) => changeTimeSheetData('day1', index, Math.min(event.target.value, 16))} /></td>
                                    <td ><input type="text" class="form-control text-center" value={row.day2} onChange={(event) => changeTimeSheetData('day2', index, Math.min(event.target.value, 16))} /></td>
                                    <td><input type="text" class="form-control text-center" value={row.day3} onChange={(event) => changeTimeSheetData('day3', index, Math.min(event.target.value, 16))} /></td>
                                    <td ><input type="text" class="form-control text-center" value={row.day4} onChange={(event) => changeTimeSheetData('day4', index, Math.min(event.target.value, 16))} /></td>
                                    <td><input type="text" class="form-control text-center" value={row.day5} onChange={(event) => changeTimeSheetData('day5', index, Math.min(event.target.value, 16))} /></td>
                                    <td ><input type="text" class="form-control text-center" value={row.day6} onChange={(event) => changeTimeSheetData('day6', index, Math.min(event.target.value, 16))} /></td>
                                    <td><input type="text" class="form-control text-center" value={row.day7} onChange={(event) => changeTimeSheetData('day7', index, Math.min(event.target.value, 16))} /></td>
                                 
                                    {role !== 'manager' &&
                                    <td>
                                    <button class="btn" onClick={() => { deleteTableRow(index) }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                                            </svg></button></td>}
                                   
                                    <td>{row.total}</td>

                                </tr>
                            )
                        })}
                        <tr>
                            <td className='col-md-2'>{role !== 'manager' && <button class="btn btn-secondary" id="add-row" onClick={addTableRow} style={{height:'40px',width:'150px'}}>Add Row</button>}</td>
                            <td className='col-md-2'></td>
                            <td className='col-md-1 text-center'><p>{day1Total}</p></td>
                            <td className='col-md-1 text-center'><p>{day2Total}</p></td>
                            <td className='col-md-1 text-center'><p>{day3Total}</p></td>
                            <td className='col-md-1 text-center'><p>{day4Total}</p></td>
                            <td className='col-md-1 text-center'><p>{day5Total}</p></td>
                            <td className='col-md-1 text-center'><p>{day6Total}</p></td>
                            <td className='col-md-1 text-center'>{day7Total}</td>
                            {role !== 'manager' && <td className='col-md-1'></td>}
                            <td className='col-md-1'><p>{day1Total + day2Total + day3Total + day4Total + day5Total + day6Total + day7Total}</p></td>
                            
                        </tr>
                       
                    </tbody>
                </table>
                <td> {role == 'manager' && <input type="text" value={comments} onChange={(e)=>setComments(e.target.value)} placeholder='comments' style={{marginTop:'20px',width:'400%',height:'50px',border:'1px solid #D6EAF8'}}/>}</td>
              
            </div>
        </>

    );
}

export default TimeSheetEntry;



