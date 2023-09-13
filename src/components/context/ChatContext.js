// import { onAuthStateChanged } from "firebase/auth";
// import { createContext, useContext, useEffect, useReducer, useState } from "react";
// import { auth } from "../firebase";
// import { AuthContext } from "./AuthContext";
// export const ChatContext = createContext();

// export const ChatContextProvider = ({ children }) => {
//     const { currentUser } = useContext(AuthContext);
//     const INITIAL_STATE = {
//         chatID: "",
//         user: {}
//     }

//     const chatReducer = (state, action) => {
//         console.log("currentUser:", currentUser);
//         console.log("action.payload:", action.payload);
//         switch (action.type) {
//             case "CHANGE_USER":
//                 return {
//                     user: action.payload,
//                     chatId: currentUser.uid > action.payload.uid ? currentUser.uid + action.payload.uid : action.payload.uid + currentUser.uid
//                 };
//             default:
//                 return state;
//         }
//     };

//     const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
//     // console.log(state)

//     return (
//         <ChatContext.Provider value={{ data: state, dispatch }}>
//             {children}
//         </ChatContext.Provider>
//     )
// }

import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { auth } from "../firebase";
import { AuthContext } from "./AuthContext";
import { onAuthStateChanged } from "firebase/auth";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
    const INITIAL_STATE = {
        chatID: "",
        user: {}
    };
    const chatReducer = (state, action) => {
        // console.log(action)
        const localState = localStorage.getItem("state")
        switch (action.type) {
            case "CHANGE_USER":
                const otherUserId = action.payload.uid;
                const chatId = currentUser.uid !== otherUserId
                    ? otherUserId + currentUser.uid
                    : false;
                console.log(chatId)
                return {
                    user: action.payload != {} ? action.payload : localState.user,
                    chatId: chatId!="" ? chatId : localState.chatId
                };
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
    if(state.chatId !=""){
        localStorage.setItem("state",state)
    }
    console.log(state)
    // Listen for authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            // Dispatch an action to update user data when authentication state changes
            if (user) {
                dispatch({ type: "CHANGE_USER", payload: user });
                console.log(user.uid)
            }
        });

        // Cleanup the listener when the component unmounts
        return () => unsubscribe();
    }, []);


    console.log(state)
    return (
        <ChatContext.Provider value={{ data: state, dispatch }}>
            {children}
        </ChatContext.Provider>
    );
};
