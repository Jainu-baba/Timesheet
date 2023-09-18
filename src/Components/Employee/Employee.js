import React from 'react'
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import axios from 'axios';
import { useEffect } from 'react';

import { useState } from 'react';

import TimeSheetEntry from './TimeSheetEntry';
function Item(props) {
  const { sx, ...other } = props;
  return (
    <Box
    role="item"
    aria-label="Item"
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

export default function Employee(props) {
  const [empDetails,setempDetails] = useState('');
  console.log('name',props);
  if(window.location.href.split("/").includes("employee")) {
    localStorage.setItem("role", 'employee');
  }
  useEffect(()=>{
    console.log('location',window.location.pathname);
    console.log('search',window.location.search);
    if(window.location.pathname.includes('/details')){
      let name=window.location.pathname.split('/')[2];
      console.log('name',name);
     let id=window.location.pathname.split('/')[3];
     console.log('id',id);

     axios.get('http://localhost:3001/getdata')
     .then((response) => {
       console.log(response.data);
       let filteredArray = response.data.filter(e => e.id == Number(id));
       setempDetails(filteredArray[0])
       })
       .catch((error) => {
          console.log(error)
       })

    //   axios.get(`http://localhost:3001/getEmpDetails?id=${id}`)
    //  .then((response) => {
    //    console.log(response.data)
    //    setempDetails(response.data)
    //    })
    //    .catch((error) => {
    //       console.log(error)
    //    })

    }
    
  },[])

  return (
    <div className='time-sheet-box'>
      {/* <TimeSheet /> */}
      <TimeSheetEntry empDetails={empDetails} name={window.location.pathname.split('/')[2]} tabIndex={0} aria-label="Time Sheet Entry"/>
      
    </div>
  );
}