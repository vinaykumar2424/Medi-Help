// import "./AllLogin.css"
import classes from './AllLogin.module.css';
import doctorImg from "../images/PatientImg.png"
import loader from "../images/loader.gif"

import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from 'firebase/firestore';
const LoginAsPatient = () => {

    const navigate = useNavigate()
    const [err, setErr] = useState(false)
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault()  // stop refreshing the page
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            setIsLoading(true);

            const userDoc = await getDoc(doc(db, "Patients", user.uid));
            if (userDoc.exists()) {
                navigate("/patientlandingpage");
                setIsLoading(false);
            }
            else {
                console.log(err)
            }
        } catch (err) {
            console.log(err)
            setErr(true)
        }
    }

    return (
        <>
            {isLoading ? (
                <img className='loader' src={loader} alt='' />
            ) : (
                <div className={classes.RegisterAsDoctor}>
                    <div className={classes.Homebtn} >
                        <Link to="/"><span className="material-symbols-outlined">arrow_circle_left</span></Link>
                        Home
                    </div>
                    <div className={classes.ImgAndSomeText}>
                        <img className={classes.DemoDoctorImg} src={doctorImg} alt="" />
                        <div className={classes.DemoDoctoText}>
                            <p>Welcome To Medi-Help</p>
                            <p>Need Help ?</p>
                            <p>Fill Up few Details</p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <p>
                            <span className="material-symbols-outlined" style={{ marginRight: "10px" }}>vital_signs</span>
                            Welcome Back!
                            <span className="material-symbols-outlined" style={{ marginLeft: "10px" }}>vital_signs</span>
                        </p>
                        <div className={classes.inputBox}>
                            <input type="email" required="required" />
                            <span>Email</span>
                        </div>
                        <div className={classes.inputBox}>
                            <input type="text" required="required" />
                            <span>Password</span>
                        </div>
                        <button>Click here to Login</button>
                        <span className={classes.routeTo}>
                            Need a new Acoount ?
                            <Link to="/RegisterPatient"><span>Create new</span></Link>
                        </span>
                        <div className={classes.RouteToPatientForm}>
                            <Link to="/login"><span className="material-symbols-outlined">arrow_circle_left</span></Link>
                            Are you a Doctor ?
                        </div>
                    </form>
                </div>
            )}
        </>
    )
}
export default LoginAsPatient;