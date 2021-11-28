/* eslint-disable */

import React from 'react';
import Box from '@mui/material/Box';
import { makeStyles } from "@mui/styles";
import Tooltip from '@mui/material/Tooltip';
import DownloadIcon from '@mui/icons-material/Download';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DatabaseService from "../service/DatabaseService";
import { awardee } from "../models/applicant";


const useStyles = makeStyles((theme) => ({
    root: {
    //   width: '100vh',
      display: 'flex',
      justifyContent: 'center',
      width: '80%',
      alignSelf: 'center',
    },
    datagrid: {
      width: '80%',
      height: '380px',
    },
    text: {
      color: '#FFFFFF',
      fontSize: '1.2rem',
    },
    button: {
      width: 'fit-content',
      marginTop: '10px !important',
      marginBottom: '10px !important',
    },
    icon: {
        alignSelf: 'flex-start',
    },
}));

function Row(props: { row: ReturnType<any> }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        
        <TableCell component="th" scope="row">
          {row.student_number}
        </TableCell>
        <TableCell align="right">{`$${row.bill}`}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Information
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                      
                    <TableCell>Full Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row.student_number}>
                    <TableCell align="left">{row.first_name + ' ' + row.last_name}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (props:any) => {
  const classes = useStyles();
  const [awardees, setAwardees] = React.useState<awardee[]>([]);


  React.useEffect(() => {
    DatabaseService.getAwardees().then(awardees => {
      setAwardees(awardees);
    });
  }, []);

  function OBJtoXML(obj: any, addApplicant: boolean) {
    var xml = '';
    for (var prop in obj) {
      if (addApplicant) { xml += '<awardee>';}
      xml += obj[prop] instanceof Array ? '' : "<" + prop + ">";
      if (obj[prop] instanceof Array) {
        for (var array in obj[prop]) {
          xml += "<" + prop + ">";
          xml += OBJtoXML(new Object(obj[prop][array]), false);
          xml += "</" + prop + ">";
        }
      } else if (typeof obj[prop] == "object") {
        xml += OBJtoXML(new Object(obj[prop]), false);
      } else {
        xml += obj[prop];
      }
      xml += obj[prop] instanceof Array ? '' : "</" + prop + ">";
      if (addApplicant) { xml += "</awardee>"; }
    }
    var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
    if (addApplicant) {
      return '<?xml version="1.0" encoding="UTF-8"><awardees>' + xml + '</awardees>';
    }
    else {
      return xml;
    }
    
  }

  const downloadXML = () => {
    const file = new Blob([OBJtoXML(JSON.parse(JSON.stringify(awardees)), true)], { type: 'text/xml' });
    const url = window.URL.createObjectURL(file);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'awardees.xml');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }




  return (
    <Box mb={2} mt={2} display="flex" flexDirection="column" className={classes.root}>
      <Typography className={classes.text}>Current Awardees</Typography>
      <Tooltip title="Download awardees' data as an XML file">
        <IconButton className={classes.icon} onClick={downloadXML}>
          <DownloadIcon color="secondary"/>
        </IconButton>
      </Tooltip>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Student ID</TableCell>
              <TableCell align="right">Awarded Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {awardees.map((awardee) => (
              <Row key={awardee.student_number} row={awardee} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}