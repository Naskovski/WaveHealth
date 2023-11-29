import React, { useEffect, useState, useContext  } from 'react';
import '../components.css';
import MoreBt from "../ico/more_horiz.svg";
import MoreBtDark from "../ico/more_horiz_dark.svg";
import CloseBt from "../ico/close_dark.svg";
import CloseBtDark from "../ico/close_light.svg";
import showOverlay from "../functions/showOverlay";
import {collection, doc, getDocs, onSnapshot, setDoc, updateDoc, query, orderBy} from "firebase/firestore";
import {userDocRef} from "../firebase";
import walking_light from "../ico/activities/walking_light.svg";
import walking_dark from "../ico/activities/walking_dark.svg";
import running_light from "../ico/activities/running_light.svg";
import running_dark from "../ico/activities/running_dark.svg";
import cycling_light from "../ico/activities/cycling_light.svg";
import cycling_dark from "../ico/activities/cycling_dark.svg";
import hiking_light from "../ico/activities/hiking_light.svg";
import hiking_dark from "../ico/activities/hiking_dark.svg";
import swimming_light from "../ico/activities/swimming_light.svg";
import swimming_dark from "../ico/activities/swimming_dark.svg";
import surfing_light from "../ico/activities/surfing_light.svg";
import surfing_dark from "../ico/activities/surfing_dark.svg";
import football_light from "../ico/activities/football_light.svg";
import football_dark from "../ico/activities/football_dark.svg";
import basketball_light from "../ico/activities/basketball_light.svg";
import basketball_dark from "../ico/activities/basketball_dark.svg";
import handball_light from "../ico/activities/handball_light.svg";
import handball_dark from "../ico/activities/handball_dark.svg";
import volleyball_light from "../ico/activities/volleyball_light.svg";
import volleyball_dark from "../ico/activities/volleyball_dark.svg";
import tennis_light from "../ico/activities/tennis_light.svg";
import tennis_dark from "../ico/activities/tennis_dark.svg";
import martial_arts_light from "../ico/activities/martial_arts_light.svg";
import martial_arts_dark from "../ico/activities/martial_arts_dark.svg";
import skiing_light from "../ico/activities/skiing_light.svg";
import skiing_dark from "../ico/activities/skiing_dark.svg";
import skateboarding_light from "../ico/activities/skateboarding_light.svg";
import skateboarding_dark from "../ico/activities/skateboarding_dark.svg";

import LTBTN from "./LogoAndTextButton";
import {DataContext} from "../DataContext";
import ExerciseDisplay from "./ExerciseDisplay";

