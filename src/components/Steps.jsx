import React, {useContext, useEffect, useState} from 'react';
import '../components.css';
import MoreBtDark from "../ico/more_horiz.svg";
import MoreBt from "../ico/more_horiz_dark.svg";
import CloseBtDark from "../ico/close_dark.svg";
import CloseBt from "../ico/close_light.svg";
import {doc, onSnapshot, setDoc, updateDoc} from "firebase/firestore";
import {userDocRef} from "../firebase";
import lighthouse from "../img/Lighthouse.svg";
import beach from '../img/beach.svg';
import surfer from '../img/surfer.svg';
import clouds from '../img/clouds.svg';
import sea from '../img/surfing.svg';
import ProgressBar from "./progressBar";
import {DataContext} from "../DataContext";
import Activity from "./Activity";

export default function Steps(){
    const {activityDate, setActivityDate} = useContext(DataContext);
    const {goal, setGoal} = useContext(DataContext);
    const {steps, setSteps} = useContext(DataContext);
    const {counterType, setCounterType} = useContext(DataContext);
    const [addValue, setAddValue] = useState('');
    const [display, setDisplay] = useState('counter');
    const {edit, setEdit} = useContext(DataContext);

    let todayDocRef = doc(userDocRef, 'Steps', activityDate.toDateString());

    const handleKeyUpToAddSteps = event => {
        if (event.key === 'Enter') {
            addSteps();
        }
    };

    const handleKeyUpToConfirmGoal = event => {
        if (event.key === 'Enter') {
            confirmDbUpdate();
        }
    };

    async function updateFirebase(steps, goal){
        let dbDoc = {
            steps: steps,
            goal: goal,
        }
        await setDoc(todayDocRef, dbDoc);
        await updateDoc(userDocRef, {});
    }

    function addSteps(){
        let total = Number(addValue) + Number(steps);
        setSteps(total);
        setAddValue('');
        updateFirebase(total, goal);
    }

    function confirmDbUpdate(){
        setEdit(false);
        setDisplay('counter');
        updateFirebase(steps, goal);
    }

    function setCounter(text){
        setCounterType(text);
        localStorage.setItem('CounterType', text);
    }

    let fetchData = onSnapshot(todayDocRef, (doc) => {
        if (doc.get('goal') !== undefined && display !== 'settings') {
            setGoal( doc.get('goal'));
            setSteps( doc.get('steps'));
        }else{
            if(doc.get('goal')===undefined){
                setSteps(0);
                setGoal(6000);
            }
        }
        toggleBeach();
    });

    function toggleBeach(){
        let beachSetup = document.getElementById('beachSetup');
        if(beachSetup!==null){
            if(steps>=goal){
                beachSetup.classList.add('goalCompleted');
            }else{
                beachSetup.classList.remove('goalCompleted');
            }
        }
    }

    useEffect(() => {
        todayDocRef = doc(userDocRef, 'Steps', activityDate.toDateString());
        if(localStorage.getItem('CounterType')!== null){
            setCounterType(localStorage.getItem('CounterType'))
        }
        toggleBeach();
        }, []);

    useEffect(()=>{
        return () =>{
          fetchData();
        };
    });

    useEffect(()=>{
        if(display==='settings'){
           setEdit(true);
            if(counterType==='Plain'){
                document.getElementById('stepsPlainCounterButton').classList.add('accent');
                document.getElementById('stepsSurferCounterButton').classList.remove('accent');
            }else{
                document.getElementById('stepsSurferCounterButton').classList.add('accent');
                document.getElementById('stepsPlainCounterButton').classList.remove('accent');
            }
        }
    },[display, counterType]);

    return (
        <div id={"Steps"} className={'flex_row'}>
            <Activity/>
            <div id={'StepsDisplayCard'} className={'card horizontal'}  >

                {display==='counter' && <div className={'flex_row'}>
                    <button id={'CornerButton'} onClick={() => setDisplay('settings')}>
                        <img className={'dark'} src={MoreBt} alt={'...'} />
                        <img className={'light'} src={MoreBtDark} alt={'...'}/>
                    </button>
                    <h2 className={'card_hd'}>Steps</h2>

                    <h1 id={'StepsCounter'}>{steps}</h1>

                    {counterType==='Surfer' && <div id={'beachSetup'} className={'flex_row'}>
                        <img src={lighthouse} alt={'lighthouse'}/>
                        <img src={beach} alt={'beach'}/>
                        <img src={clouds} alt={'clouds'}/>
                        <img src={surfer} alt={'surfer'} style={{left: (steps / goal * 90) + '%'}}/>
                        <img src={sea} alt={'sea'}/>
                    </div>}

                    {counterType==='Plain' && <ProgressBar percentage={(steps / goal)*100} orientation={'horizontal'}/>}
                    <h5 id={'goal'}>/{goal}</h5>
                </div>}

                {display==='settings' && <div className={'flex_col'}>
                    <button id={'CornerButton'} onClick={() => setDisplay('counter')}>
                        <img src={CloseBt} alt={'...'} className={'dark'}/>
                        <img src={CloseBtDark} alt={'...'} className={'light'}/>
                    </button>
                    <h2 className={'card_hd'}>Steps</h2>
                    <div className={'flex_row'}>
                        <div className={'flex_col half_width'}>
                            <h4>Counter type:</h4>
                            <div className={'flex_row'} style={{borderRadius: '0.5rem', margin: '0.5rem', justifyContent: 'center', overflow: 'hidden'}}>
                                <button
                                    style={{borderRadius: '0'}}
                                    id={'stepsPlainCounterButton'}
                                    onClick={() => setCounter('Plain')}>
                                Plain
                                </button>
                                <button
                                    style={{borderRadius: '0'}}
                                    id={'stepsSurferCounterButton'}
                                    onClick={() => setCounter('Surfer')}>
                                Surfer
                                </button>
                            </div>
                        </div>
                        <div className={'flex_col half_width'}>
                            <h4>Set Goal</h4>
                            <input
                                placeholder={'Type here'}
                                type={"number"}
                                value={goal}
                                onKeyUp={handleKeyUpToConfirmGoal}
                                onChange={(e) => setGoal(e.target.value)}/>
                        </div>
                    </div>
                    <button
                        className='rec_button accent'
                        onClick={confirmDbUpdate}
                    >OK</button>
                </div>}

            </div>

            <div className={'card square'}>
                <h2 className={'card_hd'}>Log your Steps</h2>
                <div id={'inputFields'}>
                    <input
                        placeholder={'Type here'}
                        type={"number"}
                        value={addValue}
                        onKeyUp={handleKeyUpToAddSteps}
                        onChange={(e) => setAddValue(e.target.value)}/>
                    <button
                        type={'submit'}
                        className='transp_button bottomCenter'
                        onClick={addSteps}
                    >Add</button>
                </div>
            </div>
        </div>

    )

}
