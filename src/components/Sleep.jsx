import React, { useEffect, useState, useContext } from 'react';
import '../components.css';
import MoreBt from "../ico/more_horiz.svg";
import MoreBtDark from '../ico/more_horiz_dark.svg';
import CloseBt from "../ico/close_dark.svg";
import CloseBtDark from "../ico/close_light.svg";
import Gradient from "../img/sunrise-gradient-full.png";
import {doc, onSnapshot, setDoc, updateDoc} from "firebase/firestore";
import {userDocRef} from "../firebase";
import {DataContext} from "../DataContext";

function calcTimeAsleep (start, end){
    let startHr = Number(start.substring(0, 2));
    let endHr = Number(end.substring(0, 2));
    let startMin = Number(start.substring(3));
    let endMin = Number(end.substring(3));
    let totalHr, totalMin;

    if(startHr>18){
        totalHr = 24 - startHr + endHr;
    }else{
        totalHr = endHr-startHr;
    }

    if(startMin>endMin){
        totalHr--;
        totalMin = 60 - startMin + endMin;
    }else{
        totalMin = endMin-startMin;
    }

    if(totalMin>=25){
        totalHr+=0.5;
    }

    if(totalMin>=50){
        totalHr+=0.5;
    }
    if(totalHr<0){
        totalHr=24+totalHr;
    }

    return totalHr;
}

export default function Sleep(){
    const {activityDate, setActivityDate} = useContext(DataContext);
    const [start, setStart] = useState('00:00');
    const [end, setEnd] = useState('00:00');
    const [flag, setFlag] = useState('sleep');

    let today = new Date();
    let todayDocRef = doc(userDocRef, 'Sleep', activityDate.toDateString());

    async function updateFirebase(){
        let dbDoc = {
            start: start,
            end: end,
            flag: 'sleep'
        }

        await setDoc(todayDocRef, dbDoc);
        await updateDoc(userDocRef, {});
    }

    function submit (){
        setFlag('sleep');
        updateFirebase();
    }

    let unsubscribe = onSnapshot(todayDocRef, (doc) => {
        if (doc.get('flag') !== undefined && flag!=='change') {
            setStart( doc.get('start'));
            setEnd( doc.get('end'));
            setFlag( doc.get('flag'));
        }else{
            if(doc.get('flag') === undefined && flag !== 'change' && activityDate.toDateString()!==today.toDateString()){
                setFlag('nodata');
            }
            if(activityDate.toDateString()===today.toDateString()){
                setFlag('change');
            }
        }
    });

    useEffect(()=>{
        todayDocRef = doc(userDocRef, 'Sleep', activityDate.toDateString());
       return () =>{
           unsubscribe();
       };
    });

    function handleKeyUp(event, action){
        if (event.key === 'Enter') {
            if(action === 'Confirm'){
                submit();
            }
            if(action === 'Next'){
                document.getElementById('SleepEndInput').focus();
            }
        }
    }

    return (
        <div className={'card square'} id={'Sleep'}>
            {flag==='change' && <div id={'SleepInput'} className={'flex_col'}>
                <button id={'CornerButton'} onClick={() => setFlag('sleep')}>
                    <img src={CloseBt} alt={'close'} className={'light'}/>
                    <img src={CloseBtDark} alt={'close'} className={'dark'}/>
                </button>
                <h2 className={'card_hd'}>Log your sleep</h2>

                <label>from:
                    <input
                        id={'SleepStartInput'}
                        type={'time'}
                        value={start}
                        onKeyUp={(e)=>handleKeyUp(e, 'Next')}
                        onChange={(e) => setStart(e.target.value)}/>
                </label>
                <label>to:
                    <input
                        id={'SleepEndInput'}
                        type={'time'}
                        value={end}
                        onKeyUp={(e)=>handleKeyUp(e, 'Confirm')}
                        onChange={(e) => setEnd(e.target.value)}/>
                </label>
                <button className={'transp_button bottomCenter'} onClick={submit}>
                    Submit
                </button>

            </div>}
            {flag==='sleep' && <div className={'flex_col'}>
                <button id={'CornerButton'} onClick={() => setFlag('change')}>
                    <img src={MoreBt} alt={'...'} className={'light'}/>
                    <img src={MoreBtDark} alt={'...'} className={'dark'}/>
                </button>

                <h2 className={'card_hd'}>Sleep</h2>

                <img id={'NightToDay'} src={Gradient} alt={'Night to Day gradient'}/>
                <div style={{width: "85%", display: "flex", justifyContent: "space-between"}}>
                    <span>{start}</span>
                    <span>{end}</span>
                    <h3 className={'center'}>{calcTimeAsleep(start, end)}h</h3>

                </div>

            </div>}

            {flag==='nodata' && <div className={'flex_col'}>
                <h2 className={'card_hd'}>Sleep</h2>

                <h4>We don't have data for this day</h4>
                <button className={'transp_button bottomCenter'} onClick={() => setFlag('change')}>
                    Input data
                </button>

            </div>}

        </div>
    )

}