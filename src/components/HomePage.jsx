import React, { useEffect, useContext } from 'react';
import '../components.css';
import {auth, userDocRef} from "../firebase";
import { Navigate } from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";
import Dashboard from "./Dashboard";
import HeadBar from "./Header";
import Profile from "./Profile";
import MoreInfo from "./MoreInfo";
import {onSnapshot} from "firebase/firestore";
import showOverlay from "../functions/showOverlay";
import Settings from "./Settings";
import ChangePassword from "./ChangePassword";
import {DataContext} from "../DataContext";

function HomePage(){
    const [user] = useAuthState(auth);
    const {name, setName} = useContext(DataContext);
    const {height, setHeight} = useContext(DataContext);
    const {weight, setWeight} = useContext(DataContext);
    const {unit, setUnit} = useContext(DataContext);
    const {gender, setGender} = useContext(DataContext);
    const {birthdate, setBirthdate} = useContext(DataContext);
    const {edit, setEdit} = useContext(DataContext);

    const unsub = onSnapshot(userDocRef, (doc) => {
        if (doc.get('name') === undefined ||
            doc.get('height') === undefined ||
            doc.get('weight') === undefined ||
            doc.get('unit') === undefined ||
            doc.get('DOB') === undefined ||
            doc.get('gender') === undefined) {
                showOverlay('MoreInfo', 'show');
                console.log('Data is missing');
        }else{
            showOverlay('MoreInfo', 'hide');
            if(edit!==true){
                setName(doc.get('name'));
                setHeight(doc.get('height'));
                setWeight(doc.get('weight'));
                setUnit(doc.get('unit'));
                setBirthdate(doc.get('DOB'));
                setGender(doc.get('gender'));
            }
        }
    });

    useEffect(()=>{
        return () =>{
            unsub();
        };
    });

     return (
        <div className={'container'}>
            {!user && <Navigate to={'/login'}/>}
            {user && <div id={'home'}>
                <ChangePassword/>
                <MoreInfo/>
                <HeadBar />
                <div className={'flex_col'} id={'dashWrapper'}>
                    <Dashboard/>
                </div>
                <Profile/>
                <Settings/>
            </div>}
        </div>
    );
}

export default HomePage;