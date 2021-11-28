import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import Box from "@mui/material/Box";
import theme, { primaryColor, secondaryColor } from "./theme";
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import ApplyPage from "./pages/ApplyPage";
import AdminPage from "./pages/AdminPage";
import AwardeesPage from "./pages/AwardeesPage";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: primaryColor,
    minHeight: '100vh',
    alignSelf: 'center',
  },
  header: {
    textAlign: 'center',
    justifyContent: 'center',
    display: 'flex',
    width: '100%',
    backgroundColor: secondaryColor,
    alignSelf: 'center',
    position: 'absolute',
    top: 0,
  },
  footer: {
    textAlign: 'center',
    fontSize: '1rem',
    justifyContent: 'center',
    width: '100%',
    display: 'flex',
    alignSelf: 'center',
    backgroundColor: secondaryColor,
    position: 'absolute',
    bottom: 0,
  },
  text: {
    fontSize: '2rem',
    color: primaryColor,
  }
}));

function App() {

  const classes = useStyles();


  return (
    <ThemeProvider theme={theme}>
      <Box className={classes.root} pr={3} pl={3}>
        <Box className={classes.header} pt={3} pb={3}>
        <Typography className={classes.text}>B.S.T Scholarship Award system</Typography>
        </Box>
        <Router>
          <Routes>
            <Route path="/admin/applicants" element={<AdminPage />}>
            </Route>
            <Route exact={true} path="/apply" element={<ApplyPage />} />
            <Route exact={true} path="/admin/awardees" element={<AwardeesPage />} />
          </Routes>
        </Router>
        <Box className={classes.footer} pt={2} pb={2}>
          <a href="https://google.com">Help</a>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
