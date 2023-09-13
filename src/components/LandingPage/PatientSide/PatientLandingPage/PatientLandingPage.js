import './PatientLandingPage.css'
import { AuthContext } from '../../../context/AuthContext'
import { ChatContext } from '../../../context/ChatContext'
import { auth, db } from '../../../firebase'
import loader from '../../../images/loader.gif'
import { signOut } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
const PatientLandingPage = ({ setDoctorType }) => {
    const [doctorData, setDoctorData] = useState([]);
    const [selectedTypeOfDoctor, setSelectedTypeOfDoctor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null)
    const { currentUser } = useContext(AuthContext);
    const [oldMessages, setOldMessages] = useState()
    const [userName, setUserName] = useState("")
    const navigate = useNavigate();
    const { dispatch } = useContext(ChatContext);

    const [combinedId, setCombinedId] = useState("")

    const handleShowWindow = (typeOfDoctor) => {
        setSelectedTypeOfDoctor(typeOfDoctor);
        const window = document.getElementsByClassName("listOfDoctors")
        window[0].classList.toggle("listOfDoctorsDisplayShow")
    }

    const handleSelect = async (user) => {
        const combinedId = currentUser.uid != user.uid ? user.uid + currentUser.uid : false;
        localStorage.setItem(`${currentUser.uid}CombinedId`, combinedId)
        setCombinedId(combinedId)
        try {
            setDoctorType(combinedId)
            const chatDocRef = doc(db, "DoctorPatientChats", combinedId);
            const chatDocSnap = await getDoc(chatDocRef);

            if (!chatDocSnap.exists()) {
                // Create a chat in chats collection
                await setDoc(chatDocRef, { messages: [] });

                // Create user chats
                const currentUserCombinationRef = doc(db, "DoctorPatientCombinations", user.uid);
                const userCombinationData = {
                    [combinedId]: {
                        DoctorInfo: {
                            uid: user.uid,
                            doctorName: user.doctorName,
                            doctorImage: user.doctorImage,
                        },
                        date: serverTimestamp(),
                    }
                };
                await setDoc(currentUserCombinationRef, userCombinationData);
                const otherUserCombinationRef = doc(db, "DoctorPatientCombinations", currentUser.uid);
                const otherUserCombinationData = {
                    [combinedId]: {
                        PatientInfo: {
                            uid: currentUser.uid,
                            PatientName: currentUser.displayName,
                        },
                        date: serverTimestamp(),
                    }
                };
                // console.log("current" + currentUser.uid)
                // console.log("user" + user.uid)
                await setDoc(otherUserCombinationRef, otherUserCombinationData);
                console.log("Chat and user combinations created successfully.");
                // Dispatch an action to update the context
                // console.log(user.uid)
                dispatch({ type: "CHANGE_USER", payload: user });
            }
            else {
                const combinedId = localStorage.getItem(`${currentUser.uid}CombinedId`)
                const chatDocRef = doc(db, "DoctorPatientChats", combinedId);

                const chatData = chatDocSnap.data();
                const currentMessages = chatData?.messages || [];
                console.log(chatData.messages)

                // const updatedMessages = [currentMessages];

                // Update the chat document with the updated messages
                await updateDoc(chatDocRef, { messages: currentMessages });
                // Dispatch an action to update the context
                // console.log(user.uid)
                dispatch({ type: "CHANGE_USER", payload: user });
            }
        }
        catch (err) {
            console.error("Error in handleSelect:", err);
        }
        navigate(`/patientlandingpage/chat/${combinedId}`);
    }

    useEffect(() => {
        axios.get('http://localhost:5000/api/collections')
            .then(response => {
                setDoctorData(response.data);
                setIsLoading(false);
                console.log(response.data)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                // console.log(error)
            });
    }, []);
    console.log(doctorData)



    return (
        <div className="PatientLandingPage">
            <div className='LogOutBtn'>
                <span className="material-symbols-outlined" onClick={() => {
                    signOut(auth).then(() => {
                        navigate("/LoginPatient", { replace: true })
                    })
                }}>logout</span>
                <span>Logout</span>
                <span className="material-symbols-outlined leftBottomSymbol">south_west</span>
            </div>
            <div className='heading1'>
                <span className="material-symbols-outlined" style={{ marginRight: "10px" }}>vital_signs</span>
                Select the Category of Doctor You Need
                <span className="material-symbols-outlined" style={{ marginLeft: "10px" }}>vital_signs</span>
            </div>
            <div className='DoctorLists'>
                <div className="TypeOfDoctor FamilyMedicine" onClick={() => handleShowWindow("FamilyMedicine")}>Family Medicine</div>
                <div className="TypeOfDoctor InternalMedicine" onClick={() => handleShowWindow("InternalMedicine")}>Internal Medicine</div>
                <div className="TypeOfDoctor Pediatrician" onClick={() => handleShowWindow("Pediatrician")}>Pediatrician</div>
                <div className="TypeOfDoctor gynecologist" onClick={() => handleShowWindow("gynecologist")}>gynecologist</div>
                <div className="TypeOfDoctor Cardiologist" onClick={() => handleShowWindow("Cardiologist")}>Cardiologist</div>
                <div className="TypeOfDoctor Oncologist" onClick={() => handleShowWindow("Oncologist")}>Oncologist</div>
                <div className="TypeOfDoctor Gastroenterologist" onClick={() => handleShowWindow("Gastroenterologist")}>Gastroenterologist</div>
                <div className="TypeOfDoctor Pulmonologist" onClick={() => handleShowWindow("Pulmonologist")}>Pulmonologist</div>
                <div className="TypeOfDoctor InfectiousDisease" onClick={() => handleShowWindow("InfectiousDisease")}>Infectious Disease</div>
                <div className="TypeOfDoctor Nephrologist" onClick={() => handleShowWindow("Nephrologist")}>Nephrologist</div>
                <div className="TypeOfDoctor Endocrinologist" onClick={() => handleShowWindow("Endocrinologist")}>Endocrinologist</div>
                <div className="TypeOfDoctor Ophthalmologist" onClick={() => handleShowWindow("Ophthalmologist")}>Ophthalmologist</div>
                <div className="TypeOfDoctor Otolaryngologist" onClick={() => handleShowWindow("Otolaryngologist")}>Otolaryngologist</div>
                <div className="TypeOfDoctor Dermatologist" onClick={() => handleShowWindow("Dermatologist")}>Dermatologist</div>
                <div className="TypeOfDoctor Psychiatrist" onClick={() => handleShowWindow("Psychiatrist")}>Psychiatrist</div>
                <div className="TypeOfDoctor Neurologist" onClick={() => handleShowWindow("Neurologist")}>Neurologist</div>
                <div className="TypeOfDoctor Radiologist" onClick={() => handleShowWindow("Radiologist")}>Radiologist</div>
                <div className="TypeOfDoctor Anesthesiologist" onClick={() => handleShowWindow("Anesthesiologist")}>Anesthesiologist</div>
                <div className="TypeOfDoctor Surgeon" onClick={() => handleShowWindow("Surgeon")}>Surgeon</div>
                <div className="TypeOfDoctor PhysicianExecutive" onClick={() => handleShowWindow("PhysicianExecutive")}>Physician executive</div>
            </div>
            <div className='listOfDoctors'>
                <span className="material-symbols-outlined closeBtn" onClick={() => handleShowWindow("")}>close</span>
                <div className='doctorsHeading'>Doctors</div>
                {isLoading ? (
                    <img className='loader' src={loader} alt='' />
                ) :
                    <div className='AllDoctor' >
                        {Object.values(doctorData)?.map((data, index) => (
                            data[0]?.content[0]?.doctorSpecility === selectedTypeOfDoctor &&
                            <Link key={index} ><div onClick={() => handleSelect(data[0]?.content[0])} className='DoctorOption' >
                                <img className='imgOfDoctor' src={data[0]?.content[0]?.doctorImage} alt='' />
                                <span>
                                    <span className="material-symbols-outlined ">star_rate</span>
                                    <span className="material-symbols-outlined ">star_rate</span>
                                    <span className="material-symbols-outlined ">star_rate</span>
                                    <span className="material-symbols-outlined ">star_rate</span>
                                    <span className="material-symbols-outlined ">star_rate_half</span>
                                </span>
                                <span>
                                    <div className='DoctorOptionName'>{data[0]?.content[0]?.doctorName}</div>
                                    <div className='DoctorOptionOtherDetails'>
                                        <div>{data[0]?.content[0]?.doctorSpecility}</div>
                                        <div><span>{data[0]?.content[0]?.YearsExperience}</span><span> years</span></div>
                                    </div>
                                </span>
                            </div>
                            </Link>
                        ))
                        }
                    </div>
                }
            </div>
        </div >
    )
}

export default PatientLandingPage;