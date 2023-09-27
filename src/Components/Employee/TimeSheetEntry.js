import React, { useEffect } from 'react'
import { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from "react-router-dom";
import DateRange from './DateRange.json';
import axios from 'axios';
import CalendarMonthIcon  from '@mui/icons-material/CalendarMonth';
import projectData from "../../mock-data/project-codes.json";
import jobData from "../../mock-data/job-codes.json";
import Select from 'react-select';
import MuiAlert from '@mui/material/Alert';
import "./Table.css";
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const TimeSheetEntry = (props) => {
    console.log('TimeSheetEntry', props);
    const naviagate = useNavigate();
    const role = localStorage.getItem("role") ?? 'employee';
    const [dateRanges, setDateRanges] = useState(DateRange);
    const [selectedDates, setSelectedDates] = useState(['', '', '', '', '', '', '']);
    const [selectedRange, setSelectedRange] = useState(null);
    const [selectedDate, setselectedDate] = React.useState(null);
    const [comments, setComments] = useState('');
    const [open, setOpen] = React.useState(false);
    const [updateopen, setupdateopen] = React.useState(false);
    const [currentpojectCode, setcurrentpojectCode] = React.useState(null);
    const [currentjobCode, setcurrentjobCode] = React.useState(null);

    const [suggestions, setSuggestions] = useState([]);
    const [text, setText] = useState('');
    const [jobtext, setjobText] = useState('');

    // const [items, setItems] = useState([]);


    const [timeSheetRows, setTimeSheetRows] = useState();

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
    const [response, setresponse] = useState([]);
    const [selectedDateRange, setselectedDateRange] = useState("");

    const BacktoManagerApprove = () => {
        const data = [{
      id: props?.empDetails?.id,
      status: 'approve'
    }]
    axios.put("/statusChange", data).then(response => {
      console.log('response:',response);
      settoastOpen(true);
      setTimeout(() => naviagate("/manager"), 1000);
    }).catch(err => {
      console.log('err:',err);
    })
  return;
  


    
}
    const BacktoManagerRejected = () => {
        const data = [{
      id: props?.empDetails?.id,
      status: 'rejected'
    }]
    axios.put("/statusChange", data).then(response => {
      console.log('response:',response);
      setrejectoast(true);
      setTimeout(() => naviagate("/manager"), 1000);
    }).catch(err => {
      console.log('err:',err);
    })
  return;
      

    }
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClickupdateOpen = () => {
        setupdateopen(true);
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
    
    const handleComments = (e) => {
        const inputValue = e.target.value;
        if (inputValue.length <= 250) {
            setComments(inputValue);
        } else {
    
            setComments(inputValue.slice(0, 250));
        }
    }

    useEffect(() => {
        setEmployees(['Bhargavi',
            'Karthik',
            'Rakesh'])
        setDateRanges(DateRange);
        setSelectedDates(DateRange[0].dates)
        console.log(DateRange[0].dates);
        setProjectCodes(projectData);
        setJobCodes(jobData);
       
    }, []);
    useEffect(() => {
        console.log('emp', props?.empDetails);
        const employeesData = props?.empDetails;
        if (employeesData && employeesData?.id) {

            console.log('employeeName', props.name);
            // const emp = props.empDetails
           let rangeIndex =  localStorage.getItem('selectedDateRangeIndex');
           let sortedDateRange = dateRanges.filter(e => e.date === props?.empDetails.daterange);
           setSelectedDates(sortedDateRange[0].dates)
            console.log('day1', parseInt(props.empDetails['day1']))
            setTimeSheetRows([props.empDetails])
            setDay1Total(parseInt(props.empDetails['day1']));            
            setDay2Total(parseInt(props.empDetails['day2']));
            setDay3Total(parseInt(props.empDetails['day3']));
            setDay4Total(parseInt(props.empDetails['day4']));
            setDay5Total(parseInt(props.empDetails['day5']));
            setDay6Total(parseInt(props.empDetails['day6']));
            setDay7Total(parseInt(props.empDetails['day7']));
            setselectedDateRange(props.empDetails.daterange);
        }else{
            setTimeSheetRows([{ projectCode: '', jobCode: '', day1: 0, day2: 0, day3: 0, day4: 0, day5: 0, day6: 0, day7: 0, total: 0 }])
        }
    }, [props?.empDetails])

    useEffect(() => {
        setEmployeeName(props.name);
    }, [props?.name]);
    useEffect(() => {
        axios.get('/getdata')
        .then((response) => {
            console.log(response);
          setresponse(response.data);
         
          })
          .catch((error) => {
             console.log(error)
          });
    }, [])

    const handleEmployee = (empName) => {
        setEmployeeName(empName);
        localStorage.setItem('employeeName', empName);
        localStorage.setItem(empName, '');
    }





    const handleDropdownChange = (event) => {
        const selectedIndex = event.target.value;
        setSelectedRange(dateRanges[selectedIndex]);
        setSelectedDates(dateRanges[selectedIndex].dates);
        const edata = dateRanges[selectedIndex].date;
        localStorage.setItem('dateRange', edata);
        const empName = localStorage.getItem('employeeName');
        let empData = localStorage.getItem(empName);
        localStorage.setItem('selectedDateRangeIndex', selectedIndex);
        empData = { [edata]: [] };
        localStorage.setItem(empName, JSON.stringify(empData));
        const dateRangeData = timeSheetRows[empName];        
        let rejectedData = response.filter((e) => e.name === empName && e.daterange === edata && e.status !== null);
       
        if(rejectedData && rejectedData.length) {
            setTimeSheetRows(rejectedData);
        }
        else {
              setTimeSheetRows([{ projectCode: '', jobCode: '', day1: 0, day2: 0, day3: 0, day4: 0, day5: 0, day6: 0, day7: 0, total: 0 }]);         
            setDay1Total(0);
            setDay2Total(0);
            setDay3Total(0);
            setDay4Total(0);
            setDay5Total(0);
            setDay6Total(0);
            setDay7Total(0);
        }

    };


    const addTableRow = () => {
        const rows = timeSheetRows;
        rows.push({ projectCode: '', jobCode: '', day1: 0, day2: 0, day3: 0, day4: 0, day5: 0, day6: 0, day7: 0, total: 0 });
        setTimeSheetRows([...rows]);
        console.log(rows);
    }
    const deleteTableRow = (index) => {
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
    const handleProjectCode = (code, i, data) => {
        if (code === "projectCode") {
            setcurrentpojectCode(data);
        }
        if (code === "jobCode") {
            setcurrentjobCode(data);
        }

        timeSheetRows.map((obj, index) => {
            if (index === i) {
                obj[code] = data.value
                return obj;
            }

        }

        );

    }
    const changeTimeSheetData = async (key, index, value) => {       
        const rows = [...timeSheetRows];
        rows[index][key] = value;
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
            const inputText = rows[index][key];
            const parsedValue = parseInt(inputText);
            if (!isNaN(parsedValue)) {              
                rows[index][key] = parsedValue;
            } else {              
                rows[index][key] = 0;
            }          
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
        
    }

    const getJobCodes = (projectCode) => {
        console.log(jobData);
        const jobs = jobData.filter((job) => job.projectCode === projectCode);
        setJobCodes(jobs);

    }

    const submitData = () => {
      const dateRange = localStorage.getItem('dateRange');     
     let subTimesheet =  timeSheetRows.map(e => { e.status = null; return e});
       
     
        const headers = {
            'Content-Type': 'application/json'

        }
        const totalrows = day1Total + day2Total + day3Total + day4Total + day5Total + day6Total + day7Total
        const data = { name: employeeName, daterange: dateRange, timesheetsRows: subTimesheet, totalhours: totalrows }
        let recordExist = response.filter((e) => e.name === employeeName && e.daterange === dateRange && e.id !== null);
        if(recordExist && recordExist.length){
            axios.post('/updateTimeSheet', data, {
                headers: headers
            })
                .then((response) => {
                    handleClickupdateOpen();
                    setTimeout(() => {
                        handleClose();
                    }, 2000);
                    console.log(response)
                })
                .catch((error) => {
                    console.log(error)
                })
        } else {
            axios.post('/submitTimeSheet', data, {
                headers: headers
            })
                .then((response) => {
                    handleClickOpen();
                    setTimeout(() => {
                        handleClose();
                    }, 2000);
                    console.log(response)
                })
                .catch((error) => {
                    console.log(error)
                })
        }

      
    }


    return (
        <>
            <Snackbar anchorOrigin={{ vertical, horizontal }} open={toastOpen} autoHideDuration={6000} onClose={handleToastClose} role="alertdialog" aria-labelledby="approve-toast-message">
                <Alert onClose={handleToastClose} severity="success" sx={{ width: '100%' }}>
                    Applied successfully
                </Alert>
            </Snackbar>
            <Snackbar anchorOrigin={{ vertical, horizontal }} open={rejectoast} autoHideDuration={6000} onClose={handleToastClose} role="alertdialog" aria-labelledby="reject-toast-message">
                <Alert onClose={handleToastClose} severity="warning" sx={{ width: '100%' }}>
                    Rejected successfully
                </Alert>
            </Snackbar>
            <Snackbar anchorOrigin={{ vertical, horizontal }} open={open} autoHideDuration={6000} onClose={handleClose} role="alertdialog" aria-labelledby="timesheet submit-toast-message">
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Timesheet Submitted Successfully
                </Alert>
            </Snackbar>
            <Snackbar anchorOrigin={{ vertical, horizontal }} open={updateopen} autoHideDuration={6000} onClose={handleClose} role="alertdialog" aria-labelledby="timesheet submit-toast-message">
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Timesheet Updated Successfully
                </Alert>
            </Snackbar>
            <div class="container mt-4">
                <div class="employee-select">
                    {window.location.href.includes("manager") || window.location.href.includes("details") && <input type='text' value={employeeName} disabled aria-label="Employee Name" role="textbox" />}
                    {window.location.href.includes("employee")  && <select className={(window.location.href.includes("employee") || window.location.href.includes("details")) ? 'employee-name' : 'employee-name disabled'} value={employeeName} onChange={(event) => handleEmployee(event.target.value)} aria-label="Employee Name" tabIndex={0} role='select box'>
                        <option>Employee Name</option>
                        <option>Bhargavi</option>
                        <option>Karthik</option>
                        <option>Ejaz</option>
                        <option>Rakesh</option>
                        <option>Jainu</option>
                    </select>}

                    <div className='col-md-7'>
                    {window.location.href.includes("manager") || window.location.href.includes("details") && <input type="text" disabled value={selectedDateRange} aria-label="Selected Date Range" role="textbox"/> }
                    {window.location.href.includes("employee")  && <div className='col-md-7'>
                    <div className="select-container">
                        <select className={window.location.href.includes("employee") ? 'employee-name' : 'employee-name disabled'} value={selectedDate} onChange={handleDropdownChange} aria-label="Select Date Range" tabIndex={0}>
                            {dateRanges.map((range, index) => (
                                <option key={index} value={index}>
                                    {range.date}
                                </option>
                            ))}
                        </select>
                        </div>
                        <div className="calendar-icon">
                                    <CalendarMonthIcon />
                                </div>
                    </div>}
                       
                    </div>
                    {window.location.href.includes("employee") && <button class="btn btn-primary" onClick={submitData} disabled={!(employeeName && timeSheetRows[0].projectCode.length > 0 && timeSheetRows[0].jobCode.length > 0) ? 'true' : ''} className='timesheet-button' aria-label="Submit Timesheet" tabIndex={0} role='button'>Submit</button>}
                    {window.location.href.includes("manager") || window.location.href.includes("details") && <Stack direction="row" spacing={2}>
                        <Button variant="contained" color="success" onClick={(e) => BacktoManagerApprove()}  aria-label="Approve Timesheet" role='button' tabIndex={0}>Approve</Button>
                        <Button variant="contained" color="error" onClick={(e) => BacktoManagerRejected()}  aria-label="Reject Timesheet" role='button' tabIndex={0}>Reject</Button>
                    </Stack>}
                </div>

               <table class="table table-bordered text-center" cellspacing="0">
                    <thead className='table-secondary'>
                        <tr className='bg-primary'>
                            <th className='col-md-2' scope="col" aria-label='ProjectCode'>ProjectCode</th>
                            <th className='col-md-2' scope="col"  aria-label='JobCode'>JobCode</th>
                            {selectedDates && selectedDates.length > 0 && selectedDates.map((date, index) => {
                                return <th key={index} scope="col" aria-label='select dates'>{date ?? ''}</th>
                            })}
                            {window.location.href.includes("employee") && <th className='col-md-1' scope="col" aria-label='Delete'>Delete</th>}
                            <th className='col-md-2' Style={'width:12px;'} scope="col" aria-label='Total'>Total</th>
                        </tr>
                    </thead>
                    <tbody id="table-body">
                        {timeSheetRows && timeSheetRows.length > 0 && timeSheetRows.map((row, index) => {
                            return (
                                <tr className={(row.status === "approve") ? "disableRow" : ""} >
                                    <td className='col-md-2'>
                                        <div className="container">
                                            <div className="row justify-content-md-center">
                                                <div className="col-md-12 input">
                                                    {window.location.href.includes("manager") || window.location.href.includes("details") && <input type="text" disabled value={row.projectCode} role="textbox" aria-label={`Project Code for Row ${index + 1}`}/>}
                                                    {window.location.href.includes("employee")  &&
                                                        <Select
                                                            
                                                            value={{ value: row.projectCode, label: row.projectCode }}
                                                            options={projectData}
                                                            onChange={(e) => handleProjectCode("projectCode", index, e)}
                                                            aria-label={`Select Project Code for Row ${index + 1}`}
                                                           
                                                            role='select box'
                                                        />


                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='col-md-2'>
                                        <div className="container">
                                            <div className="row justify-content-md-center">
                                                <div className="col-md-12 input">
                                                    {window.location.href.includes("manager") || window.location.href.includes("details") && <input typ="text" value={row.jobCode} disabled style={{ height: "35px" }} role="textbox" aria-label={`Job Code for Row ${index + 1}`}/>}
                                                    {window.location.href.includes("employee") &&
                                                        <Select
                                                          
                                                            value={{ value: row.jobCode, label: row.jobCode }}

                                                            options={jobCodes}
                                                            onChange={(e) => handleProjectCode("jobCode", index, e)}
                                                            aria-label={`Select Job Code for Row ${index + 1}`}
                                                            
                                                            role='select box'
                                                        />
                                                    }

                                                </div>

                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-md-1"><input type="text" disabled={window.location.href.includes("details")} className="form-control text-center" value={row.day1} onChange={(event) => changeTimeSheetData('day1', index, Math.min(event.target.value, 16))} aria-label={`Day 1 for Row ${index + 1}`} role="textbox" tabIndex={0}/></td>
                                    <td className="col-md-1"><input type="text" disabled={window.location.href.includes("details")} className="form-control text-center" value={row.day2} onChange={(event) => changeTimeSheetData('day2', index, Math.min(event.target.value, 16))} aria-label={`Day 2 for Row ${index + 1}`} role="textbox" tabIndex={0}/></td>
                                    <td className="col-md-1"><input type="text" disabled={window.location.href.includes("details")} className="form-control text-center" value={row.day3} onChange={(event) => changeTimeSheetData('day3', index, Math.min(event.target.value, 16))} aria-label={`Day 3 for Row ${index + 1}`} role="textbox" tabIndex={0}/></td>
                                    <td className="col-md-1"><input type="text" disabled={window.location.href.includes("details")} className="form-control text-center" value={row.day4} onChange={(event) => changeTimeSheetData('day4', index, Math.min(event.target.value, 16))} aria-label={`Day 4 for Row ${index + 1}`} role="textbox" tabIndex={0}/></td>
                                    <td className="col-md-1"><input type="text" disabled={window.location.href.includes("details")} className="form-control text-center" value={row.day5} onChange={(event) => changeTimeSheetData('day5', index, Math.min(event.target.value, 16))} aria-label={`Day 5 for Row ${index + 1}`} role="textbox" tabIndex={0}/></td>
                                    <td className="col-md-1"><input type="text" disabled={window.location.href.includes("details")} className="form-control text-center" value={row.day6} onChange={(event) => changeTimeSheetData('day6', index, Math.min(event.target.value, 16))} aria-label={`Day 6 for Row ${index + 1}`} role="textbox" tabIndex={0}/></td>
                                    <td className="col-md-1"><input type="text" disabled={window.location.href.includes("details")} className="form-control text-center" value={row.day7} onChange={(event) => changeTimeSheetData('day7', index, Math.min(event.target.value, 16))} aria-label={`Day 7 for Row ${index + 1}`} role="textbox" tabIndex={0}/></td>

                                    {window.location.href.includes("employee") &&
                                        <td className="col-md-auto">
                                            <button class="btn" onClick={() => { deleteTableRow(index) }} aria-label={`Delete Row ${index + 1}`} role="button" tabIndex={0}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                                                </svg></button></td>}

                                    <td className="col-md-1" aria-label={`Total for Row ${index + 1}`}  tabIndex={0}>{row.total}</td>

                                </tr>
                            )
                        })}
                        <tr>
                            <td className='col-md-2'>{window.location.href.includes("employee") && <button class="btn btn-secondary" id="add-row" onClick={addTableRow} style={{ height: '40px', width: '150px' }} role="button" tabindex="0" aria-label="Add Row">Add Row</button>}</td>
                             <td className='col-md-2'></td>  
                            <td className='col-md-1 text-center' aria-label="Total for the day1"><p>{day1Total}</p></td>
                            <td className='col-md-1 text-center' aria-label="Total for the day2"><p>{day2Total}</p></td>
                            <td className='col-md-1 text-center' aria-label="Total for the day3"><p>{day3Total}</p></td>
                            <td className='col-md-1 text-center' aria-label="Total for the day4"><p>{day4Total}</p></td>
                            <td className='col-md-1 text-center' aria-label="Total for the day5"><p>{day5Total}</p></td>
                            <td className='col-md-1 text-center' aria-label="Total for the day6"><p>{day6Total}</p></td>
                            <td className='col-md-1 text-center'aria-label="Total for the day7"><p>{day7Total}</p></td>
                            {window.location.href.includes("employee") && <td className='col-md-1'></td>} 
                            <td className='col-md-1' aria-label="Total for the week"><p>{day1Total + day2Total + day3Total + day4Total + day5Total + day6Total + day7Total}</p></td>
                        </tr>
                            <td> {window.location.href.includes("manager")  || window.location.href.includes("details") && <input type="text" value={comments} onChange={(e) => handleComments(e)} placeholder='comments' style={{ marginTop: '20px', width: '400%', height: '50px', border: '1px solid #D6EAF8' }} aria-label="Comments" tabIndex={0}/>}</td>
                    </tbody>
                </table>

            </div>
        </>

    );
}

export default TimeSheetEntry;