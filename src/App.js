import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { db } from "./firebase/firebase.config";
import { collection, getDocs } from "firebase/firestore";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import theme from "./theme";
import { makeStyles } from '@mui/styles';
import ApplyPage from "./pages/ApplyPage";


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

function App() {

  const classes = useStyles();

  const [applicants, setApplicants] = useState([]);
  const applicantsCollectionRef = collection(db, "applicants");

  useEffect(() => {
    const getApplicants = async () => {
      const data = await getDocs(applicantsCollectionRef);
      setApplicants(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }

    getApplicants();
    console.log('applicants', applicants);
  }, []);


  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <ApplyPage />
        {/* <Router>
          <Routes>
            <Route path="/">
              <div></div>
            </Route>
            <Route exact={true} path="/apply" element={<ApplyPage />}>
              <ApplyPage />
            </Route>
          </Routes>
        </Router> */}
      </div>
    </ThemeProvider>
  );
}

export default App;
