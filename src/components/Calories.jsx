import React, { useEffect, useState, useContext } from 'react';
import '../components.css';
import CloseBt from "../ico/close_dark.svg";
import CloseBtDark from "../ico/close_light.svg";
import Qbt from "../ico/question_mark_light.svg";
import QbtDark from "../ico/question_mark_dark.svg";
import fire from '../ico/fire_orange.svg';
import {doc} from "firebase/firestore";
import {userDocRef} from "../firebase";
import {DataContext} from "../DataContext";


export default function Calories(){
    const {steps, setSteps} = useContext(DataContext);
    const {height, setHeight} = useContext(DataContext);
    const {weight, setWeight} = useContext(DataContext);
    const {unit, setUnit} = useContext(DataContext);
    const {gender, setGender} = useContext(DataContext);
    const {birthdate, setBirthdate} = useContext(DataContext);
    const {bmr, setBmr} = useContext(DataContext);
    const {workoutCalories, setWorkoutCalories} = useContext(DataContext);
    const {activityDate, setActivityDate} = useContext(DataContext);

    const [totCalories, setTotCalories] = useState(0);
    const [restCalories, setRestCalories] = useState(0);
    const [stepsCalories, setStepsCalories] = useState(0);
    const [age, setAge] = useState(30);
    const [display, setDisplay] = useState('Calories')

    let today = new Date();

    function calcStepsCal(){
        let h;
        if(unit==='Metric'){
            if(Number(height)<10){
                h=height;
            }else{
                h=height/100;
            }
        }else{
            if(Number(height)<10){
                //feet to m
                h = (height/3.281)
            }else{//inches to m
                h = (height*2.54)/100;
            }
        }

        let calPerStep;
        if (gender==='Female'){
            calPerStep = 62/(1000/(h*0.413));
        }else{
            calPerStep = 62/(1000/(h*0.415));
        }

        return steps*calPerStep;
    }

    function calcRestCal(){
        let h, w;
        if(unit==='Metric'){
            if(Number(height)>10){
                h=height;
            }else{
                h=height*100;
            }
            w=weight;
        }else{
            if(Number(height)<10){
                h=height*30.48
            }else{
                h=height*2.54;
            }
            w = weight/2.205;
        }


        if (gender === 'Female'){
            let BMR1=447.593+(9.247*w)+(4.799*h)-(5.677*age);
            setBmr(BMR1);
            return BMR1;

        }
        else{
            let BMR1=88.362+(9.247*w)+(3.098*h)-(4.330*age);
            setBmr(BMR1);
            return BMR1;
        }

    }

    function updateCalories(){
        let hours, minutes, dayPercentage;
        if(today.toDateString()===activityDate.toDateString()){
            hours = today.getHours();
            minutes = today.getMinutes();
            dayPercentage = (hours/24)+(minutes/1440)
        }else {
            dayPercentage=1;
        }
        setRestCalories( dayPercentage * calcRestCal())
        setStepsCalories(calcStepsCal());
        setTotCalories(stepsCalories+restCalories+workoutCalories);
    }

    function getAge(dateString) {
        let today = new Date();
        let birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    useEffect(() => {
        updateCalories();
        setAge(getAge(birthdate));
    }, []);

    useEffect(() => {
        setAge(getAge(birthdate));
        setTimeout( updateCalories, 500);
    }, [steps, height, weight, unit, birthdate]);

    useEffect(()=>{
        calcStepsCal();
        updateCalories();
    },[activityDate])

    return (
        <div id={'Calories'} className={'card square'} onDoubleClick={updateCalories}>
            <h2 className={'card_hd'}>Calories</h2>

            {display==='Calories' && <div className={'flex_col'} style={{justifyContent: 'center'}}>
                <button id={'CornerButton'} onClick={() => setDisplay('help')}>
                    <img src={Qbt} alt={'...'} className={'light'}/>
                    <img src={QbtDark} alt={'...'} className={'dark'}/>
                </button>

                <img src={fire} alt={'fire'}/>

                <h1>{Math.round(workoutCalories+stepsCalories+restCalories)}</h1>
                total

            </div>}
            {display==='help' && <div className={'flex_col'} >
                <button id={'CornerButton'} onClick={() => setDisplay('Calories')}>
                    <img src={CloseBt} alt={'...'} className={'light'}/>
                    <img src={CloseBtDark} alt={'...'} className={'dark'}/>
                </button>
                <div>
                    <div className={'flex_row'}>
                        <div className={'half_width'}>Activity Calories:</div>
                        <div className={'half_width flex_row'}>{Math.round(workoutCalories+stepsCalories)}</div>
                    </div>
                    <div className={'flex_row'}>
                        <div className={'half_width'}>Rest Calories:</div>
                        <div className={'half_width flex_row'}>{Math.round(restCalories)}</div>
                    </div>
                    <hr/>
                    Total: {Math.round(totCalories)}
                </div>
            </div>}
        </div>
    )
}
