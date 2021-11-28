/* eslint-disable */

import * as React from "react";
import { makeStyles } from "@mui/styles";
import Box from "@mui/material/Box";
import { backgroundNormal } from "../theme";
import { Button, CircularProgress, MenuItem, Select, TextField, Typography } from "@mui/material";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { applicant, status, gender } from "../models/applicant";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import DatabaseService from "../service/DatabaseService";
import { Timestamp } from "@firebase/firestore";

const useStyles = makeStyles((theme) => ({
    root: {
        overflow: 'scrollbar',
        height: '100%',
        width: '80%',
        alignSelf: 'center',
    },
    restOfForm: {
        '& .MuiTextField-root': {
            width: '80%',
            marginTop: '20px',
        },
        '& .form-group': {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            '& .MuiFormHelperText-root': {
                width: '80%',
                alignSelf: 'center',
            },
        },
        '& .MuiFormControl-root': {
            width: '80%',
            alignSelf: 'center',
        },
        '& .MuiSelect-root': {
            marginTop: '20px',
        },
    },
    thankYouBox: {
        height: 'fit-content',
        alignSelf: 'center',
        '& .MuiTypography-root': {
            color: '#FFFFFF',
        },
    },
}));

let applicant_id: string;

// eslint-disable-next-line import/no-anonymous-default-export
export default (props: any) => {
    const classes = useStyles();
    const [studentNumber, setStudentNumber] = React.useState<number>(0);
    const [queryingDatabase, setQueryingDatabase] = React.useState(false);
    const [firstTimeLoad, setFirstTimeLoad] = React.useState(false);
    const [formSubmitted, setFormSubmitted] = React.useState(false);

    React.useEffect(() => {
        setFirstTimeLoad(false);
    }, []);

    const [applicationForm, setApplicationForm] = React.useState<applicant>({
        student_number: 0,
        first_name: '',
        last_name: '',
        phone_number: '',
        email_address: '',
        gender: gender.male,
        date_of_birth: Timestamp.now(),
        status: status.freshman,
        cumulative_gpa: 0.00,
        number_of_credit_hours: 0,
        eligible: '',
    });

    const KEYS = {
        STUDENT_NUMBER: "student_number",
        FIRST_NAME: "first_name",
        LAST_NAME: "last_name",
        PHONE_NUMBER: "phone_number",
        EMAIL_ADDRESS: "email_address",
        GENDER: "gender",
        DATE_OF_BIRTH: "date_of_birth",
        STATUS: "status",
        CUMULATIVE_GPA: "cumulative_gpa",
        NUMBER_OF_CREDIT_HOURS: "number_of_credit_hours",
    }

    const [error, setError] = React.useState({
        student_number: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        email_address: '',
        gender: '',
        date_of_birth: '',
        status: '',
        cumulative_gpa: '',
        number_of_credit_hours: '',
    });

    const containsAlphabet = (str: string) => {
        return /[a-zA-Z]/.test(str);
    }

    const queryDatabase = () => {
        setQueryingDatabase(true);
        // check if student exists in database
        DatabaseService.getApplicant(studentNumber).then((applicantList) => {
            if (applicantList.length > 0) {
                applicant_id = applicantList[0].id;
                delete applicantList[0].id;
                setApplicationForm(applicantList[0]);
                console.log('applicant from backend', applicantList[0]);
            }
            else {
                console.log('no applicant matches this student number');
            }
            console.log('form', applicationForm);
            setQueryingDatabase(false);
            setFirstTimeLoad(true);
        }).catch((e) => {
            console.error('error getting student by student number', e);
            setQueryingDatabase(false);
            setFirstTimeLoad(true);
        });
    }

    const handleFormValueChange = (value: any, key: string) => {

        switch (key) {
            case KEYS.STUDENT_NUMBER:
                setStudentNumber(parseInt(value, 10));
                setApplicationForm({ ...applicationForm, [key]: parseInt(value, 10) });
                break;
            case KEYS.FIRST_NAME:
                if (error.first_name.length > 0) {
                    setError({ ...error, first_name: '' });
                }
                setApplicationForm({ ...applicationForm, [key]: value });
                break;
            case KEYS.LAST_NAME:
                if (error.last_name.length > 0) {
                    setError({ ...error, last_name: '' });
                }
                setApplicationForm({...applicationForm, [key]: value });
                break;
            case KEYS.PHONE_NUMBER:
                if (error.phone_number.length > 0) {
                    setError({ ...error, phone_number: '' });
                }
                if (containsAlphabet(value)) {
                    setError({ ...error, phone_number: 'Please enter a valid phone number' });
                }
                setApplicationForm({...applicationForm, [key]: value });
                break;
            case KEYS.EMAIL_ADDRESS:
                if (error.email_address.length > 0) {
                    setError({ ...error, email_address: '' });
                }
                setApplicationForm({...applicationForm, [key]: value });
                break;
            case KEYS.GENDER:
                setApplicationForm({...applicationForm, [key]: value });
                break;
            case KEYS.DATE_OF_BIRTH:
                setApplicationForm({...applicationForm, [key]: Timestamp.fromDate(value) });
                break;
            case KEYS.STATUS:
                setApplicationForm({...applicationForm, [key]: value });
                break;
            case KEYS.CUMULATIVE_GPA:
                if (error.cumulative_gpa.length > 0) {
                    setError({ ...error, cumulative_gpa: '' });
                }
                if (containsAlphabet(value)) {
                    setError({ ...error, cumulative_gpa: 'Please enter a valid GPA value' });
                }
                setApplicationForm({...applicationForm, [key]: value });
                break;
            case KEYS.NUMBER_OF_CREDIT_HOURS:
                setApplicationForm({...applicationForm, [key]: value });
                break;
        }
    }

    const submitApplication = () => {
        console.log('form values', applicationForm);
        if (applicationForm.first_name.length <= 0) {
            setError({ ...error, first_name: 'Please enter a first name' });
            return;
        }
        if (applicationForm.last_name.length <= 0) {
            setError({ ...error, last_name: 'Please enter a last name' });
            return;
        }
        if (applicationForm.phone_number.length <= 0) {
            setError({ ...error, last_name: 'Please enter a phone number' });
            return;
        }
        if (!(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(applicationForm.phone_number))) {
            setError({ ...error, phone_number: 'Please enter a valid phone number' });
            return;
        }
        if (applicationForm.email_address.length <= 0) {
            setError({ ...error, email_address: 'Please enter an email address'});
            return;
        }
        if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(applicationForm.email_address))) {
            setError({ ...error, email_address: 'Please enter a valid email address' });
            return;
        }
        if (!applicationForm.cumulative_gpa) {
            setError({ ...error, cumulative_gpa: 'Please enter a GPA value' });
            return;
        }
        if (applicationForm.cumulative_gpa && (applicationForm.cumulative_gpa < 0.00 || applicationForm.cumulative_gpa >= 4.00)) {
            setError({ ...error, cumulative_gpa: 'Please enter a GPA value between 0.00 and 4.00 '});
            return;
        }

        setFormSubmitted(true);

        // no errors encountered
        console.log('errors', error);
        if (Object.values(error).every(error_field => error_field === '')) {
            if (applicant_id) {
                DatabaseService.updateApplicant(applicant_id, applicationForm).then(() => {
                    console.log('Applicant information updated successfully');
                    console.log('error2', error);
                }).catch((e) => {
                    console.error("Error updating user in databse", e);
                });
            }
            else {
                DatabaseService.addApplicant(applicationForm).then((new_applicant) => {
                    console.log('newly created applicant', new_applicant);
                    console.log('error3', error);
                }).catch((e) => {
                    console.error("Error addindg a new user to database", e);
                });
            }
        }
    }

    return(
        <>{!formSubmitted ? <Box className={classes.root} mt={3} mb={3} display="flex" flexDirection="column" width="70%" bgcolor={backgroundNormal}>
            <Box width="100%" display="flex" mt={2} mb={1} justifyContent="space-around" alignItems="center">
                <Box className="form-group">
                    <TextField label="Student Number" variant="outlined" onChange={(e) => handleFormValueChange(e.target.value, KEYS.STUDENT_NUMBER)} disabled={queryingDatabase} inputProps={{ type: 'number', min: 0, step: 1 }}/>
                    <FormHelperText error={Boolean(error.student_number)}>{error.student_number}</FormHelperText>
                </Box>
                <Button variant="contained" onClick={queryDatabase} disabled={queryingDatabase}>Ok</Button>
            </Box>
            {
                queryingDatabase ? <CircularProgress color="secondary" sx={{ alignSelf: 'center', marginTop: '10px', marginBottom: '10px' }}/> : firstTimeLoad ?
                <Box className={classes.restOfForm} mt={2} mb={2} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                    <Box className="form-group">
                        <TextField label="First Name" variant="outlined" value={applicationForm.first_name} error={Boolean(error.first_name)} onChange={(e) => handleFormValueChange(e.target.value, KEYS.FIRST_NAME)} />
                        <FormHelperText error={Boolean(error.first_name)}>{error.first_name}</FormHelperText>
                    </Box>
                    <Box className="form-group">
                        <TextField label="Last Name" variant="outlined" value={applicationForm.last_name} error={Boolean(error.last_name)}onChange={(e) => handleFormValueChange(e.target.value, KEYS.LAST_NAME)} />
                        <FormHelperText error={Boolean(error.last_name)}>{error.last_name}</FormHelperText>
                    </Box>
                    <Box className="form-group">
                        <TextField label="Phone Number" variant="outlined" value={applicationForm.phone_number} error={Boolean(error.phone_number)} onChange={(e) => handleFormValueChange(e.target.value, KEYS.PHONE_NUMBER)} />
                        <FormHelperText error={Boolean(error.phone_number)}>{error.phone_number}</FormHelperText>
                    </Box>
                    <Box className="form-group">
                        <TextField label="Email Address" variant="outlined" value={applicationForm.email_address} error={Boolean(error.email_address)} onChange={(e) => handleFormValueChange(e.target.value, KEYS.EMAIL_ADDRESS)} />
                        <FormHelperText error={Boolean(error.email_address)}>{error.email_address}</FormHelperText>
                    </Box>
                    <FormControl variant="outlined" fullWidth={true} error={Boolean(error.gender)}>
                        <Select
                          label="Gender"
                          value={applicationForm.gender}
                          onChange={(e) => handleFormValueChange(e.target.value, KEYS.GENDER)}
                        >
                            <MenuItem value={gender.male}>Male</MenuItem>
                            <MenuItem value={gender.female}>Female</MenuItem>
                        </Select>
                        <FormHelperText>{error.gender}</FormHelperText>
                    </FormControl>
                    <FormControl variant="outlined" fullWidth={true} error={Boolean(error.date_of_birth)}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                              label="Date of Birth"
                              inputFormat="MM/dd/yyyy"
                              value={applicationForm.date_of_birth === undefined ? Date.now() : applicationForm.date_of_birth.toDate()}
                              onChange={(e) => handleFormValueChange(e, KEYS.DATE_OF_BIRTH)}
                              renderInput={(params) => <TextField variant="outlined" {...params} />}
                            />
                        </LocalizationProvider>
                        <FormHelperText>{error.date_of_birth}</FormHelperText>
                    </FormControl>
                    <FormControl variant="outlined" fullWidth={true} error={Boolean(error.status)}>
                        <Select
                          label="Status"
                          value={applicationForm.status}
                          onChange={(e) => handleFormValueChange(e.target.value, KEYS.STATUS)}
                        >
                            <MenuItem value={status.freshman}>Freshman</MenuItem>
                            <MenuItem value={status.sophomore}>Sophomore</MenuItem>
                            <MenuItem value={status.junior}>Junior</MenuItem>
                            <MenuItem value={status.senior}>Senior</MenuItem>
                        </Select>
                        <FormHelperText>{error.status}</FormHelperText>
                    </FormControl>

                    <FormControl variant="outlined" fullWidth={true} error={Boolean(error.date_of_birth)}></FormControl>
                    <Box className="form-group">
                        <TextField label="Cumulative GPA" error={Boolean(error.cumulative_gpa)} value={applicationForm.cumulative_gpa} variant="outlined" onChange={(e) => handleFormValueChange(e.target.value, KEYS.CUMULATIVE_GPA)} inputProps={{ type: 'number', min: 0.00, max: 4.00, step: 0.01 }} />
                        <FormHelperText error={Boolean(error.cumulative_gpa)}>{error.cumulative_gpa}</FormHelperText>
                    </Box>
                    <Box className="form-group">
                        <TextField label="Number of Credit Hours" error={Boolean(error.number_of_credit_hours)} value={applicationForm.number_of_credit_hours} variant="outlined" type="number" onChange={(e) => handleFormValueChange(e.target.value, KEYS.NUMBER_OF_CREDIT_HOURS)} inputProps={{ type: 'number', min: 0.00 }}/>
                        <FormHelperText error={Boolean(error.number_of_credit_hours)}>{error.number_of_credit_hours}</FormHelperText>
                    </Box>
                    <Box width="100%" display="flex" justifyContent="center" mb={1} mt={1}>
                        <Button variant="contained" color="secondary" onClick={submitApplication}>Submit</Button>
                    </Box>
                </Box>

            : null }
        </Box>
        :
        <Box className={classes.thankYouBox}>
            <Typography align="center" variant="h5">
                Thank you for submitting your application to the B.S.T scholarship system!
            </Typography>
        </Box>
        }</>
    )
}


