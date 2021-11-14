import { useState, useEffect } from "react";
import { db } from "./firebase/firebase.config";
import { collection, getDocs } from "firebase/firestore";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import theme from "./theme";
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles((theme) => ({
  root: {
  },
}));

function App() {

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
      <div className="App">
      
      </div>
    </ThemeProvider>
  );
}

export default App;
