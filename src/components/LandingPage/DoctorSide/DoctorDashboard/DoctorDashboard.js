import './DoctorDashboard.css'
import doctorDP from '../../../images/doctorImg.png'
import loader from "../../../images/loader.gif"
import Chatting from '../../ChattingPage/Chatting'
import { auth, db } from '../../../firebase'
import { signOut } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import axios from 'axios'
import { ChatContext } from '../../../context/ChatContext'
import { collection, doc, getDoc, getDocs, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
const DoctorDashboard = ({ setcomboId }) => {

    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [patients, setPatients] = useState([]);


    const [data, setData] = useState({
        doctorImage: `${doctorDP}`,
        doctorName: "",
        doctorSpecility: "",
        Degree: "",
        YearsExperience: "",
        hospitalName: ""
    })
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "doctorImage") {
            const file = files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                const dataURL = event.target.result;
                setData((prev) => ({
                    ...prev,
                    doctorImage: dataURL
                }));
            };

            reader.readAsDataURL(file);
        }
        if (name === "doctorName") {
            const Value = value;
            setData((prev) => ({
                ...prev,
                doctorName: Value
            }));
        }
        if (name === "doctorSpecility") {
            const Value = value;
            setData((prev) => ({
                ...prev,
                doctorSpecility: Value
            }));
        }
        if (name === "Degree") {
            const Value = value;
            setData((prev) => ({
                ...prev,
                Degree: Value
            }));
        }
        if (name === "YearsExperience") {
            const Value = value;
            setData((prev) => ({
                ...prev,
                YearsExperience: Value
            }));
        }
        if (name === "hospitalName") {
            const Value = value;
            setData((prev) => ({
                ...prev,
                hospitalName: Value
            }));
        }
    }
    // console.log(data)
    // recieving the data
    useEffect(() => {
        const serializedCurrentUser = encodeURIComponent(JSON.stringify(currentUser));

        axios.get('http://localhost:5000/api/data', {
            params: {
                currentUser: serializedCurrentUser // Pass the serialized currentUser as a query parameter
            }
        })
            .then(response => {
                const retrievedData = response?.data[0]?.content[0];
                if (retrievedData) {
                    setData(retrievedData);
                }
                setIsLoading(false);
                // console.log(retrievedData)
            })
            .catch((error) => {
                console.error('Error getting retrieved data', error);
            });
    }, []);
    // console.log(data.doctorImage)
    //SENDING THE DATA TO THE SERVER

    const [submit, setSubmit] = useState(false)
    useEffect(() => {
        if ((data.doctorSpecility != "" || data.doctorName != "" || data.Degree != "" || data.YearsExperience != "" || data.hospitalName != "" || data.doctorImage != "/static/media/doctorImg.86805813fba79ce6ceb0.png")) {
            data.uid = currentUser.uid;
            data.email = currentUser.email;

            axios.post('http://localhost:5000/api/data', { data, currentUser })
                .then((response) => {
                    setTimeout(() => {
                        setSubmit(data)
                        console.log('data saved successfully');
                    }, 1500)
                })
                .catch((error) => {
                    console.error('Error saving data', error);
                });
        }
    }, [data])


    /////////////////////////////////////


    // console.log(patients[1])

    // {Object.entries(patients)?.map((patient,index) => (
    //     console.log(patient)
    // ))}

    const handleSelect = async (index) => {
        const combinedId = currentUser?.reloadUserInfo?.localId + patients[index]?.messages[0]?.senderId;
        setcomboId(combinedId)
        // console.log(combinedId)
        localStorage.setItem(`${currentUser.uid}CombinedId`, combinedId)
        try {
            const chatDocRef = doc(db, "DoctorPatientChats", combinedId);
            const chatDocSnap = await getDoc(chatDocRef);

            if (!chatDocSnap.exists()) {
                // Create a chat in chats collection
                await setDoc(chatDocRef, { messages: [] });

                // Create user chats
                const currentUserCombinationRef = doc(db, "DoctorPatientCombinations", patients[index]?.messages[1]?.senderId);
                const userCombinationData = {
                    [combinedId]: {
                        DoctorInfo: {
                            uid: patients[index]?.messages[1]?.senderId,
                            patientName: "patient",

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
                            doctorName: currentUser.displayName,
                            doctorImage: currentUser.doctorImage,
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
                // dispatch({ type: "CHANGE_USER", payload: user });
            }
            else {
                const combinedId = localStorage.getItem(`${currentUser.uid}CombinedId`)
                const chatDocRef = doc(db, "DoctorPatientChats", combinedId);

                const chatData = chatDocSnap.data();
                const currentMessages = chatData.messages || [];
                // console.log(chatData)

                // const updatedMessages = [...currentMessages, ...messages];

                // Update the chat document with the updated messages
                await updateDoc(chatDocRef, { messages: currentMessages });

            }
        } catch (err) {
            console.error("Error in handleSelect:", err);
        }
        // console.log(combinedId)
        navigate(`/${currentUser.uid}/chat/${combinedId}`);


        // setUser(null);
        // setUserName("");
        console.log("hi");
        // document.getElementsByClassName("chats")[0].classList.remove("chatsDisplay");
    }


    // const Data = useContext(ChatContext);
    const [comboIds, setcomboIds] = useState([])
    useEffect(() => {
        const getCollections = async () => {
            try {
                const collectionsRef = collection(db, 'DoctorPatientChats');
                const collectionsSnapshot = await getDocs(collectionsRef);
                const collectionNames = collectionsSnapshot.docs.map(doc => doc.id);
                // console.log('Collection names:', collectionNames);
                setcomboIds(collectionNames)
            } catch (error) {
                console.error('Error fetching collection names:', error);
            }
        }

        getCollections();
        const getAllData = () => {
            const unSub = onSnapshot(collection(db, "DoctorPatientChats"), (querySnapshot) => {
                const matchedData = [];

                querySnapshot.forEach((doc) => {
                    if (doc.exists()) {
                        const data = doc.data();
                        const matchingComboIds = comboIds.filter(comboId => comboId.includes(currentUser?.uid));

                        if (matchingComboIds.includes(doc.id)) {
                            matchedData.push(data);
                        }
                    }
                });

                setPatients(matchedData);
            });

            return () => {
                unSub();
            };
        };

        getAllData();
    }, [comboIds, currentUser?.uid]);



    const [userPatient, setUserPatient] = useState([]);

    useEffect(() => {
        const getAllPatientData = async () => {
            const querySnapshot = await getDocs(collection(db, "Patients"));
            const patientData = [];

            querySnapshot.forEach((doc) => {
                if (doc.exists()) {
                    patientData.push(doc.data());
                }
            });

            setUserPatient(patientData);
        };

        getAllPatientData();
    }, []);



    return (
        <>
            {isLoading ? (
                <img className='loader' src={loader} alt='' />
            ) : (
                <div className="DoctorDashboard">
                    <div className='LogOutBtn'>
                        <span className="material-symbols-outlined" onClick={() => {
                            signOut(auth).then(() => {
                                navigate("/login")
                            })
                        }}>logout</span>
                        <span>Logout</span>
                        <span className="material-symbols-outlined leftBottomSymbol">south_west</span>
                    </div>
                    <div className='DoctorDashboardTop'>
                        <div className="imageSection" style={{ position: 'relative', filter: 'none' }}>
                            <img id="displayImg" className="doctorDP" src={data.doctorImage} alt="" />
                            <span
                                id="uploadButton"
                                className="material-symbols-outlined uploadButton"
                                onClick={() => {
                                    const input = document.getElementById("imageInput");
                                    input.click(); // Trigger the file input
                                }}
                            >
                                add_a_photo
                            </span>
                            <input
                                type="file"
                                id="imageInput"
                                accept="image/*"
                                style={{ display: 'none' }}
                                name='doctorImage'
                                onChange={(e) => handleChange(e, 0)}
                            />
                        </div>
                        <div className='doctorNameAndSpecility'>
                            <input className='doctorName' type='text' placeholder='Name' name='doctorName' value={data.doctorName} onChange={(e) => handleChange(e, 0)} />
                            <select id="specility" className='doctorSpecility' name='doctorSpecility' value={data.doctorSpecility} onChange={(e) => handleChange(e, 0)}>
                                <option value="None">None</option>
                                <option value="FamilyMedicine">Family Medicine</option>
                                <option value="InternalMedicine">Internal Medicine</option>
                                <option value="Pediatrician">Pediatrician</option>
                                <option value="gynecologist">gynecologist</option>
                                <option value="Cardiologist">Cardiologist</option>
                                <option value="Oncologist">Oncologist</option>
                                <option value="Gastroenterologist">Gastroenterologist</option>
                                <option value="Pulmonologist">Pulmonologist</option>
                                <option value="InfectiousDisease">Infectious Disease</option>
                                <option value="Nephrologist">Nephrologist</option>
                                <option value="Endocrinologist">Endocrinologist</option>
                                <option value="Ophthalmologist">Ophthalmologist</option>
                                <option value="Otolaryngologist">Otolaryngologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="Psychiatrist">Psychiatrist</option>
                                <option value="Neurologist">Neurologist</option>
                                <option value="Radiologist">Radiologist</option>
                                <option value="Anesthesiologist">Anesthesiologist</option>
                                <option value="Surgeon">Surgeon</option>
                                <option value="PhysicianExecutive">Physician executive</option>
                            </select>
                        </div>
                    </div>
                    <div className='DoctorDashboardMiddle1'>
                        <div className='DoctorDashboardMiddle1Rating'>
                            <span>Rating (360)</span>
                            <span>
                                <span className="material-symbols-outlined starRating">star_rate</span>
                                <span className="material-symbols-outlined starRating">star_rate</span>
                                <span className="material-symbols-outlined starRating">star_rate</span>
                                <span className="material-symbols-outlined starRating">star_rate</span>
                                <span className="material-symbols-outlined starRating">star_rate_half</span>
                            </span>
                        </div>
                        <div className='DoctorDashboardMiddle1degreeWithExperience'>
                            <input type='text' placeholder='Degree' name='Degree' value={data.Degree} onChange={(e) => handleChange(e, 0)} />
                            <span>With</span>
                            <input type='number' placeholder='0' name='YearsExperience' value={data.YearsExperience} onChange={(e) => handleChange(e, 0)} />
                            <span>YEARS</span>
                            <span>Experience</span>
                        </div>
                    </div>
                    <div className='DoctorDashboardMiddle2'>
                        <div className='DoctorHospitalName'>
                            <span className="material-symbols-outlined starRating">star</span>
                            <span>Currently Working In</span>
                            <input type='text' placeholder='Hospital Name' name='hospitalName' value={data.hospitalName} onChange={(e) => handleChange(e, 0)} />
                        </div>
                        <div className='DoctorVerifiedSymbol'>
                            <span className="material-symbols-outlined">verified</span>
                            <span>Verified</span>
                        </div>
                    </div>
                    <div className='DoctorDashboardBottom'>
                        {Object.entries(patients)?.map((patient, index) => (
                            <div className='PersonMessageDiv' key={index} onClick={() => { handleSelect(index) }}>
                                <span className='PersonName'>{patient[1].messages[0]?.senderId === userPatient[index]?.uid ? userPatient[index]?.displayName : 'Patient'}</span>
                                <div className='PersonMessage'>
                                    Last Message: {patient[1].messages[patient[1]?.messages?.length - 1]?.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default DoctorDashboard;