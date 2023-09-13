import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginAsDoctor from "../LoginSetup/LoginAsDoctor";
import RegisterAsDoctor from "../LoginSetup/RegisterAsDoctor";
import "./homepage.css"
import RegisterAsPatient from "../LoginSetup/RegisterAsPatient";
import LoginAsPatient from "../LoginSetup/LoginAsPatient";
import React, { useContext, useEffect, useState } from 'react';
import LandingPage from "../LandingPage/LandingPage";
import Contact from "../contact/Contact";
import DoctorDashboard from "../LandingPage/DoctorSide/DoctorDashboard/DoctorDashboard";
import PatientLandingPage from "../LandingPage/PatientSide/PatientLandingPage/PatientLandingPage";
import Chatting from "../LandingPage/ChattingPage/Chatting";
import { AuthContext } from "../context/AuthContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import DoctorChattingPage from "../LandingPage/DoctorChattingPage/DoctorChattingPage";
const HomePage = () => {
    const { currentUser } = useContext(AuthContext);
    const [patients, setPatients] = useState([]);


    const ProtectedRoute = ({ children }) => {
        if (!currentUser) {
            return <Navigate to="/login" />
        }
        return children
    }



    useEffect(() => {
        const getAllData = () => {
            const unSub = onSnapshot(collection(db, "DoctorPatientChats"), (querySnapshot) => {
                const allData = [];
                querySnapshot.forEach((doc) => {
                    if (doc.exists()) {
                        allData.push(doc.data());
                    }
                });
                setPatients(allData);
            });

            return () => {
                unSub();
            };
        };

        getAllData();
    }, []);


    const [doctorType,setDoctorType] = useState("")
    const [comboId,setcomboId] = useState("")
  console.log(doctorType)
    return (
        <div className="HomePage">
            <BrowserRouter>
                <Routes>
                    <Route >
                        <Route path="/" element={<LandingPage />} />
                        <Route path="login" element={<LoginAsDoctor />} />
                        <Route path="register" element={<RegisterAsDoctor />} />
                        <Route path="RegisterPatient" element={<RegisterAsPatient />} />
                        <Route path="loginPatient" element={<LoginAsPatient />} />
                        <Route path="contact" element={<Contact />} />
                        <Route path={`${currentUser?.uid}`} element={<ProtectedRoute><DoctorDashboard setcomboId={setcomboId}  /></ProtectedRoute>} />
                        <Route path="patientlandingpage" element={<ProtectedRoute><PatientLandingPage setDoctorType={setDoctorType} /></ProtectedRoute>} />
                        <Route path={`patientlandingpage/chat/${doctorType}`} element={<Chatting  />} />
                        <Route path={`${currentUser?.uid}/chat/${comboId}`} element={<DoctorChattingPage comboId={comboId} />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}
export default HomePage;