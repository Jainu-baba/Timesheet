import React, { useMemo, useEffect, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';


import { useNavigate } from "react-router-dom";
import { Grid } from '@mui/material';
import DateRange from './DateRange.json';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';



import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { FaRegTrashAlt } from "react-icons/fa";

import projectData from "../../mock-data/project-codes.json";
import jobData from "../../mock-data/job-codes.json";





const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
function Item(props) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
        color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
        border: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
        p: 1,
        m: 1,
        borderRadius: 2,
        fontSize: '0.875rem',
        fontWeight: '700',
        ...sx,
      }}
      {...other}
    />
  );
}

Item.propTypes = {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
    ),
    PropTypes.func,
    PropTypes.object,
  ]),
};

export default function TimeSheetEntry() {
    

  const role = localStorage.getItem("role") ?? 'employee';
  const [projectCodes, setProjectCodes] = useState([]);
  const [comments, setComments] = useState('');
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
    if (window.location.href.includes("details")) {
      const employeesData = JSON.parse(localStorage.getItem('EmployeesData'));
      console.log(employeesData);
      if (employeesData && employeesData.length) {
        let timesheetData = Object.values(Object.values(JSON.parse(employeesData[0]))[0])[0];
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
    if (empName && dateRange) {
      const empData = { [empName]: { [dateRange]: rows, dateIndex: dateIndex } };

      localStorage.setItem("empData", JSON.stringify(empData))

    }
  }

  const naviagate = useNavigate();
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
        
        // if (dateRanges && dateRanges.length > 0) {
        //     setSelectedRange(dateRanges[0]);
        //     setSelectedDates(dateRanges[0]?.dates)
        // };
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



  // const Person = {
  //   firstName: string;
  //   lastName: string;
  //   address: string;
  //   city: string;
  //   state: string;
  // };

  const headerColumns = useMemo(
    //column definitions...
    () => [
      {
        accessorKey: 'employeeName',
        header: '',
      },
      {
        accessorKey: 'dateRange',
        header: '',
      },
      {
        accessorKey: 'day1',
        header: 'Day1',
        size:3,
      },
      {
        accessorKey: 'day2',
        header: 'Day2',
        size: 3,
      },
      {
        accessorKey: 'day3',
        header: 'Day3',
        size: 5,
      },
      {
        accessorKey: 'day4',
        header: 'Day4',
        size: 5,
      },
      {
        accessorKey: 'day5',
        header: 'Day5',
        size: 5,
      },
      {
        accessorKey: 'day6',
        header: 'Day6',
        size: 5,
      },
      {
        accessorKey: 'day7',
        header: 'Day7',
        size: 5,
      },
      {
        accessorKey: 'delete',
        header: 'delete',
        size: 5,
      },
      {
        accessorKey: 'submit',
        header: 'Submit',
        size: 5,
      },
    ],
    [],
    //end
  );

  const headerData = [{
    employeeName: <select className='entry-selectbox' value={employeeName} onChange={(event) => handleEmployee(event.target.value)} aria-label="Select Employee">
    <option>Employee Name</option>
    <option>Bhargavi</option>
    <option>Karthik</option>
    <option>Ejaz</option>
    <option>Rakesh</option>
    <option>Jainu</option>
</select>,
    dateRange: <select className='entry-selectbox' value={selectedDate} onChange={handleDropdownChange} aria-label="Select Date Range">
    {/* <option value={null}>Select a date range</option> */}
    {dateRanges.map((range, index) => (
        <option key={index} value={index}>
            {range.fromDate} - {range.toDate}
        </option>
    ))}
</select>,
    submit: <>{role !== 'manager' ? <button onClick={submitData} disabled={!(employeeName && selectedRange) ? 'true' : ''} className='timesheet-button' aria-label="Submit Data">submit</button>
    : <Stack direction="row" spacing={2}>
        <Button variant="contained" color="success" onClick={(e) => BacktoManagerApprove()}>Approve</Button>
        <Button variant="contained" color="error" onClick={(e) => BacktoManagerRejected()} >Reject</Button>
    </Stack>}</>,
  }];

  const data = [];

  {timeSheetRows && timeSheetRows.length > 0 && timeSheetRows.map((row, index) => {

    data.push({
      projectCode: <>{role === 'manager' ?  <input typ="text" disabled value={row['projectCode']}  style={{height: "35px"}} role="textbox"/>
      : <Autocomplete
        disableClearable
        className='autocomplete'
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
      />}</>,
      jobCode: <>{role === 'manager' ?  <input typ="text" value={row['jobCode']}  disabled style={{height: "35px"}} role="textbox"/>
      : <Autocomplete
        disableClearable
        options={jobCodes.map((option) => option.jobCode)}
        onChange={(event, value) => changeTimeSheetData('jobCode', index, value)}
        className='autocomplete'
        renderInput={(params) => (
          <TextField
            {...params}
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

      />}</>,
      day1: <input typ="text" value={Math.min(row['day1'], 16)} onChange={(event) => changeTimeSheetData('day1', index, Math.min(event.target.value, 16))} className='entry-input w-50' aria-label={`Day 1 for row ${index}`} role="textbox"/>,
      day2: <input typ="text" value={Math.min(row['day2'], 16)} onChange={(event) => changeTimeSheetData('day2', index, Math.min(event.target.value, 16))} className='entry-input w-50' aria-label={`Day 2 for row ${index}`} role="textbox"/>,
      day3: <input typ="text" value={Math.min(row['day3'], 16)} onChange={(event) => changeTimeSheetData('day3', index, Math.min(event.target.value, 16))} className='entry-input w-50' aria-label={`Day 3 for row ${index}`} role="textbox"/>,
      day4: <input typ="text" value={Math.min(row['day4'], 16)} onChange={(event) => changeTimeSheetData('day4', index, Math.min(event.target.value, 16))} className='entry-input w-50' aria-label={`Day 4 for row ${index}`} role="textbox"/>,
      day5: <input typ="text" value={Math.min(row['day5'], 16)} onChange={(event) => changeTimeSheetData('day5', index, Math.min(event.target.value, 16))} className='entry-input w-50' aria-label={`Day 5 for row ${index}`} role="textbox"/>,
      day6: <input typ="text" value={Math.min(row['day6'], 16)} onChange={(event) => changeTimeSheetData('day6', index, Math.min(event.target.value, 16))} className='entry-input w-50' aria-label={`Day 6 for row ${index}`} role="textbox"/>,
      day7: <input typ="text" value={Math.min(row['day7'], 16)} onChange={(event) => changeTimeSheetData('day7', index, Math.min(event.target.value, 16))} className='entry-input w-50' aria-label={`Day 7 for row ${index}`} role="textbox"/>,
      delete: <>{role !== 'manager' && <FaRegTrashAlt onClick={() => removeRows(index)} className='w-30' role="button" tabIndex={0} aria-label={`Remove row ${index}`}/>}</>,
      total: <input disabled value={row['total']} onChange={(event) => changeTimeSheetData('total', index, event.target.value)} placeholder='Total' typ="text" className='entry-input w-50' aria-label={`Total for row ${index}`}/>
    });
  })}

  const totalData = [];


    totalData.push({
      projectCode: '',
      jobCode: '',
      day1: <input type='text' value={day1Total}  className='entry-input w-50' aria-label="Day 1 Total" role="cell"/>,
      day2: <input type='text' value={day2Total}  className='entry-input w-50' aria-label="Day 2 Total" role="cell"/>,
      day3: <input type='text' value={day3Total}  className='entry-input w-50' aria-label="Day 3 Total" role="cell"/>,
      day4: <input type='text' value={day4Total}  className='entry-input w-50' aria-label="Day 4 Total" role="cell"/>,
      day5: <input type='text' value={day5Total}  className='entry-input w-50' aria-label="Day 5 Total" role="cell"/>,
      day6: <input type='text' value={day6Total}  className='entry-input w-50' aria-label="Day 6 Total" role="cell"/>,
      day7: <input type='text' value={day7Total}  className='entry-input w-50' aria-label="Day 7 Total" role="cell"/>,
      delete: '',
      total: <input disabled typ="text" value={day1Total + day2Total + day3Total + day4Total + day5Total + day6Total + day7Total} className='entry-input w-50'  aria-label="Total Sum" />
    });

  // if(window.location.href.split("/").includes("employee")) {
  //   localStorage.setItem("role", 'employee');
  // }


  // return (
  //   <div className='time-sheet-box'>
  //     <TimeSheet />
  //     <TimeSheetEntry />

  //   </div>
  // );

  const columns = useMemo(
    //column definitions...
    () => [
      {
        accessorKey: 'projectCode',
        header: 'Project Code',
        size: 130,

      },
      {
        accessorKey: 'jobCode',
        header: 'Job cod',
        size: 130
      },
      {
        accessorKey: 'day1',
        header: 'Day1',
        size:3,
      },
      {
        accessorKey: 'day2',
        header: 'Day2',
        size: 3,
      },
      {
        accessorKey: 'day3',
        header: 'Day3',
        size: 5,
      },
      {
        accessorKey: 'day4',
        header: 'Day4',
        size: 5,
      },
      {
        accessorKey: 'day5',
        header: 'Day5',
        size: 5,
      },
      {
        accessorKey: 'day6',
        header: 'Day6',
        size: 5,
      },
      {
        accessorKey: 'day7',
        header: 'Day7',
        size: 5,
      },
      {
        accessorKey: 'delete',
        header: '',
        size: 2,
      },
      {
        accessorKey: 'total',
        header: 'Total',
        size: 5,
      },
    ],
    [],
    //end
  );

  const totalColumns = useMemo(
    //column definitions...
    () => [
      {
        accessorKey: 'projectCode',
        header: 'Project Code',
        size: 150,

      },
      {
        accessorKey: 'jobCode',
        header: 'Job cod',
        size: 150
      },
      {
        accessorKey: 'day1',
        header: 'Day1',
        size:5,
      },
      {
        accessorKey: 'day2',
        header: 'Day2',
        size: 5,
      },
      {
        accessorKey: 'day3',
        header: 'Day3',
        size: 5,
      },
      {
        accessorKey: 'day4',
        header: 'Day4',
        size: 5,
      },
      {
        accessorKey: 'day5',
        header: 'Day5',
        size: 5,
      },
      {
        accessorKey: 'day6',
        header: 'Day6',
        size: 5,
      },
      {
        accessorKey: 'day7',
        header: 'Day7',
        size: 5,
      },
      {
        accessorKey: 'delete',
        header: '',
        size: 2,
      },
      {
        accessorKey: 'total',
        header: 'Total',
        size: 5,
      },
    ],
    [],
    //end
  );

  const footerData = [{
    addRow: <>{role !== 'manager' && <button type="button" onClick={() => addRow()} className='timesheet-button' aria-label="Add Row Button" style={{ width: '180px', textAlign: 'center' }}>Add Row</button>}</>
  }];

  const footerColumns = useMemo(
    //column definitions...
    () => [
      {
        accessorKey: 'addRow',
        header: 'Add Row',
        size: 50,

      },
    ],
    [],
    //end
  );

  return (
    <>
      <div className='time-sheet-box'>
        {/* <TimeSheet />
        <TimeSheetEntry /> */}

        <MaterialReactTable
          columns={headerColumns}
          data={headerData}
          enableTableHead={false}
          enableColumnActions={false}
          enableColumnFilters={false}
          enablePagination={false}
          enableSorting={false}
          enableBottomToolbar={false}
          enableTopToolbar={false}
          muiTableBodyRowProps={{ hover: false }}
          muiTableProps={{
            sx: {
              border: '1px solid rgba(81, 81, 81, 1)',
              padding:'2px',
              width:'95%',
              margin: 'auto'
            },
          }}
          muiTableHeadCellProps={{
            sx: {
              border: '1px solid rgba(81, 81, 81, 1)',
              width:'50%'
            },
          }}
          muiTableBodyCellProps={{
            sx: {
              border: '1px solid rgba(81, 81, 81, 1)',
              padding:'2px'
            },
          }}
        />

        {data && data.length > 0 && <MaterialReactTable
          columns={columns}
          data={data}
          enableColumnActions={false}
          enableColumnFilters={false}
          enablePagination={false}
          enableSorting={false}
          enableBottomToolbar={false}
          enableTopToolbar={false}
          muiTableBodyRowProps={{ hover: false }}
          muiTableProps={{
            sx: {
              border: '1px solid rgba(81, 81, 81, 1)',
              padding:'2px',
              width:'95%',
              margin: 'auto'
            },
          }}
          muiTableHeadCellProps={{
            sx: {
              border: '1px solid rgba(81, 81, 81, 1)',
              width:'50%'
            },
          }}
          muiTableBodyCellProps={{
            sx: {
              border: '1px solid rgba(81, 81, 81, 1)',
              padding:'2px'
            },
          }}
        />}

        {role !== 'manager' && <MaterialReactTable
          columns={footerColumns}
          data={footerData}
          enableTableHead={false}
          enableColumnActions={false}
          enableColumnFilters={false}
          enablePagination={false}
          enableSorting={false}
          enableBottomToolbar={false}
          enableTopToolbar={false}
          muiTableBodyRowProps={{ hover: false }}
          muiTableProps={{
            sx: {
              border: '1px solid rgba(81, 81, 81, 1)',
              padding:'2px',
              width:'95%',
              margin: 'auto'
            },
          }}
          muiTableHeadCellProps={{
            sx: {
              border: '1px solid rgba(81, 81, 81, 1)',
              width:'50%'
            },
          }}
          muiTableBodyCellProps={{
            sx: {
              border: '1px solid rgba(81, 81, 81, 1)',
              padding:'2px'
            },
          }}
        />}

        <MaterialReactTable
        enableTableHead={false}
          columns={totalColumns}
          data={totalData}
          enableColumnActions={false}
          enableColumnFilters={false}
          enablePagination={false}
          enableSorting={false}
          enableBottomToolbar={false}
          enableTopToolbar={false}
          muiTableBodyRowProps={{ hover: false }}
          muiTableProps={{
            sx: {
              border: '1px solid rgba(81, 81, 81, 1)',
              padding:'2px',
              width:'95%',
              margin: 'auto'
            },
          }}
          muiTableHeadCellProps={{
            sx: {
              border: '1px solid rgba(81, 81, 81, 1)',
              width:'50%'
            },
          }}
          muiTableBodyCellProps={{
            sx: {
              border: '1px solid rgba(81, 81, 81, 1)',
              padding:'2px'
            },
          }}
        />
      </div>

    </>
  );
}



