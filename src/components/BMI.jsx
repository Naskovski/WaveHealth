import React, {useContext, useEffect, useState} from 'react';
import '../components.css';
import CloseBt from "../ico/close_dark.svg";
import CloseBtDark from "../ico/close_light.svg";
import Qbt from "../ico/question_mark_light.svg";
import QbtDark from "../ico/question_mark_dark.svg";
import {doc, onSnapshot, setDoc, updateDoc} from "firebase/firestore";
import {userDocRef} from "../firebase";
import {DataContext} from "../DataContext";




async function updateFirebase(height, weight, unit){
    let dbDoc = {
        height: height,
        weight: weight,
        unit: unit
    }

    await updateDoc(userDocRef, dbDoc);
}

export default function Bmi(){
    const {height, setHeight} = useContext(DataContext);
    const {weight, setWeight} = useContext(DataContext);
    const {unit, setUnit} = useContext(DataContext);
    const {edit, setEdit} = useContext(DataContext);

    const [display, setDisplay] = useState('BMI')
    const [BMI, setBMI] = useState(0);
    const [color, setColor] = useState('#d4f1f9')

    function toggleUnit(){
        if(unit==="Metric") {
            setUnit('Imperial');
            if(Number(height)<10){
                //m
                setHeight(height*3.281)
            }else{//cm
                setHeight(height/2.54)
            }
            setWeight(weight*2.205);
        }
        else {
            setUnit('Metric')
            if(Number(height)<10){
                //m
                setHeight(height/3.281)
            }else{//cm
                setHeight(height*2.54)
            }
            setWeight(weight/2.205);
        }
    }

    let fetchData = onSnapshot(userDocRef, (doc) => {
        if (doc.get('height') !== undefined && display!=='input' && edit===false) {
            setHeight( doc.get('height'));
            setWeight( doc.get('weight'));
            setUnit( doc.get('unit'));
        }
    });

    function calcBMI(){
        let h, w;
        if(unit==='Metric'){
            h=height;
            w=weight;
        }else{
            if(Number(height)<10){
                //m
                h = (height/3.281)
            }else{//cm
                h = (height*2.54)
            }
            w = (weight/2.205);
        }
        if(Number(h)>10){
            return w/((h/100)*(h/100));
        }else{
            return w/(h*h);
        }
    }

    const handleKeyUp = event => {
        if (event.key === 'Enter') {
            confirmDbUpdate();
        }
    };

    useEffect(() => {
        setBMI(calcBMI);
        return () =>{
            fetchData();
        }
    });

    useEffect(() => {
        if(BMI<18.5){ setColor('#5abcd8');}
        else if(BMI<25){ setColor('#5ad895');}
        else if(BMI<30){ setColor('#ff9900');}
        else { setColor('#d52525');}
    },[BMI]);

    function confirmDbUpdate(){
        setDisplay('BMI');
        updateFirebase(height, weight, unit);
    }

    return (

        <div id={'BMI'} className={'card square'} >
            <h2 className={'card_hd'}>BMI</h2>
            {display==='BMI' && <div className={'flex_col'} style={{justifyContent: 'center'}}>
                <button id={'CornerButton'} onClick={() => setDisplay('help')}>
                    <img src={Qbt} alt={'...'} className={'light'}/>
                    <img src={QbtDark} alt={'...'} className={'dark'}/>
                </button>

                <div id={'a1'} className={'animatedShape'} style={{position: 'absolute', borderColor: color}}/>
                <div id={'a2'} className={'animatedShape'} style={{position: 'absolute', borderColor: color}}/>
                <div id={'a3'} className={'animatedShape'} style={{position: 'absolute', borderColor: color}}/>

                <h1>{BMI.toPrecision(3)}</h1>
                {BMI<18.5?<p>underweight</p>:
                    BMI<25?<p>healthy</p>:
                        BMI<30?<p>overweight</p>:
                            <p>obese</p>

                }
                <button className={'transp_button bottomCenter'} onClick={() => setDisplay('input')}>
                    Record
                </button>
            </div>
            }
            {display==='help' && <div className={'flex_col'} >
                <button id={'CornerButton'} onClick={() => setDisplay('BMI')}>
                    <img src={CloseBt} alt={'...'} className={'light'}/>
                    <img src={CloseBtDark} alt={'...'} className={'dark'}/>
                </button>

                <p className={'smallFont'}> &#60;18.5 - underweight<br/>
                18.5-24.9 - healthy<br/>
                 25.0-29.9 - overweight<br/>
                 &#62;30.0 - obese </p>

            </div>
            }
            {display==='input' && <div className={'flex_col'} >
                <button id={'CornerButton'} onClick={() => setDisplay('BMI')}>
                    <img src={CloseBt} alt={'...'} className={'light'}/>
                    <img src={CloseBtDark} alt={'...'} className={'dark'}/>
                </button>
                <button
                    style={{margin: 0}}
                    type={'submit'}
                    className='rec_button transp_button'
                    onClick={toggleUnit}>
                    {unit}</button>
                <label>
                    <input
                        type={"number"}
                        value={height}
                        onKeyUp={handleKeyUp}
                        onChange={(e) => setHeight(Number(e.target.value))}/>
                    {unit==='Metric'?
                        (Number(height)<10?<span>m</span>:<span>cm</span>)
                        :(Number(height)<10?<span>feet</span>:<span>inches</span>)}
                </label>
                <label>
                    <input
                        type={"number"}
                        value={weight}
                        onKeyUp={handleKeyUp}
                        onChange={(e) => setWeight(Number(e.target.value))}/>
                    {unit==='Metric'?<span>kg</span>:<span>lbs</span>}
                </label>

                <button
                    type={'submit'}
                    className='transp_button bottomCenter'
                    onClick={confirmDbUpdate}>
                Record</button>
            </div>}
        </div>
    )
}