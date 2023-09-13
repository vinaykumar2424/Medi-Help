import './DoctorChattingPage.css'
import loader from "../../images/loader.gif"
import { v4 as uuid } from "uuid";
import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Timestamp, arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
const DoctorChattingPage = ({ comboId }) => {

    const [image, setImage] = useState(null)
    const [text, setText] = useState("")
    const { currentUser } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);

    const data = comboId;
    // console.log(data)



    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);
    //////////////////////////////

    const handleSend = async () => {
        if (image) {
            console.log(image)
            const storageRef = ref(storage, uuid());

            const uploadTask = uploadBytesResumable(storageRef, image);

            uploadTask.on(
                // "state_changed",
                (error) => {

                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateDoc(doc(db, "DoctorPatientChats", data), {
                            messages: arrayUnion({
                                id: uuid(),
                                text,
                                senderId: currentUser.uid,
                                date: Timestamp.now(),
                                image: downloadURL,
                            }),
                        });
                    });
                }
            );
        } else {
            await updateDoc(doc(db, "DoctorPatientChats", data), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                }),
            });
        }
        document.getElementsByClassName("type-something")[0].value = "";
        setText("");
        setImage(null);
    };



    const handleKey = async (e) => {
        await e.code === "Enter" && handleSend();
    };



    const [messages, setMessages] = useState([])
    useEffect(() => {
        const getmsg = () => {
            const unSub = onSnapshot(doc(db, "DoctorPatientChats", data), (doc) => {
                if (doc.exists()) {
                    setIsLoading(false)
                    setMessages(doc.data().messages);
                }
            });

            return () => {
                unSub();
            };
        }
        data && getmsg();
    }, [data]);

    const chatWindowRef = useRef();
    const btnToBottomRef = useRef();
    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages])

    const handleToBottom = () => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }

    return (
        <>
            {isLoading ? (
                <img className='loader' src={loader} alt='' />
            ) : (
                <div className="DoctorChattingPage">
                    <div className="chattingWindow" ref={chatWindowRef}>
                        {messages?.map((message) => (
                            <div className={`${currentUser.uid == message.senderId ? 'chatMessages' : "chatMessagesElse"}`} key={message.id}>
                                <div className={`${currentUser.uid == message.senderId ? "roleHeading" : "roleHeadingElse"}`}>{`${currentUser.uid == message.senderId ? 'You' : 'Patient'}`}</div>
                                <div className="chatmsgValue">
                                    <div>{message.text}</div>
                                    {message.image && <img src={message.image ? message.image : loader} alt='' className={`${message.image ? "imageMessage" : "loderImg"}`} />}
                                </div>
                                <div className='chatmsgTime'>
                                    {message.date ? (
                                        (() => {
                                            const date = new Date(
                                                (message.date.seconds * 1000) + Math.floor(message.date.nanoseconds / 1000000)
                                            );
                                            const hours = date.getHours();
                                            const minutes = date.getMinutes();
                                            return `${hours}:${minutes}`;
                                        })()
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <span className="material-symbols-outlined btnToBottom" ref={btnToBottomRef} onClick={handleToBottom} >arrow_downward</span>
                    <div className="MessageTypingBox">
                        <input
                            type="file"
                            style={{ display: "none" }}
                            id="file" alt="image"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                        <label htmlFor="file">
                            <span className="material-symbols-outlined">image</span>
                        </label>
                        <input
                            type="text"
                            className="type-something"
                            placeholder="Ask here!"
                            value={text} onKeyDown={handleKey}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <span className="material-symbols-outlined" onClick={handleSend}>Send</span>
                    </div>
                </div>
            )}
        </>
    )
}

export default DoctorChattingPage;