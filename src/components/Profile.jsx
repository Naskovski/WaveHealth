import React, { useEffect, useContext } from 'react';
import '../components.css';
import {auth, userDocRef} from "../firebase";
import {updateDoc} from "firebase/firestore";
import {DataContext} from "../DataContext";
import editDark from "../ico/edit_dark.svg";
import editLight from "../ico/edit_light.svg";
import showOverlay from "../functions/showOverlay";
import CloseBt from "../ico/close_dark.svg";
import CloseBtDark from "../ico/close_light.svg";

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

export default function Profile(){
    const {name, setName} = useContext(DataContext);
    const {height, setHeight} = useContext(DataContext);
    const {weight, setWeight} = useContext(DataContext);
    const {unit, setUnit} = useContext(DataContext);
    const {gender, setGender} = useContext(DataContext);
    const {birthdate, setBirthdate} = useContext(DataContext);
    const {edit, setEdit} = useContext(DataContext);

    const DOB = new Date(birthdate);

    const active = {
        opacity: 1,
        background: "var(--accent-color)",
        borderRadius: 0
    }
    const notActive = {
        opacity: 0.7,
        background: "var(--accent-lighter)",
        borderRadius: 0
    }
    let MgenderStyle, FgenderStyle, NgenderStyle;

    if(gender==='Male'){
        MgenderStyle=active;
        FgenderStyle=notActive;
        NgenderStyle=notActive;
    }else if(gender==='Female'){
        MgenderStyle=notActive;
        FgenderStyle=active;
        NgenderStyle=notActive;
    }else{
        MgenderStyle=notActive;
        FgenderStyle=notActive;
        NgenderStyle=active;
    }

    function openInput(elementId){
        showOverlay(elementId);
        setEdit(true);
        document.getElementById(elementId+'Field').focus();
    }

    function closeInput(elementId){
        setEdit(false);
        updateFirebase(name, height, weight, unit, birthdate, gender);
        showOverlay(elementId, 'hide');
    }

    useEffect(() => {
        showOverlay('ChangePassword', 'hide');
        showOverlay('nameInput', 'hide');
        showOverlay('heightInput', 'hide');
        showOverlay('genderInput', 'hide');
        showOverlay('birthdateInput', 'hide');
        showOverlay('weightInput', 'hide');
    },[]);// no double clicks

    function handleKeyUp(event, elementId){
        if (event.key === 'Enter') {
            closeInput(elementId);
        }
    }

    return (
          <div id={'Profile'} style={{position: "absolute"}}>
              <div className={'blur fullscreen'} id={'blurlayer'} onClick={() => showOverlay('Profile')}/>
              <div className={'bigCard center'}>
                  <button id={'CornerButton'} onClick={() => showOverlay('Profile')}>
                      <img src={CloseBt} className={'light'} alt={'...'} />
                      <img src={CloseBtDark} className={'dark'} alt={'...'} />
                  </button>
                  <h1>Profile</h1>
                  <div id={'data'} style={{width: '90%'}}>
                      <div>
                          <button className={'smallBt editBt'} onClick={() => openInput('nameInput')}>
                              <img src={editLight} alt={'edit'} className={'light'} />
                              <img src={editDark} alt={'edit'} className={'dark'}/>
                          </button>
                          Name: {name}
                          <span id={'nameInput'} className={'hidden flex_row'}>
                            <input
                                id={'nameInputField'}
                                style={{maxWidth: '55%'}}
                                type={'text'}
                                value={name}
                                onKeyUp={(e)=>handleKeyUp(e, 'nameInput')}
                                onChange={(e) => setName(e.target.value)}/>
                            <button onClick={() => closeInput('nameInput')}>OK</button>
                        </span>
                      </div>

                      <div>
                          <button className={'smallBt editBt'} onClick={() => openInput('heightInput')}>
                              <img src={editLight} alt={'edit'} className={'light'} />
                              <img src={editDark} alt={'edit'} className={'dark'}/>
                          </button>
                          Height: {height} {unit==='Metric'?
                          (Number(height)<10?<span>m</span>:<span>cm</span>)
                          :(Number(height)<10?<span>feet</span>:<span>inches</span>)}
                          <span id={'heightInput'} className={'hidden flex_row'}>
                            <input
                                id={'heightInputField'}
                                style={{maxWidth: '3rem'}}
                                type={"number"}
                                value={height}
                                onKeyUp={(e)=>handleKeyUp(e, 'heightInput')}
                                onChange={(e) => setHeight(e.target.value)}/>
                              {unit==='Metric'?
                                  (Number(height)<10?<span>m</span>:<span>cm</span>)
                                  :(Number(height)<10?<span>feet</span>:<span>inches</span>)}
                              <button onClick={() => closeInput('heightInput')}>OK</button>
                        </span>
                      </div>

                      <div>
                          <button className={'smallBt editBt'} onClick={() => openInput('weightInput')}>
                              <img src={editLight} alt={'edit'} className={'light'} />
                              <img src={editDark} alt={'edit'} className={'dark'}/>
                          </button>
                          Weight: {weight} {unit==='Metric'?<span>kg</span>:<span>lbs</span>}
                          <span id={'weightInput'} className={'hidden flex_row'}>
                            <input
                                id={'weightInputField'}
                                style={{maxWidth: '3rem'}}
                                type={"number"}
                                value={weight}
                                onKeyUp={(e)=>handleKeyUp(e, 'weightInput')}
                                onChange={(e) => setWeight(e.target.value)}/>
                              {unit==='Metric'?<span>kg</span>:<span>lbs</span>}
                              <button onClick={() => closeInput('weightInput')}>OK</button>
                        </span>
                      </div>

                      <div>
                          <button className={'smallBt editBt'} onClick={() => openInput('birthdateInput')}>
                              <img src={editLight} alt={'edit'} className={'light'} />
                              <img src={editDark} alt={'edit'} className={'dark'}/>
                          </button>
                          Date of Birth:<br/> {DOB.toDateString()}
                          <span id={'birthdateInput'} className={'hidden flex_row'}>
                            <input
                                id={'birthdateInputField'}
                                style={{maxWidth: '55%'}}
                                type={'date'}
                                value={birthdate}
                                onKeyUp={(e)=>handleKeyUp(e, 'birthdateInput')}
                                onChange={(e) => setBirthdate(e.target.value)}/>
                            <button onClick={() => closeInput('birthdateInput')}>OK</button>
                        </span>
                      </div>

                      <div>
                          <button className={'smallBt editBt'} onClick={() => openInput('genderInput')}>
                              <img src={editLight} alt={'edit'} className={'light'} />
                              <img src={editDark} alt={'edit'} className={'dark'}/>
                          </button>
                          Gender: {gender}
                          <span id={'genderInput'} className={'hidden flex_col'} style={{width: '100%',}}>
                            <div className={'flex_row'} style={{borderRadius: '0.5rem', margin: '0.5rem', justifyContent: 'center', overflow: 'hidden'}}>
                                <button style={MgenderStyle} onClick={() => setGender('Male')}>Male</button>
                                <button style={FgenderStyle} onClick={() => setGender('Female')}>Female</button>
                                <button style={NgenderStyle} onClick={() => setGender('None')}>None</button>
                            </div>

                            <button onClick={() => closeInput('genderInput')}>OK</button>
                        </span>
                      </div>

                      <div>Email: {auth.currentUser!==null && auth.currentUser.email}</div>

                  </div>
                  {(auth.currentUser!==null && auth.currentUser.providerData[0].providerId==='password') &&
                      <button onClick={() => showOverlay('ChangePassword')}>Change password</button>}

              </div>
          </div>
    )

}