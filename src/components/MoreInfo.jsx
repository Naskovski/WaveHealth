import React, { useEffect, useState, useContext } from 'react';
import '../components.css';
import {userDocRef} from "../firebase";
import {onSnapshot, updateDoc} from "firebase/firestore";
import {DataContext} from "../DataContext";
import showOverlay from "../functions/showOverlay";
import logo from '../img/heart white.svg';

async function updateFirebase(name, height, weight, unit, birthdate, gender){
    let dbDoc = {
        name: name,
        height: height,
        weight: weight,
        unit: unit,
        DOB: birthdate,
        gender: gender
    }

    await updateDoc(userDocRef, dbDoc);
}

export default function MoreInfo(){
    const [display, setDisplay] = useState('landing');

    const {name, setName} = useContext(DataContext);
    const {height, setHeight} = useContext(DataContext);
    const {weight, setWeight} = useContext(DataContext);
    const {unit, setUnit} = useContext(DataContext);
    const {gender, setGender} = useContext(DataContext);
    const {birthdate, setBirthdate} = useContext(DataContext);
    const {edit, setEdit} = useContext(DataContext);
    const [newHeight, setNewHeight] = useState('');
    const [newWeight, setNewWeight] = useState('');

    let fetchData = onSnapshot(userDocRef, (doc) => {
        if (doc.get('name') !== undefined && edit===false) {
            setName( doc.get('name'));
            setBirthdate( doc.get('DOB'));
            setGender( doc.get('gender'));
        }
    });

    function changeGender(txt){
        setGender(txt);
        setDisplay('goodbye');
    }
    function changeUnit(txt){
        setEdit(true);
        setUnit(txt);
        setDisplay('hw');
    }
    function confirmHW(){
        setHeight(Number(newHeight));
        setWeight(Number(newWeight));
        setDisplay('DOB');
    }

    function closePopUp(){
        updateFirebase(name, height, weight, unit, birthdate, gender);
        showOverlay('MoreInfo');
        fetchData();
        setEdit(false);
    }

    useEffect(() => {
        return () =>{
            fetchData();
        };
    });

    return (
        <div id={'MoreInfo'} className={'hidden'}>
            <div className={'blur fullscreen'} id={'blurlayer'}/>
            <div className={'card squareEXTRA center'}>

                {display==='landing' && <div className={'flex_col'}>
                    <img src={logo} alt={'small logo'}/>
                    <h1>We need more info about you</h1>
                    <p>That way we can give you a more tailored experience using our app</p>
                    <button onClick={() => setDisplay('unit')}>Continue</button>
                </div>}

                {display==='unit' && <div className={'flex_col'}>
                    I prefer to use:
                    <button onClick={() => changeUnit('Metric')}>Metric</button>
                    <button onClick={() => changeUnit('Imperial')}>Imperial</button>
                    <p className={'bottomCenter'}><b>.</b> . . .</p>
                </div>}

                {display==='hw' && <div className={'flex_col'}>
                    <label className={'flex_row'}>
                        My height is:
                            <input
                                style={{maxWidth: '3rem'}}
                                type={"number"}
                                value={newHeight}
                                onChange={(e) => setNewHeight(Number(e.target.value))}/>
                            {unit==='Metric'?
                                (Number(newHeight)<10?<span>m</span>:<span>cm</span>)
                                :(Number(newHeight)<10?<span>feet</span>:<span>inches</span>)}
                    </label>

                    <label className={'flex_row'}>
                        My weight is:
                        <input
                            style={{maxWidth: '3rem'}}
                            type={"number"}
                            value={newWeight}
                            onChange={(e) => setNewWeight(Number(e.target.value))}/>
                        {unit==='Metric'?<span>kg</span>:<span>lbs</span>}
                    </label>
                    <button onClick={confirmHW}>Next</button>
                    <p className={'bottomCenter'}><b>.</b> <b>.</b> . .</p>
                </div>}

                {display==='DOB' && <div className={'flex_col'}>
                    <label className={'flex_row'}>
                        I was born on:
                        <input
                            style={{maxWidth: '55%'}}
                            type={'date'}
                            value={birthdate}
                            onChange={(e) => setBirthdate(e.target.value)}/>
                    </label>
                    <button onClick={() => setDisplay('gender')}>Next</button>
                    <p className={'bottomCenter'}><b>.</b> <b>.</b> <b>.</b> .</p>
                </div>}

                {display==='gender' && <div className={'flex_col'}>
                    I am a:

                        <button onClick={() => changeGender('Male')}>Male</button>
                        <button onClick={() => changeGender('Female')}>Female</button>
                        <button onClick={() => changeGender('None')}>Prefer not to say</button>
                    <p className={'bottomCenter'}><b>.</b> <b>.</b> <b>.</b> <b>.</b></p>
                </div>}

                {display==='goodbye' && <div className={'flex_col'}>
                    <img src={logo} alt={'big logo'}/>
                    <h1>Thank you for choosing WaveHealth</h1>


                    <button onClick={closePopUp}>Close</button>
                </div>}

            </div>
        </div>
    )

}