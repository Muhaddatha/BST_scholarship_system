import * as React from 'react';
import Box from '@mui/material/Box';
import { makeStyles } from "@mui/styles";
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
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
import { applicant, status, gender } from "../models/applicant";
import { Timestamp } from "@firebase/firestore";




function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
  price: number,
) {
    return {
        name,
        calories,
        fat,
        carbs,
        protein,
        price,
        history: [
            {
            date: '2020-01-05',
            customerId: '11091700',
            amount: 3,
            },
            {
            date: '2020-01-02',
            customerId: 'Anonymous',
            amount: 1,
            },
        ],
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100vh',
        display: 'flex',
        justifyContent: 'center',
    },
    datagrid: {
        width: '80%',
        height: '380px',
    },
}));

function Row(props: { row: ReturnType<any> }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  const today = new Date();
  let age = today.getFullYear() - row.date_of_birth.toDate().getFullYear();
  var month = today.getMonth() - row.date_of_birth.toDate().getMonth();
  if (month < 0 || (month === 0 && today.getDate() < row.date_of_birth.toDate().getDate())) {
    age--;
  }

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
        <TableCell align="right">{row.first_name + ' ' + row.last_name}</TableCell>
        <TableCell align="right">{row.cumulative_gpa}</TableCell>
        <TableCell align="right">{row.number_of_credit_hours}</TableCell>
        <TableCell align="right">{age}</TableCell>
        <TableCell align="right">{row.cumulative_gpa >= 3.2 && row.number_of_credit_hours >= 12 && age <= 23 ? 'Eligible' : 'Not Eligible'}</TableCell>
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
                    <TableCell>Email Address</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Phone Number</TableCell>
                    <TableCell align="right">Gender</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row.email_address}>
                    <TableCell component="th" scope="row">
                      {row.email_address}
                    </TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell align="right">{row.phone_number}</TableCell>
                    <TableCell align="right">{row.gender}</TableCell>
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

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 3.99),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
  createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
  createData('Cupcake', 305, 3.7, 67, 4.3, 2.5),
  createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
];

// eslint-disable-next-line import/no-anonymous-default-export
export default (props:any) => {
  const classes = useStyles();
  const [applicants, setApplicants] = React.useState<applicant[]>([]);

  React.useEffect(() => {
    DatabaseService.getApplicants().then(applicants => {
      setApplicants(applicants);
    })
  }, []);


  return (
    <Box mb={2} mt={2}>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Student ID</TableCell>
              <TableCell align="right">Full Name</TableCell>
              <TableCell align="right">GPA</TableCell>
              <TableCell align="right">Credit hours</TableCell>
              <TableCell align="right">Age</TableCell>
              <TableCell align="right">Eligibility</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applicants.map((applicant) => (
              <Row key={applicant.student_number} row={applicant} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </Box>
  );
}