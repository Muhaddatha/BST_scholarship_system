import * as React from 'react';
import Box from '@mui/material/Box';
import { makeStyles } from "@mui/styles";
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
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
import { getAge } from "../utils/getAge";

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

function Row(props: { row: ReturnType<any>, displayEligibility: boolean}) {
  const { row, displayEligibility } = props;
  const [open, setOpen] = React.useState(false);

  let age = getAge(row.date_of_birth.toDate());

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
        { displayEligibility ? <TableCell align="right">{row.cumulative_gpa >= 3.2 && row.number_of_credit_hours >= 12 && age <= 23 ? 'Eligible' : 'Not Eligible'}</TableCell> : null}
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

// eslint-disable-next-line import/no-anonymous-default-export
export default (props:any) => {
  const classes = useStyles();
  const [applicants, setApplicants] = React.useState<applicant[]>([]);
  const [determiningWinner, setDeterminingWinner] = React.useState(false);
  const [scholarshipWinners, setScholarshipWinners] = React.useState<applicant[]>([]);
  const [updatingAwardeeDatastore, setUpdatingAwardeeDatastore] = React.useState(false);
  const [updateStarted, setUpdateStarted] = React.useState(false);

  React.useEffect(() => {
    DatabaseService.getApplicants().then(applicants => {
      setApplicants(applicants);
    })
  }, []);

  const saveWinningApplicantInDataBase = () => {
    // call backend function
    console.log("inside save winning applicant to database function");
    setUpdateStarted(true);
    console.log('scholarship winners', scholarshipWinners);
  }

  const getWinner = () => {
    setDeterminingWinner(true);
    setUpdatingAwardeeDatastore(true);
    console.log('inside get winner');

    // filter out ineligible applicants
    const eligible_applicants = applicants.filter((applicant) => applicant.cumulative_gpa >= 3.2 && applicant.number_of_credit_hours >= 12 && getAge(applicant.date_of_birth.toDate()) <= 23);


    if (eligible_applicants.length > 0) {
      let applicants_copy = eligible_applicants;
      applicants_copy.sort((a, b) => {
        return b.cumulative_gpa - a.cumulative_gpa;
      });
      let highest_gpa = applicants_copy[0].cumulative_gpa;
      let highest_gpa_applicants = new Array(0);
      applicants_copy.forEach(applicant => {
        if (applicant.cumulative_gpa === highest_gpa) {
          highest_gpa_applicants.push(applicant);
        }
      })
      console.log('highest_gpa_applicants', highest_gpa_applicants);

      if (highest_gpa_applicants.length > 1) {
        let juniors = new Array(0);
        highest_gpa_applicants.forEach(applicant => {
          if (applicant.status === status.junior) {
            juniors.push(applicant);
          }
        })

        if (juniors.length > 2 || juniors.length === 0) {
          let female_students = new Array(0);
          highest_gpa_applicants.forEach(applicant => {
            if(applicant.gender === gender.female) {
              female_students.push(applicant);
            }
          })

          if (female_students.length > 2 || female_students.length === 0) {
            let youngest_applicants = new Array(0);
            highest_gpa_applicants.sort((a, b) => {
              const ageA = getAge(a.date_of_birth.toDate());
              const ageB = getAge(b.date_of_birth.toDate());
              return ageB - ageA;
            });

            let youngest_age = highest_gpa_applicants[0];

            highest_gpa_applicants.forEach(applicant => {
              if (getAge(applicant.date_of_birth.toDate()) === youngest_age) {
                youngest_applicants.push(applicant);
              }
            })

            if (youngest_applicants.length === 1) {
              // youngest applicant is the winner
              setScholarshipWinners(youngest_applicants);
            }
            else {
              // more than 2 youngest, need vote
              setScholarshipWinners(youngest_applicants);
            }
          }
          else {
            // the winner is the female student
            setScholarshipWinners(female_students);
          }
        }
        else {
          // the winner is the junior
          setScholarshipWinners(juniors);
        }
      }
      else {
        // winner is the only one in array
        setScholarshipWinners(highest_gpa_applicants);
      }
    }
    else {
      // there are no eligible applicants
    }

    setDeterminingWinner(false);
    console.log('scholarshipwinners', scholarshipWinners);
  }


  return (
    <Box mb={2} mt={2} display="flex" flexDirection="column">
      <Typography>Current applicants</Typography>
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
              <Row key={applicant.student_number} row={applicant} displayEligibility={true} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {determiningWinner ? null : <Button color="secondary" onClick={getWinner}>Determine Scholarship Winner</Button>}
      {
        determiningWinner ? <CircularProgress color="secondary" sx={{ alignSelf: 'center', marginTop: '10px', marginBottom: '10px' }}/>:
        <Box>
          {
            scholarshipWinners.length === 0 ? 
            <Typography>
              No Applicants are eligible to win the scholarship.
            </Typography> : 
            <>
              <Box>
                Scholarship winner:
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell />
                        <TableCell align="right">ID</TableCell>
                        <TableCell align="right">Full Name</TableCell>
                        <TableCell align="right">GPA</TableCell>
                        <TableCell align="right">Credit Hours</TableCell>
                        <TableCell align="right">Age</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        scholarshipWinners.map((winner) => {
                          return <Row key={winner.student_number} row={winner} displayEligibility={false} />
                        })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
                <Button onClick={saveWinningApplicantInDataBase} color="primary">Save scholarship winner</Button>
              </Box>
              {
                scholarshipWinners.length > 1 ? <Typography>The are more than two scholarship winners. Committee voting is neededd</Typography> : null
              }
              {
                updatingAwardeeDatastore ? <CircularProgress color="secondary" sx={{ alignSelf: 'center', marginTop: '10px', marginBottom: '10px' }}/> :
                updateStarted ? <Typography>Awardee data store updated!</Typography> : null
              }
            </>
          }
        </Box>
      }
    </Box>
  );
}