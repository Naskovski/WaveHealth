import React, { useEffect, useState, useContext  } from 'react';
import '../components.css';
import CloseBt from "../ico/close_dark.svg";
import {doc, deleteDoc} from "firebase/firestore";
import {userDocRef} from "../firebase";
import Walking_light from "../ico/activities/walking_light.svg";
import Walking_dark from "../ico/activities/walking_dark.svg";
import Running_light from "../ico/activities/running_light.svg";
import Running_dark from "../ico/activities/running_dark.svg";
import Cycling_light from "../ico/activities/cycling_light.svg";
import Cycling_dark from "../ico/activities/cycling_dark.svg";
import Hiking_light from "../ico/activities/hiking_light.svg";
import Hiking_dark from "../ico/activities/hiking_dark.svg";
import Swimming_light from "../ico/activities/swimming_light.svg";
import Swimming_dark from "../ico/activities/swimming_dark.svg";
import Surfing_light from "../ico/activities/surfing_light.svg";
import Surfing_dark from "../ico/activities/surfing_dark.svg";
import Football_light from "../ico/activities/football_light.svg";
import Football_dark from "../ico/activities/football_dark.svg";
import Basketball_light from "../ico/activities/basketball_light.svg";
import Basketball_dark from "../ico/activities/basketball_dark.svg";
import Handball_light from "../ico/activities/handball_light.svg";
import Handball_dark from "../ico/activities/handball_dark.svg";
import Volleyball_light from "../ico/activities/volleyball_light.svg";
import Volleyball_dark from "../ico/activities/volleyball_dark.svg";
import Tennis_light from "../ico/activities/tennis_light.svg";
import Tennis_dark from "../ico/activities/tennis_dark.svg";
import Martial_arts_light from "../ico/activities/martial_arts_light.svg";
import Martial_arts_dark from "../ico/activities/martial_arts_dark.svg";
import Skiing_light from "../ico/activities/skiing_light.svg";
import Skiing_dark from "../ico/activities/skiing_dark.svg";
import Skateboarding_light from "../ico/activities/skateboarding_light.svg";
import Skateboarding_dark from "../ico/activities/skateboarding_dark.svg";

import {DataContext} from "../DataContext";




