import * as React from "react";
import { makeStyles } from "@mui/styles";
import Box from "@mui/material/Box";
import { backgroundNormal } from "../theme";
import { Button, CircularProgress, TextField } from "@mui/material";

const useStyles = makeStyles((theme) => ({
    root: {
        overflow: 'scrollbar',
    },
    restOfForm: {
        '& .MuiTextField-root': {
            width: '80%',
            marginTop: '20px',
        },
    },
}));


export default (props: any) => {
    const classes = useStyles();
    const [value, setValue] = React.useState(new Date());
    const [queryingDatabase, setQueryingDatabase] = React.useState(false);

    const queryDatabase = () => {
        setQueryingDatabase(true);
        // check if student exists in database
    }

    const handleFormValueChange = (event: any) => {

    }
    return(
        <Box className={classes.root} mt={3} mb={3} display="flex" flexDirection="column" width="70%" bgcolor={backgroundNormal}>
            <Box width="100%" display="flex" mt={2} justifyContent="space-around" alignItems="center">
                <TextField label="Student Number" variant="outlined" onChange={handleFormValueChange} disabled={queryingDatabase}/>
                <Button variant="contained" onClick={queryDatabase} disabled={queryingDatabase}>Ok</Button>
            </Box>
            {
                queryingDatabase ? <CircularProgress color="secondary" sx={{ alignSelf: 'center', marginTop: '10px', marginBottom: '10px' }}/> :
                <Box className={classes.restOfForm} mt={2} mb={2} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                    <TextField label="First Name" variant="outlined" onChange={handleFormValueChange} />
                    <TextField label="Last Name" variant="outlined" onChange={handleFormValueChange} />
                    <TextField label="Phone Number" variant="outlined" onChange={handleFormValueChange} />
                    <TextField label="Email Address" variant="outlined" onChange={handleFormValueChange} />
                    <TextField label="Gender" variant="outlined" onChange={handleFormValueChange} />
                    <TextField label="Date of birth" variant="outlined" onChange={handleFormValueChange} />
                    <TextField label="Status" variant="outlined" onChange={handleFormValueChange} />
                    <TextField label="Cumulative GPA" variant="outlined" onChange={handleFormValueChange} />
                    <TextField label="Number of Credit Hours" variant="outlined" onChange={handleFormValueChange} />
                </Box>
            }
        </Box>
    )
}


