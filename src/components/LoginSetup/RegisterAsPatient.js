// import "./AllLogin.css"
import classes from './AllLogin.module.css';

import doctorImg from "../images/PatientImg.png"
import loader from "../images/loader.gif"

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase"
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
const RegisterAsPatient = () => {

    const navigate = useNavigate()
    const [err, setErr] = useState(false)
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault()  // stop refreshing the page
        // console.log(e.target[0].value)
        let displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password)
            const user = res.user;
            // console.log(res.user)
            setIsLoading(true);
            await setDoc(doc(db, "Patients", user.uid), {
                uid: user.uid,
                displayName,
                email
            });
            setIsLoading(false);
            navigate("/patientlandingpage")
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
                            Welcome Here!
                            <span className="material-symbols-outlined" style={{ marginLeft: "10px" }}>vital_signs</span>
                        </p>
                        <div className={classes.inputBox}>
                            <input type="text" required="required" />
                            <span>Name</span>
                        </div>
                        <div className={classes.inputBox}>
                            <input type="email" required="required" />
                            <span>Email</span>
                        </div>
                        <div className={classes.inputBox}>
                            <input type="text" required="required" />
                            <span>Password</span>
                        </div>
                        <button>Click here to Submit</button>
                        <span className={classes.routeTo}>
                            Already have an Acoount ?
                            <Link to="/loginPatient"><span>Login</span></Link>
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
export default RegisterAsPatient;