export default function Exercise(){
    const {activityDate, setActivityDate} = useContext(DataContext);
    const todayDocRef = doc(userDocRef, 'Exercise', activityDate.toDateString());

    const {unit, setUnit} = useContext(DataContext);
    const {height, setHeight} = useContext(DataContext);
    const {gender, setGender} = useContext(DataContext);

    const [exercise, setExercise] = useState('none');
    const [exeType, setExeType] = useState('1');

    const [duration, setDuration] = useState(0);
    const [distance, setDistance] = useState(0);
    const [dstUnit, setDstUnit] = useState('km');
    const [hikingType, setHikingType] = useState('General');

    const [poolLength, setPoolLength] = useState(0);
    const [numLen, setNumLen] = useState(0);
    const [strokeType, setStrokeType] = useState('Freestyle');
    const [exeName, setExeName] = useState('');
    const [workoutCal, setWorkoutCal] = useState(0);

    const [met, setMet] = useState(1);
    const {bmr, setBmr} = useContext(DataContext);

    const [oldWorkouts, setOldWorkouts] = useState([]);
    const {workoutCalories, setWorkoutCalories} = useContext(DataContext); //for calories.jsx
    const {totWOdur, setTotWOdur} = useContext(DataContext); //total Workout Duration

    function toggleCategories(){
        if(exercise === "none"){
            document.getElementById('categories').classList.remove('disabled');
            document.getElementById('categories').classList.add('active');

            document.getElementById('details').classList.remove('active');
            document.getElementById('details').classList.add('disabled');
        }else{
            document.getElementById('categories').classList.remove('active');
            document.getElementById('categories').classList.add('disabled');

            document.getElementById('details').classList.remove('disabled');
            document.getElementById('details').classList.add('active');
        }
    }
    function clearExercise(){
        setExercise('none');
        setDuration(0);
        setDistance(0);
        setNumLen(0);
        setPoolLength(0);
        setExeName('');
        toggleCategories();
    }

    function setExe(txt){
        setExercise(txt);
        toggleCategories();
    }

    function loadPopUp(txt){
        setExe(txt);
        showOverlay('exercisePopUp', 'show');
        toggleCategories();
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

    function calcStepsFromDistance(){
        if(Number(distance)===0){
            return Number(0);
        }

        let h, dst;
        if(unit==='Metric'){
            if(Number(height)<10){
                h=height;
            }else{
                h=height/100;
            }

            if(dstUnit==='km'){
                dst=distance*1000;
            }else{
                dst=distance;
            }
        }else{
            if(Number(height)<10){
                //m
                h = (height/3.281)
            }else{//cm to m
                h = (height*2.54)/100;
            }

            if(dstUnit==='mi'){
                dst=distance*1609;
            }else{
                dst=distance*1.094;
            }
        }

        let stepLength;
        if (gender==='Female'){
            stepLength = h*0.413;
        }else{
            stepLength = h*0.415;
        }

        return (Math.round(dst/stepLength));
    }

    function calcAvgSpeed(){
        let dst;
        let t=duration/60;

        if(unit==='Metric'){
            if(dstUnit==='km'){
                dst=distance;
            }else{
                dst=distance/1000;
            }
            if(isNaN(dst/t)){
                return "Please enter data";
            }
        }else{
            if(dstUnit==='mi'){
                dst=distance;
            }else{
                dst=distance*1760;
            }
            if(isNaN(dst/t)){
                return "Please enter data";
            }
        }

        return((dst/t).toFixed(2));
    }

    function calcAvgPace(){
        let dst;
        let t=duration;

        if(unit==='Metric'){
            if(dstUnit==='km'){
                dst=distance;
            }else{
                dst=distance/1000;
            }

            if(exercise==="Swimming"){
                let int=Math.floor(t/dst/10);
                let dec=((t/dst/10)-int)*60;
                if(isNaN(int) || isNaN(dec)){
                    return "Please enter data";
                }
                return(int.toString() +"'"+ Math.round(dec).toString() +'"/100m');
            }
            let int=Math.floor(t/dst);
            let dec=((t/dst)-int)*60;

            if(isNaN(int) || isNaN(dec)){
                return "Please enter data";
            }

            return(int.toString() +"'"+ Math.round(dec).toString() +'"/km');
        }else{
            if(dstUnit==='mi'){
                dst=distance;
            }else{
                dst=distance*1760;
            }
            if(exercise==="Swimming"){
                let int=Math.floor(t/dst/10);
                let dec=((t/dst/10)-int)*60;
                if(isNaN(int) || isNaN(dec)){
                    return "Please enter data";
                }
                return(int.toString() +"'"+ Math.round(dec).toString() +'"/100yards');
            }
            let int=Math.floor(t/dst);
            let dec=((t/dst)-int)*60;

            if(isNaN(int) || isNaN(dec)){
                return "Please enter data";
            }

            return(int.toString() +"'"+ Math.round(dec).toString() +'"/mi');
        }
    }

    function refreshMET(){
        let avgSpeed=calcAvgSpeed();
        if(unit!=='Metric'){
            avgSpeed=avgSpeed*1.609;
        }
        if(exercise==='Walking'){
                 if(avgSpeed<=4){setMet(3.0)}
            else if(avgSpeed<=5.2){setMet(3.5)}
            else if(avgSpeed<=6.4){setMet(5.0)}
            else if(avgSpeed<=7.3){setMet(7.0)}
            else if(avgSpeed<=8){setMet(8.3)}
            else{setMet(10)}
        }
        if(exercise==='Running'){
            if(avgSpeed<=6.4){setMet(6.0)}
            else if(avgSpeed<=8){setMet(8.3)}
            else if(avgSpeed<=8.4){setMet(9.0)}
            else if(avgSpeed<=9.65){setMet(9.8)}
            else if(avgSpeed<=10.7){setMet(10.5)}
            else if(avgSpeed<=11.3){setMet(11)}
            else if(avgSpeed<=12.9){setMet(11.8)}
            else if(avgSpeed<=13.9){setMet(12.3)}
            else if(avgSpeed<=14.5){setMet(12.8)}
            else if(avgSpeed<=16){setMet(14.5)}
            else if(avgSpeed<=17.7){setMet(16)}
            else if(avgSpeed<=19.3){setMet(19)}
            else if(avgSpeed<=20.9){setMet(19.8)}
            else if(avgSpeed<=22.5){setMet(23.0)}
            else{setMet(25)}
        }
        if(exercise==='Swimming'){
            if(strokeType==='Freestyle'){
                setMet(8.7);
            }
            if(strokeType==='Backstroke'){
                setMet(9.5);
            }
            if(strokeType==='Breaststroke'){
                setMet(10.3);
            }
            if(strokeType==='Butterfly'){
                setMet(13.8);
            }
            if(strokeType==='Leisurely'){
                setMet(6.0);
            }
        }
        if(exercise==='Cycling'){
            setMet(7.5);
        }
        if(exercise==='Hiking'){
            if(hikingType==='General'){
                setMet(5.3);
            }
            if(hikingType==='Cross-country'){
                setMet(6.0);
            }
        }
        if(exercise==='Skiing'){
            if(hikingType==='General'){
                setMet(7.0);
            }
            if(hikingType==='Cross-country'){
                setMet(9.0);
            }
        }
        if(exercise==='Surfing'){
            setMet(4.0);
        }
        if(exercise==='Football'){
            setMet(8.0);
        }
        if(exercise==='Basketball'){
            setMet(7.0);
        }
        if(exercise==='Handball'){
            setMet(10.0);
        }
        if(exercise==='Volleyball'){
            setMet(5.0);
        }
        if(exercise==='Tennis'){
            setMet(7.3);
        }
        if(exercise==='Martial Arts'){
            setMet(6.3);
        }
        if(exercise==='Skateboarding'){
            setMet(5.0);
        }

    }

    useEffect(() => {
        toggleCategories();

        if(exercise==='Walking' || exercise==='Running' || exercise==='Cycling' || exercise==='Hiking' || exercise==='Skiing'){
            setExeType('1');
        }else if(exercise==='Swimming'){
            setExeType('2');
            setDistance(numLen*poolLength);
            unit==='Metric'?setDstUnit('m'):setDstUnit('yards');
        }else{
            setExeType('3');
        }

    }, [exercise]);

    function calcCalories(){
        refreshMET();
        let c=bmr * (duration/1440) * Number(met);
        setWorkoutCal( Math.round(c));
        return(Math.round(c));
    }


    async function updateFirebase(){
        let dbDoc;
        let exeDocRef;
        let nameOfExercise=exeName;
        let now = new Date();
        let createdAt=now.toLocaleTimeString();
        if(exeName===''){
            nameOfExercise=createdAt;
        }
        exeDocRef = doc(todayDocRef, 'data', nameOfExercise);


        if(exeType==='1'){
            dbDoc = {
                unit: unit,
                dstUnit: dstUnit,
                name: nameOfExercise,
                exercise: exercise,
                duration: Number(duration),
                distance: distance,
                calories: workoutCal,
                avgSpeed: calcAvgSpeed(),
                avgPace: calcAvgPace(),
                createdAt: createdAt
            }
            if(exercise==='Hiking' || exercise==='Skiing'){
                dbDoc = {
                    ...dbDoc,
                    type: hikingType
                }
            }
            if(exercise!=='Cycling' || exercise!=='Skiing'){
                dbDoc = {
                    ...dbDoc,
                    steps: calcStepsFromDistance()
                }
            }
        }
        if(exeType==='2'){
            dbDoc = {
                unit: unit,
                name: nameOfExercise,
                exercise: exercise,
                duration: Number(duration),
                distance: distance,
                calories: workoutCal,
                avgSpeed: calcAvgSpeed(),
                avgPace: calcAvgPace(),
                poolLength: poolLength,
                numLen: numLen,
                strokeType: strokeType,
                createdAt: createdAt
            }
        }
        if(exeType==='3'){
            dbDoc = {
                unit: unit,
                name: nameOfExercise,
                exercise: exercise,
                duration: Number(duration),
                calories: workoutCal,
                createdAt: createdAt
            }
        }
        let total = {
            totalCalories: Number(workoutCalories) + Number(calcCalories()),
            totalDuration: Number(totWOdur)+Number(duration)
        }

        await setDoc(todayDocRef, total);
        await updateDoc(userDocRef, {});

        if(exercise!=='none'){
            await setDoc(exeDocRef, dbDoc);
            await updateDoc(todayDocRef, {});
            await updateDoc(userDocRef, {});
        }

    }

    function confirmExercise(){
        setWorkoutCal( Math.round(calcCalories()));

        showOverlay('exercisePopUp', 'hide');

        updateFirebase();
        clearExercise();
        fetchData();
    }

    const unsubTotal = onSnapshot(todayDocRef, (doc) => {
        if (doc.get('totalCalories') !== undefined) {
            setWorkoutCalories(doc.get('totalCalories'));
        }else {
            setWorkoutCalories( 0);
        }
        if (doc.get('totalDuration') !== undefined) {
            setTotWOdur(doc.get('totalDuration'));
        }else {
            setTotWOdur(0);
        }
    });

    async function fetchData(){
        setOldWorkouts([]);
        let helper=[];
        const q = query(collection(todayDocRef, 'data'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            helper.push(doc.data());
            setOldWorkouts(helper);
        });
    }

    function showOld(){
        fetchData();
        showOverlay('exerciseHistory');
    }

    function handleRefresh(){
        fetchData();
        setExercise('none');
    }

    useEffect(() => {
        setDistance(numLen*poolLength);
        unit==='Metric'?setDstUnit('m'):setDstUnit('yards');
    }, [numLen, poolLength]);

    useEffect(() => {
        calcAvgPace();
        calcAvgSpeed();
        calcCalories();
        calcCalories();
    }, [distance, duration]);

    useEffect(() => {
        calcCalories();
    }, [strokeType, hikingType]);
    useEffect(() => {

    }, [oldWorkouts]);

    useEffect(() => {
        fetchData();
        return () =>{
            unsubTotal();
        };
    }, []);

    useEffect(() => {
       if(totWOdur!==-25){
           updateFirebase();
       }
    }, [totWOdur, workoutCalories]);

    return (
        <div>

            <div id={"Exercise"} className={'card horizontal flex_row'}>
                <div className={'half_width flex_col'}>
                    <h1>Start an exercise</h1>
                    <button className={'transp_button'} onClick={showOld}>View workouts</button>
                </div>
                <div className={'half_width flex_row'} style={{justifyContent: 'center'}}>
                    <button className={'bigCircBt'} onClick={() => loadPopUp('Walking')}>
                        <img src={walking_light} className={'light'} alt={'walking'}/>
                        <img src={walking_dark} className={'dark'} alt={'walking'}/>
                    </button>
                    <button className={'bigCircBt'} onClick={() => loadPopUp('Running')}>
                        <img src={running_light} className={'light'} alt={'running'}/>
                        <img src={running_dark} className={'dark'} alt={'running'}/>
                    </button>
                    <button className={'bigCircBt'} onClick={() => loadPopUp('Cycling')}>
                        <img src={cycling_light} className={'light'} alt={'cycling'}/>
                        <img src={cycling_dark} className={'dark'} alt={'cycling'}/>
                    </button>
                    <button className={'bigCircBt'} onClick={() => loadPopUp('none')}>
                        <img src={MoreBt} className={'light'} alt={'more'}/>
                        <img src={MoreBtDark} className={'dark'} alt={'more'}/>
                    </button>
                </div>
            </div>

            <div id={'exercisePopUp'} style={{display: 'none'}}>
                <div className={'blur fullscreen'} id={'blurlayer'} onClick={() => showOverlay('exercisePopUp')}/>
                <div className={'popUpCard center'}>
                    <button id={'CornerButton'}>
                        <img src={CloseBt} className={'light'} alt={'...'} onClick={() => showOverlay('exercisePopUp')}/>
                        <img src={CloseBtDark} className={'dark'} alt={'...'} onClick={() => showOverlay('exercisePopUp')}/>
                    </button>
                    <section id={'categories'} className={'active'} onDoubleClick={clearExercise}>
                        <h3>Choose an exercise</h3>
                        <div id={'categoriesContainer'} className={'flex_row'}>
                            <LTBTN title={'Walking'} photoLight={walking_light} photoDark={walking_dark} onClickAction={() => setExe('Walking')}/>
                            <LTBTN title={'Running'} photoLight={running_light} photoDark={running_dark} onClickAction={() => setExe('Running')}/>
                            <LTBTN title={'Cycling'} photoLight={cycling_light} photoDark={cycling_dark} onClickAction={() => setExe('Cycling')}/>
                            <LTBTN title={'Hiking'} photoLight={hiking_light} photoDark={hiking_dark} onClickAction={() => setExe('Hiking')}/>
                            <LTBTN title={'Swimming'} photoLight={swimming_light} photoDark={swimming_dark} onClickAction={() => setExe('Swimming')}/>
                            <LTBTN title={'Surfing'} photoLight={surfing_light} photoDark={surfing_dark} onClickAction={() => setExe('Surfing')}/>
                            <LTBTN title={'Football'} photoLight={football_light} photoDark={football_dark} onClickAction={() => setExe('Football')}/>
                            <LTBTN title={'Basketball'} photoLight={basketball_light} photoDark={basketball_dark} onClickAction={() => setExe('Basketball')}/>
                            <LTBTN title={'Handball'} photoLight={handball_light} photoDark={handball_dark} onClickAction={() => setExe('Handball')}/>
                            <LTBTN title={'Volleyball'} photoLight={volleyball_light} photoDark={volleyball_dark} onClickAction={() => setExe('Volleyball')}/>
                            <LTBTN title={'Tennis'} photoLight={tennis_light} photoDark={tennis_dark} onClickAction={() => setExe('Tennis')}/>
                            <LTBTN title={'Martial Arts'} photoLight={martial_arts_light} photoDark={martial_arts_dark} onClickAction={() => setExe('Martial Arts')}/>
                            <LTBTN title={'Skiing'} photoLight={skiing_light} photoDark={skiing_dark} onClickAction={() => setExe('Skiing')}/>
                            <LTBTN title={'Skateboarding'} photoLight={skateboarding_light} photoDark={skateboarding_dark} onClickAction={() => setExe('Skateboarding')}/>

                        </div>
                    </section>
                    <section id={'details'} className={'disabled'}>
                        <button className={'transp_button'} style={{float: "right", right: 0, top: 0}} onClick={clearExercise}>
                            clear selection
                        </button>

                        <input
                            id={'exeName'}
                            type={"text"}
                            value={exeName}
                            placeholder={'Name your workout'}
                            onChange={(e) => setExeName(e.target.value)}/>

                        <h3>Enter details</h3>
                        <h4>You've chosen {exercise}</h4>
                        <div className={'flex_row'}>
                            <div className={'half_width'} id={'exerciseInput'}>
                                <label>
                                    Duration:
                                    <input
                                        type={"number"}
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}/>
                                    min
                                </label>

                                {exeType==='1' && <div>
                                    <label>
                                        Distance:
                                        <input
                                            type={"number"}
                                            value={distance}
                                            onChange={(e) => setDistance(e.target.value)}/>
                                        <button className={'transp_button'}
                                                style={{display: "inline-block", fontSize: '1em'}}
                                                onClick={changeDstUnit}
                                        >{dstUnit}</button>

                                    </label>

                                    {(exercise==='Hiking' || exercise==='Skiing') && <label>
                                        Type:
                                        <select
                                            name={hikingType} id={'strokeType'}
                                            //value={strokeType}
                                            onChange={(e) => setHikingType(e.target.value)}>
                                            <option value={'General'}>General</option>
                                            <option value={'Cross-country'}>Cross-Country</option>
                                        </select>
                                    </label>}

                                </div>}

                                {exeType==='2' && <div>
                                    <label>
                                        Pool Length:
                                        <input
                                            type={"number"}
                                            value={poolLength}
                                            onChange={(e) => setPoolLength(e.target.value)}/>
                                        {unit==='Metric'?<span>m</span>:<span>yards</span>}
                                    </label>

                                    <label>
                                        Number of lengths:
                                        <input
                                            type={"number"}
                                            value={numLen}
                                            onChange={(e) => setNumLen(e.target.value)}/>
                                    </label>

                                    <label>
                                        Stroke Type:
                                        <select
                                            name={strokeType} id={'strokeType'}
                                            onChange={(e) => setStrokeType(e.target.value)}>
                                            <option value={'Freestyle'}>Freestyle</option>
                                            <option value={'Backstroke'}>Backstroke</option>
                                            <option value={'Breaststroke'}>Breaststroke</option>
                                            <option value={'Butterfly'}>Butterfly</option>
                                            <option value={'Leisurely'}>Leisurely</option>
                                        </select>
                                    </label>
                                </div>}
                            </div>
                            <div className={'half_width'} id={'exerciseResults'}>
                                {exeType!=='3' && <div>
                                    <div>Average speed: {calcAvgSpeed()} {unit==='Metric'?<span> km/h</span>:<span> mph</span>}</div>
                                    <div>Average pace:  {calcAvgPace()}</div>
                                </div>}

                                {exeType==='1' && <div>
                                    {exercise!=='Cycling' && <div>Steps: {calcStepsFromDistance()}</div>}
                                    {(exercise==='Hiking' || exercise==='Skiing') && <div>Type:   {hikingType}</div>}
                                </div>}

                                {exeType==='2' && <div>
                                    <div>Distance:  {distance} {unit==='Metric'?<span>m</span>:<span>yards</span>}</div>
                                    <div>Stroke Type:   {strokeType}</div>
                                </div>}

                                <div>Workout Calories: {workoutCal} kcal</div>
                                <button onClick={() => confirmExercise()} >Confirm</button>

                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <div id={'exerciseHistory'} className={''} style={{display: 'none'}}>
                <div className={'blur fullscreen'} id={'blurlayer'} onClick={() => showOverlay('exerciseHistory')}/>
                <div className={'popUpCard center'}>
                    <button id={'CornerButton'} onClick={() => showOverlay('exerciseHistory')}>
                        <img src={CloseBt} className={'light'} alt={'...'} />
                        <img src={CloseBtDark} className={'dark'} alt={'...'}/>
                    </button>
                    <section id={'BigTitle'} className={'title'}>
                        <h1>Workout History</h1>
                        <h5>{activityDate.toDateString()}</h5>
                    </section>
                    <section className={'data'}>
                       {oldWorkouts.map(exeObject => <ExerciseDisplay key={exeObject.name} data={exeObject} refresh={handleRefresh}/>)}
                    </section>
                </div>

            </div>
        </div>
    )
}