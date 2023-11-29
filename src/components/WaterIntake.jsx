import React, {useContext, useEffect, useState} from 'react';
import '../components.css';
import ProgressBar from "./progressBar";
import Counter from "./counter";
import glass from "../img/glass-white.png"
import darkglass from "../img/glass-black.png"
import {setDoc, updateDoc, doc, onSnapshot} from "firebase/firestore";
import {userDocRef} from "../firebase";
import MoreBt from '../ico/more_horiz.svg';
import MoreBtDark from '../ico/more_horiz_dark.svg';
import CloseBt from "../ico/close_dark.svg";
import CloseBtDark from "../ico/close_light.svg";
import {DataContext} from "../DataContext";

function WaterIntake (){

    const {activityDate} = useContext(DataContext);

    let pause = false;

    const [value, setValue] = useState(-25);
    const [goal, setGoal] = useState(8);
    const [display, setDisplay] = useState('home');

    let todayDocRef = doc(userDocRef, 'Water', activityDate.toDateString());

    let fetchData = onSnapshot(todayDocRef, (doc) => {
            if(doc.get('value') !== undefined && pause===false){
                setValue(doc.get('value'));
                setGoal(doc.get('goal'));
            }else{
                setValue(0);
                setGoal(8);
            }
        });

    let handleUpdateFirebase = async () =>{
        let dbDoc = {
            goal: goal,
            value: value,
            date: activityDate
        }
        await setDoc(todayDocRef, dbDoc);
        await updateDoc(userDocRef, {}, pause=false);
    }

    let handleReset = () =>{
        setValue(0);
    }

    let handleDecrease = () =>{
        let newValue = value-1;
        setValue(newValue);
    }

    let handleIncrease = () =>{
        let newValue = value+1;
        setValue(newValue);
    }

    useEffect(()=>{
        return ()=>{
            fetchData();
        };
    });

    useEffect(()=>{
        if(value!==-25){
            handleUpdateFirebase();
        }
    },[value, display]);

    return (
        <div id={'WaterIntake'} className={'card horizontal'}>
            {display==='home' && <div className={'flex_row'}>
                <button id={'CornerButton'} onClick={() => setDisplay('goal')}>
                    <img src={MoreBt} alt={'...'} className={'light'}/>
                    <img src={MoreBtDark} alt={'...'} className={'dark'}/>
                </button>
                <div id={'glassContainer'}>
                    <img src={glass} className={'light'} alt={'masking element'}/>
                    <img src={darkglass} className={'dark'} alt={'masking element'}/>
                    <ProgressBar percentage={(value/goal)*100} orientation={'vertical'}/>
                </div>

                <Counter value={value}
                         key={'waterCount'}
                         onReset={handleReset}
                         onDecrease={handleDecrease}
                         onIncrease={handleIncrease}
                         what={(value===1?' cup':' cups')+' of water'}
                />
           </div>}
            {display==='goal' && <div className={'flex_row'}>
                <button id={'CornerButton'} onClick={() => setDisplay('home')}>
                    <img src={CloseBt} alt={'x'} className={'light'}/>
                    <img src={CloseBtDark} alt={'x'} className={'dark'}/>
                </button>
                <h2 className={'half_width'}>
                    Set goal
                </h2>
                <div className={'flex_col half_width'}>
                    <input
                        placeholder={'Type here'}
                        type={"number"}
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}/>
                </div>
                <button
                className='rec_button'
                onClick={() => setDisplay('home')}
                >OK</button>
            </div>}

        </div>
    )

}

export default WaterIntake;