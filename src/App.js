import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import theme, { primaryColor } from "./theme";
import { makeStyles } from '@mui/styles';
import ApplyPage from "./pages/ApplyPage";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: primaryColor,
    minHeight: '100vh',
  },
}));

function App() {

  const classes = useStyles();


  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <Router>
          <Routes>
            <Route path="/admin" element={<div>Admin page</div>}>
            </Route>
            <Route exact={true} path="/apply" element={<ApplyPage />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