export default function ExerciseDisplay(props){
    const {activityDate, setActivityDate} = useContext(DataContext);
    const todayDocRef = doc(userDocRef, 'Exercise', activityDate.toDateString());


    const [unit, setUnit] = useState(props.data.unit);
    const [exeType, setExeType] = useState('');
    const [dstUnit, setDstUnit] = useState(props.data.dstUnit);
    const [distance, setDistance] = useState('');
    const [exercise, setExercise] = useState('');

    const [display, setDisplay] = useState('home');

    const {workoutCalories, setWorkoutCalories} = useContext(DataContext);
    const {totWOdur, setTotWOdur} = useContext(DataContext);

    function getIcon(){
        let lightIcon, darkIcon;
        if(props.data.exercise==='Walking'){
            lightIcon=Walking_light;
            darkIcon=Walking_dark;
        }
        if(props.data.exercise==='Running'){
            lightIcon=Running_light;
            darkIcon=Running_dark;
        }
        if(props.data.exercise==='Cycling'){
            lightIcon=Cycling_light;
            darkIcon=Cycling_dark;
        }
        if(props.data.exercise==='Hiking'){
            lightIcon=Hiking_light;
            darkIcon=Hiking_dark;
        }
        if(props.data.exercise==='Swimming'){
            lightIcon=Swimming_light;
            darkIcon=Swimming_dark;
        }
        if(props.data.exercise==='Surfing'){
            lightIcon=Surfing_light;
            darkIcon=Surfing_dark;
        }
        if(props.data.exercise==='Football'){
            lightIcon=Football_light;
            darkIcon=Football_dark;
        }
        if(props.data.exercise==='Basketball'){
            lightIcon=Basketball_light;
            darkIcon=Basketball_dark;
        }
        if(props.data.exercise==='Handball'){
            lightIcon=Handball_light;
            darkIcon=Handball_dark;
        }
        if(props.data.exercise==='Volleyball'){
            lightIcon=Volleyball_light;
            darkIcon=Volleyball_dark;
        }
        if(props.data.exercise==='Tennis'){
            lightIcon=Tennis_light;
            darkIcon=Tennis_dark;
        }
        if(props.data.exercise==='Martial Arts'){
            lightIcon=Martial_arts_light;
            darkIcon=Martial_arts_dark;
        }
        if(props.data.exercise==='Skiing'){
            lightIcon=Skiing_light;
            darkIcon=Skiing_dark;
        }
        if(props.data.exercise==='Skateboarding'){
            lightIcon=Skateboarding_light;
            darkIcon=Skateboarding_dark;
        }

        return (<span>
        <img className={'dark'} src={darkIcon} alt={props.data.exercise+' icon'}/>
        <img className={'light'} src={lightIcon} alt={props.data.exercise+' icon'}/>
    </span>);
    }
    function changeDstUnit(){
        if(unit==='Metric'){
            if(dstUnit==='m'){
                setDstUnit('km');
                setDistance(distance/1000);
            }else{
                setDstUnit('m');
                setDistance(distance*1000);
            }
        }else{
            if(dstUnit==='mi'){
                setDstUnit('yards');
                setDistance(distance*1760);
            }else{
                setDstUnit('mi');
                setDistance(distance/1760);
            }
        }
    }

    async function deleteExe(){
        setWorkoutCalories(workoutCalories-Number(props.data.calories));
        setTotWOdur(totWOdur-props.data.duration);
        await deleteDoc(doc(todayDocRef, 'data', props.data.name));
        props.refresh();
    }

    useEffect(() => {
        if(props.data.distance){
            setDistance(props.data.distance);
        }

        let exercise=props.data.exercise;
        if(exercise==='Walking' || exercise==='Running' || exercise==='Cycling' || exercise==='Hiking' || exercise==='Skiing'){
            setExeType('1');
        }else if(exercise==='Swimming'){
            setExeType('2');
            unit==='Metric'?setDstUnit('m'):setDstUnit('yards');
        }else{
            setExeType('3');
        }

    }, []);


    return (
        <div id={'exerciseDisplay'} className={'card'}>
            <section className={'title'}>
                {getIcon()}<h3>{props.data.name}</h3>

            </section>
            {display==='home' && <section className={'content'}>
                <button id={'CornerButton'}>
                    <img src={CloseBt} alt={'...'} onClick={() => setDisplay('delete')}/>
                </button>

                <div>Exercise: {props.data.exercise}</div>
                <div>Duration: {props.data.duration} min</div>
                {exeType!=='3' && <div>
                    <div>Average speed:  {props.data.avgSpeed}{unit==='Metric'?<span> km/h</span>:<span> mph</span>}</div>
                    <div>Average pace:  {props.data.avgPace}</div>
                    <div>Distance:  {distance}
                        <button className={'transp_button'}
                                style={{display: "inline-block", fontSize: '1em', margin: 0, padding: 0}}
                                onClick={changeDstUnit}
                        >{dstUnit}</button>
                    </div>
                </div>}


                {(exeType==='1' && exercise!=='Cycling') && <div>Steps: {props.data.steps}</div>}
                {(props.data.exercise==='Hiking' || props.data.exercise==='Skiing') && <div>Type:   {props.data.type}</div>}

                {exeType==='2' && <div>

                    <div>Stroke Type:   {props.data.strokeType}</div>
                </div>}

                <div>Workout Calories: {props.data.calories} kcal</div>
            </section>}
            {display==='delete' && <section id={'delete'} className={'flex_col'}>
                <h1>Delete this workout?</h1>
                <div className={'flex_row'} style={{width: '60%', margin: '1rem'}}>
                    <button className={'rec_button'} onClick={() => setDisplay('home')}>No</button>
                    <button className={'rec_button'} onClick={deleteExe}>Yes</button>
                </div>
            </section>}
        </div>
    )
}