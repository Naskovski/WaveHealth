import React, { useEffect, useState, useContext } from 'react';
import '../components.css';
import CloseBt from "../ico/close_dark.svg";
import CloseBtDark from "../ico/close_light.svg";
import Qbt from "../ico/question_mark_light.svg";
import QbtDark from "../ico/question_mark_dark.svg";
import history from '../ico/history_red.svg';
import {doc, setDoc, updateDoc} from "firebase/firestore";
import {userDocRef} from "../firebase";
import {DataContext} from "../DataContext";
import onScrollAppear from "../functions/onScrollAppear";

let today = new Date();
let todayDocRef = doc(userDocRef, 'Calories', today.toDateString());

export default function History(){

    const {activityDate, setActivityDate} = useContext(DataContext);
    const [newDate, setNewDate] = useState(activityDate.toISOString().substring(0,10))
    const [display, setDisplay] = useState('History')

    useEffect(()=>{
        let today = new Date();
        if(activityDate.toDateString()!==today.toDateString()){
            document.querySelector(':root').style.setProperty('--header-bg', 'var(--accent-color)');
            document.querySelector(':root').style.setProperty('--header-transp', 'var(--accent-color)');
            document.querySelector('#Header img[alt=\'red logo\']').style.setProperty('display', 'none');
            document.querySelector('#Header img[alt=\'white logo\']').style.setProperty('display', 'inline-block');
            onScrollAppear('Header', 'var(--header-bg)', 'var(--header-transp)');
        }else {
            document.querySelector(':root').style.setProperty('--header-bg', 'var(--card-bg)')
            document.querySelector(':root').style.setProperty('--header-transp', '#00000000');
            document.querySelector('#Header img[alt=\'red logo\']').style.setProperty('display', 'inline-block');
            document.querySelector('#Header img[alt=\'white logo\']').style.setProperty('display', 'none');
        }
    },[activityDate]);


    const handleKeyUp = event => {
        if (event.key === 'Enter') {
            setActivityDate(new Date(newDate));
        }
    };

    return (

        <div id={'History'} className={'card square'}>
            <h2 className={'card_hd'}>History</h2>


            {display==='History' && <div className={'flex_col'} style={{justifyContent: 'center'}}>
                <button id={'CornerButton'} onClick={() => setDisplay('help')}>
                    <img src={Qbt} alt={'...'} className={'light'}/>
                    <img src={QbtDark} alt={'...'} className={'dark'}/>
                </button>

                {activityDate.toDateString()===today.toDateString() && <img src={history} alt={'clock'}/>}

                {activityDate.toDateString()!==today.toDateString() && <button className={'rec_button accent'} style={{width: '90%'}}
                    onClick={()=> setActivityDate(new Date)}>Return to today</button>}

                <input
                    style={{maxWidth: '75%'}}
                    type={'date'}
                    value={newDate}
                    onKeyUp={handleKeyUp}
                    onChange={(e) => setNewDate(e.target.value)}/>

                <button className={'transp_button bottomCenter'} onClick={()=> setActivityDate(new Date(newDate))}>Change</button>
            </div>
            }
            {display==='help' && <div className={'flex_col'} >
                <button id={'CornerButton'} onClick={() => setDisplay('History')}>
                    <img src={CloseBt} alt={'close'} className={'light'}/>
                    <img src={CloseBtDark} alt={'close'} className={'dark'}/>
                </button>
                <p>
                    Change the date, so you can view or edit you activities on earlier dates
                </p>

            </div>
            }
        </div>
    )
}