import React, { useEffect } from 'react'
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';


import { useState } from 'react';
import { Grid, } from '@mui/material';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { FaRegTrashAlt } from "react-icons/fa";

import projectData from "../../mock-data/project-codes.json";
import jobData from "../../mock-data/job-codes.json";

const TimeSheetEntry = () => {

    const role = localStorage.getItem("role") ?? 'employee';
    const [projectCodes, setProjectCodes] = useState([]);
    const [comments,setComments] = useState('');
    const [jobCodes, setJobCodes] = useState([]);
    const [day1Total, setDay1Total] = useState(0);
    const [day2Total, setDay2Total] = useState(0);
    const [day3Total, setDay3Total] = useState(0);
    const [day4Total, setDay4Total] = useState(0);
    const [day5Total, setDay5Total] = useState(0);
    const [day6Total, setDay6Total] = useState(0);
    const [day7Total, setDay7Total] = useState(0);
   

    useEffect(() => {
        setProjectCodes(projectData);
        if(window.location.href.includes("details")) {
            const employeesData= JSON.parse(localStorage.getItem('EmployeesData'));
            console.log(employeesData);
            if(employeesData && employeesData.length) {
             let timesheetData =   Object.values(Object.values(JSON.parse(employeesData[0]))[0])[0];
             setTimeSheetRows(timesheetData);
             setDay1Total(timesheetData.reduce((total, row) => total + parseInt(row['day1']), 0));
             setDay2Total(timesheetData.reduce((total, row) => total + parseInt(row['day2']), 0));
             setDay3Total(timesheetData.reduce((total, row) => total + parseInt(row['day3']), 0));
             setDay4Total(timesheetData.reduce((total, row) => total + parseInt(row['day4']), 0));
             setDay5Total(timesheetData.reduce((total, row) => total + parseInt(row['day5']), 0));
             setDay6Total(timesheetData.reduce((total, row) => total + parseInt(row['day6']), 0));
             setDay7Total(timesheetData.reduce((total, row) => total + parseInt(row['day7']), 0));
            }
       
        }
       
     
    }, []);


    const getJobCodes = (projectCode) => {
        console.log(jobData);
        const jobs = jobData.filter((job) => job.projectCode === projectCode);
        setJobCodes(jobs);
    }


    const [timeSheetRows, setTimeSheetRows] = useState([{ projectCode: '', jobCode: '', day1: 0, day2: 0, day3: 0, day4: 0, day5: 0, day6: 0, day7: 0, total: 0 }]);

    const addRow = () => {
        const rows = timeSheetRows;
        rows.push({ projectCode: '', jobCode: '', day1: 0, day2: 0, day3: 0, day4: 0, day5: 0, day6: 0, day7: 0, total: 0 });
        setTimeSheetRows([...rows]);
        console.log(rows);
    }

    const removeRows = (index) => {
        
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
        console.log(rows);
       
    }

    const changeTimeSheetData = (key, index, value) => {
        const rows = [...timeSheetRows];
        const oldValue = parseInt(rows[index][key]);
        rows[index][key] = value;

        if (key == 'projectCode') {
            getJobCodes(value);
        } else if (key !== 'projectCode' && key !== 'jobCode' && key !== 'total') {
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
        console.log(rows);

        const empName = localStorage.getItem('employeeName');
        console.log(empName);
        const dateRange = localStorage.getItem('dateRange');
        const dateIndex = localStorage.getItem('selectedDateRangeIndex');
           if(empName && dateRange){
                const empData = {[empName]: {[dateRange]:rows, dateIndex: dateIndex}};
             
                localStorage.setItem("empData", JSON.stringify(empData))

           } 
    }


    return (
        <>
            {timeSheetRows && timeSheetRows.length > 0 && timeSheetRows.map((row, index) => {
                return <Grid container spacing={3} key={index} style={{margin:'auto', padding:'5px'}}>
                    <Grid item xs={4}>
                        <Grid container spacing={3}>
                            <Grid item>
                            {role === 'manager' &&  <input typ="text" disabled value={row['projectCode']}  style={{height: "35px"}} role="textbox"/>}
                            {role !== 'manager' &&  
                             <Autocomplete
                             disableClearable
                             sx={{ width: 180 }}
                             options={projectCodes.map((option) => option.code)}
                             onChange={(event, value) => changeTimeSheetData('projectCode', index, value)}
                             renderInput={(params) => (
                                 <TextField
                                     {...params}
                                     className='entry-input entry-auto-suggest'
                                     value={row['projectCode']}
                                     label="Project Code"
                                     InputProps={{
                                         ...params.InputProps,
                                         type: 'search',
                                     }}
                                     aria-label={`Project Code for row ${index}`}
                                     tabIndex={0}
                                 />
                             )}
                         />}
                           
                              
                            </Grid>
                            <Grid item>
                            {role === 'manager' &&  <input typ="text" value={row['jobCode']}  disabled style={{height: "35px"}} role="textbox"/>}
                            {role !== 'manager' &&  
                                <Autocomplete
                                    disableClearable
                                    sx={{ width: 180 }}
                                    options={jobCodes.map((option) => option.jobCode)}
                                    onChange={(event, value) => changeTimeSheetData('jobCode', index, value)}

                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            className='entry-input entry-auto-suggest'
                                            value={row['jobCode']}
                                            label="Job Code"
                                            InputProps={{
                                                ...params.InputProps,
                                                type: 'search',
                                            }}
                                            aria-label={`Job Code for row ${index}`}
                                            tabIndex={0}
                                        />
                                       
                                    )}
                                    
                                />
                                        }
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container spacing={2}>
                            <Grid item>
                                <input typ="text" value={Math.min(row['day1'], 16)} onChange={(event) => changeTimeSheetData('day1', index, Math.min(event.target.value, 16))} className='entry-input w-50' aria-label={`Day 1 for row ${index}`} role="textbox"/>
                            </Grid>
                            <Grid item>
                                <input typ="text" value={Math.min(row['day2'], 16)} onChange={(event) => changeTimeSheetData('day2', index, Math.min(event.target.value, 16))} className='entry-input w-50' aria-label={`Day 2 for row ${index}`} role="textbox"/>
                            </Grid>
                            <Grid item>
                                <input typ="text" value={Math.min(row['day3'], 16)} onChange={(event) => changeTimeSheetData('day3', index, Math.min(event.target.value, 16))} className='entry-input w-50' aria-label={`Day 3 for row ${index}`} role="textbox"/>
                            </Grid>
                            <Grid item>
                                <input typ="text" value={Math.min(row['day4'], 16)} onChange={(event) => changeTimeSheetData('day4', index, Math.min(event.target.value, 16))} className='entry-input w-50' aria-label={`Day 4 for row ${index}`} role="textbox"/>
                            </Grid>
                            <Grid item>
                                <input typ="text" value={Math.min(row['day5'], 16)} onChange={(event) => changeTimeSheetData('day5', index, Math.min(event.target.value, 16))} className='entry-input w-50' aria-label={`Day 5 for row ${index}`} role="textbox"/>
                            </Grid>
                            <Grid item>
                                <input typ="text" value={Math.min(row['day6'], 16)} onChange={(event) => changeTimeSheetData('day6', index, Math.min(event.target.value, 16))} className='entry-input w-50' aria-label={`Day 6 for row ${index}`} role="textbox"/>
                            </Grid>
                            <Grid item>
                                <input typ="text" value={Math.min(row['day7'], 16)} onChange={(event) => changeTimeSheetData('day7', index, Math.min(event.target.value, 16))} className='entry-input w-50' aria-label={`Day 7 for row ${index}`} role="textbox"/>

                            </Grid>
                            <Grid item>
                            {role !== 'manager' && <FaRegTrashAlt onClick={() => removeRows(index)} role="button" tabIndex={0} aria-label={`Remove row ${index}`}/>}
                            </Grid>

                        </Grid>
                    </Grid>
                    <Grid item xs={2}>
                        <input disabled value={row['total']} onChange={(event) => changeTimeSheetData('total', index, event.target.value)} placeholder='Total' typ="text" className='entry-value w-50' aria-label={`Total for row ${index}`}/>
                    </Grid>
                </Grid>
            })}

            <Grid container spacing={3} style={{margin:'auto', padding:'5px'}}>
                <Grid item xs={12}>
                {role !== 'manager' && <button type="button" onClick={() => addRow()} className='timesheet-button' aria-label="Add Row Button" style={{ width: '180px', textAlign: 'center' }}>Add Row</button>}
                </Grid>
            </Grid>
            <Grid container spacing={3} style={{margin:'auto', padding:'5px'}}>
                <Grid item xs={4}>

                </Grid>
                <Grid item xs={6}>
                    <Grid container spacing={2}>
                        <Grid item>
                            <input type='text' value={day1Total}  className='entry-value w-50' aria-label="Day 1 Total" role="cell"/>
                        </Grid>
                        <Grid item>
                            <input type='text' value={day2Total} className='entry-value w-50' aria-label="Day 2 Total" role="cell"/>
                        </Grid>
                        <Grid item>
                            <input type='text' value={day3Total} className='entry-value w-50' aria-label="Day 3 Total" role="cell"/>
                        </Grid>
                        <Grid item>
                            <input type='text' value={day4Total} className='entry-value w-50' aria-label="Day 4 Total" role="cell"/>
                        </Grid>
                        <Grid item>
                            <input type='text' value={day5Total} className='entry-value w-50' aria-label="Day 5 Total" role="cell"/>
                        </Grid>
                        <Grid item>
                            <input type='text' value={day6Total} className='entry-value w-50' aria-label="Day 6 Total" role="cell"/>
                        </Grid>
                        <Grid item>
                            <input type='text' value={day7Total} className='entry-value w-50' aria-label="Day 7 Total" role="cell"/>
                        </Grid>
                    </Grid>

                </Grid>
                <Grid item xs={2}>
                    <input disabled typ="text" value={day1Total + day2Total + day3Total + day4Total + day5Total + day6Total + day7Total} className='entry-value w-50'  aria-label="Total Sum" />
                </Grid>
                <Grid item>
                {role == 'manager' && <TextField  sx={{width:'435%'}} id="outlined-basic" label="comments"  value={comments} variant="outlined" onChange={(e)=>setComments(e.target.value)} />}
                </Grid>
            </Grid>
        </>

    );
}

export default TimeSheetEntry;



