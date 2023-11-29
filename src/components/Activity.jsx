import React, {useContext, useEffect, useState} from 'react';
import '../components.css';
import {DataContext} from "../DataContext";
import ProgressBar from "./progressBar";
import time_light from '../ico/time_light.svg';
import time_dark from '../ico/time_dark.svg';
import fire_light from '../ico/fire_light.svg';
import fire_dark from '../ico/fire_dark.svg';
import walking_light from '../ico/activities/walking_light.svg';
import walking_dark from '../ico/activities/walking_dark.svg';
import showOverlay from "../functions/showOverlay";
import CloseBt from "../ico/close_dark.svg";
import CloseBtDark from "../ico/close_light.svg";
import {doc, setDoc, onSnapshot, updateDoc, getDoc} from "firebase/firestore";
import {userDocRef} from "../firebase";

export default function Activity(){
    const {steps, setSteps} = useContext(DataContext);
    const {unit, setUnit} = useContext(DataContext);
    const {height, setHeight} = useContext(DataContext);
    const {gender, setGender} = useContext(DataContext);
    const {goal, setGoal} = useContext(DataContext);
    const {workoutCalories, setWorkoutCalories} = useContext(DataContext);
    const {totWOdur, setTotWOdur} = useContext(DataContext);
    const {activityDate, setActivityDate} = useContext(DataContext);
    const dataDocRef = doc(userDocRef, 'Highscores', 'data');

    const [bestSteps, setBestSteps] = useState(0);
    const [bestCal, setBestCal] = useState(0);
    const [bestTime, setBestTime] = useState(0);

    const [bestStepsDate, setBestStepsDate] = useState('Thu Jan 01 1970');
    const [bestCalDate, setBestCalDate] = useState('Thu Jan 01 1970');
    const [bestTimeDate, setBestTimeDate] = useState('Thu Jan 01 1970');

    function calcDistanceFromSteps(){
        let h;

        if(unit==='Metric'){
            if(Number(height)<10){
                h=height;
            }else{
                h=height/100;
            }
        }else{
            if(Number(height)<10){
                //m
                h = (height/3.281)
            }else{//cm to m
                h = (height*2.54)/100;
            }
        }
        let stepLength;

        if (gender==='Female'){
            stepLength = h*0.413;
        }else{
            stepLength = h*0.415;
        }

        if(unit==='Metric') return ((steps*stepLength)/1000);
        else return ((steps*stepLength)/1609);

    }

    const unsub = onSnapshot(dataDocRef, (doc) => {

        if (doc.get('bestCal') !== undefined) {
            setBestCal(doc.get('bestCal'));
            setBestCalDate(doc.get('bestCalDate'));
            setBestSteps(doc.get('bestSteps'));
            setBestStepsDate(doc.get('bestStepsDate'));
            setBestTime(doc.get('bestTime'));
            setBestTimeDate(doc.get('bestTimeDate'));
        }else{
            createFirebaseDoc();
        }
    });
    async function createFirebaseDoc(){
        let dbDoc = {
            bestCal: bestCal,
            bestCalDate: bestCalDate,
            bestSteps: bestSteps,
            bestStepsDate: bestStepsDate,
            bestTime: bestTime,
            bestTimeDate: bestTimeDate
        }
        await setDoc(dataDocRef, dbDoc);
        await updateDoc(userDocRef, {});
    }
    async function updateFirebaseCal(){
        let dbDoc = {
            bestCal: bestCal,
            bestCalDate: bestCalDate,
        }
        await updateDoc(dataDocRef, dbDoc);
        await updateDoc(userDocRef, {});
    }
    async function updateFirebaseSteps(){
        let dbDoc = {
            bestSteps: bestSteps,
            bestStepsDate: bestStepsDate,
        }
        await updateDoc(dataDocRef, dbDoc);
        await updateDoc(userDocRef, {});
    }
    async function updateFirebaseTime(){
        let dbDoc = {
            bestTime: bestTime,
            bestTimeDate: bestTimeDate
        }
        await updateDoc(dataDocRef, dbDoc);
        await updateDoc(userDocRef, {});
    }

    useEffect(()=>{
        showOverlay('Highscores', 'hide');
        return()=>{
            unsub();
        };
    }, []);
    useEffect(()=>{
        calcDistanceFromSteps();
    }, [steps]);

    useEffect(()=>{
        if(steps>bestSteps){
            setBestSteps(steps);
            setBestStepsDate(activityDate.toDateString());
        }
        if(totWOdur>bestTime){
            setBestTime(totWOdur);
            setBestTimeDate(activityDate.toDateString());
        }
        if(workoutCalories>bestCal){
            setBestCal(workoutCalories);
            setBestCalDate(activityDate.toDateString());
        }
    }, [steps, totWOdur, workoutCalories, activityDate]);

    useEffect( ()=>{

        async function fetchData(){
            const dbDoc = await getDoc(dataDocRef);
            if(dbDoc.data().bestCal<bestCal) {
                updateFirebaseCal();
            }
            if(dbDoc.data().bestSteps<bestSteps) {
                updateFirebaseSteps();
            }
            if(dbDoc.data().bestTime<bestTime) {
                updateFirebaseTime();
            }
        }
        fetchData();

    }, [bestCal, bestTime, bestSteps]);

    useEffect( ()=>{

        async function fetchData(){
            const dbDoc = await getDoc(dataDocRef);
            if(dbDoc.data().bestCal === undefined) {
                createFirebaseDoc();
            }
        }
        fetchData();

    }, []);


    return (
        <div>
            <div id={'Activity'} className={'card square'} >
                <h2 className={'card_hd'}>Activity</h2>
                <div className={'container'}>
                    <div id={'steps'}>
                        <ProgressBar percentage={(steps/goal)*100} orientation={'horizontal'}>
                            <img className={'light smallIcon'} src={walking_light} alt={'steps icon'}/>
                            <img className={'smallIcon dark'} src={walking_dark} alt={'steps icon'}/>
                            <p>{calcDistanceFromSteps().toFixed(2)} {unit==='Metric'?<span>km</span>:<span>mi</span>}</p>
                        </ProgressBar>
                    </div>
                    <div id={'minutes'}>
                        <ProgressBar percentage={(totWOdur/90)*100} orientation={'horizontal'}>
                            <img className={'light smallIcon'} src={time_light} alt={'time icon'}/>
                            <img className={'smallIcon dark'} src={time_dark} alt={'time icon'}/>
                            <p>{totWOdur} min</p>
                        </ProgressBar>
                    </div>
                    <div id={'calories'}>
                        <ProgressBar percentage={(workoutCalories/500)*100} orientation={'horizontal'}>
                            <img className={'light smallIcon'} src={fire_light} alt={'cal icon'}/>
                            <img className={'smallIcon dark'} src={fire_dark} alt={'cal icon'}/>
                            <p>{workoutCalories} kcal</p>
                        </ProgressBar>
                    </div>
                </div>
                <button className={'bottomCenter transp_button'} style={{width: '80%'}} onClick={() => showOverlay('Highscores')}>Personal Bests</button>
            </div>
            <div id={'Highscores'} className={'hidden'}>
                <div className={'blur fullscreen'} id={'blurlayer'} onClick={() => showOverlay('Highscores')}/>
                <div className={'popUpCard center'}>
                    <button id={'CornerButton'}>
                        <img src={CloseBt} className={'light'} alt={'...'} onClick={() => showOverlay('Highscores')}/>
                        <img src={CloseBtDark} className={'dark'} alt={'...'} onClick={() => showOverlay('Highscores')}/>
                    </button>
                    <h1>Personal Bests</h1>
                    <p className={'subtitle'}>Your days with the most activity were:</p>
                    <div id={'BadgesWrapper'}>
                        <div id={'RotateMe'}>
                            <div id={'StepsBadge'} className={'AchievementBadge'}>
                                <div className={'badgeShadow'}/>
                                <h4>Steps</h4>
                                <img src={walking_light} alt={'steps icon'}/>
                                <div className={'wrap'}>
                                    <span>{bestStepsDate}</span>
                                    <h2 style={{backgroundColor: 'var(--water)'}}>{bestSteps}</h2>
                                </div>
                            </div>
                            <div id={'ActiveTimeBadge'} className={'AchievementBadge'}>
                                <div className={'badgeShadow'}/>
                                <h4>Duration</h4>
                                <img src={time_light} alt={'time icon'}/>
                                <div className={'wrap'}>
                                    <span>{bestTimeDate}</span>
                                    <h2 style={{backgroundColor: 'var(--green-accent)'}}>{bestTime}</h2>
                                </div>
                            </div>
                            <div id={'CaloriesBadge'} className={'AchievementBadge'}>
                                <div className={'badgeShadow'}/>
                                <h4>Calories burned</h4>
                                <img src={fire_light} alt={'cal icon'}/>
                                <div className={'wrap'}>
                                    <span>{bestCalDate}</span>
                                    <h2 style={{backgroundColor: 'var(--orange-accent)'}}>{bestCal}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className={'rec_button'} onClick={() => showOverlay('Highscores', 'hide')}>Close</button>
                </div>
            </div>
        </div>
    )
}