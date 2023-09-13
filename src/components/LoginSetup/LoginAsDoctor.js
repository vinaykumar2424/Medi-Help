// import "./AllLogin.css"
import doctorImg from "../images/doctorImg.png"
import classes from './AllLogin.module.css';
import loader from "../images/loader.gif"

import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
const LoginAsDoctor = () => {

    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false);

    const [err, setErr] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault()  // stop refreshing the page
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userDoc = await getDoc(doc(db, "Doctors", user.uid));
            if (userDoc.exists()) {
                setIsLoading(true);
                navigate(`/${user.uid}`);
            }
            else {
                console.log(err)
                setIsLoading(true);
            }
        } catch (err) {
            console.log(err)
            setErr(true)
        }
        setIsLoading(false);
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
                            <p>Welcome Doctor</p>
                            <p>Help People</p>
                            <p>Those need your help</p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <p>
                            <span className="material-symbols-outlined" style={{ marginRight: "10px" }}>vital_signs</span>
                            Welcome Back Doctor!
                            <span className="material-symbols-outlined" style={{ marginLeft: "10px" }}>vital_signs</span>
                        </p>
                        <div className={classes.inputBox}>
                            <input type="email" required="required" />
                            <span>Email Id</span>
                        </div>
                        <div className={classes.inputBox}>
                            <input type="text" required="required" />
                            <span>Password</span>
                        </div>
                        <button>Doctor! Welcome Back</button>
                        <span className={classes.routeTo}>
                            Need a new Acoount ?
                            <Link to="/register"><span>Create new</span></Link>
                        </span>
                        <div className={classes.RouteToPatientForm}>
                            <Link to="/LoginPatient"><span className="material-symbols-outlined">arrow_circle_left</span></Link>
                            Are you a Patient ?
                        </div>
                    </form>
                </div>
            )}
        </>
    )
}
export default LoginAsDoctor;