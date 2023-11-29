import React, {useEffect, useContext} from 'react';
import '../components.css';
import logo from '../img/heart red.svg';
import logoWhite from '../img/heart white.svg';
import {auth} from "../firebase";
import {signOut} from "firebase/auth";
import AccIco from '../ico/person_light.svg';
import SetIco from '../ico/settings_light.svg';
import LogOutIco from '../ico/logout_light.svg';
import AccIcoDark from '../ico/person_dark.svg';
import SetIcoDark from '../ico/settings_dark.svg';
import LogOutIcoDark from '../ico/logout_dark.svg';
import showOverlay from "../functions/showOverlay";
import {DataContext} from "../DataContext";

function HeadBar(){

    const {name, setName} = useContext(DataContext);
    const {height, setHeight} = useContext(DataContext);
    const {weight, setWeight} = useContext(DataContext);
    const {gender, setGender} = useContext(DataContext);
    const {birthdate, setBirthdate} = useContext(DataContext);
    const {totWOdur, setTotWOdur} = useContext(DataContext);
    const {workoutCalories, setWorkoutCalories} = useContext(DataContext);
    const {unit, setUnit} = useContext(DataContext);
    const {steps, setSteps} = useContext(DataContext);

    function handleLogout() {
        signOut(auth);
        setTotWOdur(-25);
        setWorkoutCalories(0);
        setName('');
        setSteps(0);
        setHeight(0);
        setWeight(0);
        setUnit('Metric');
        setGender('');
        setBirthdate('1970-01-01');
    }

    useEffect(() => {
        showOverlay('Profile', 'hide');
    }, []); //no double clicks

    return (
        <header id={'Header'} className={'flex_row'}>
            <span style={{verticalAlign: 'middle'}}>
                <img src={logo} alt={'red logo'}/>
                <img src={logoWhite} alt={'white logo'}/>
                <b> Wave Health</b>
            </span>

            <span id={'buttons'} className={'flex_row'}>
                <button className={'round_button transp_button'} onClick={() => showOverlay('Profile', 'show')}>
                    <img src={AccIco} className={'light'} alt={'account icon'}/>
                    <img src={AccIcoDark} className={'dark'} alt={'account icon'}/>
                </button>

                <button className={'round_button transp_button'} onClick={() => showOverlay('Settings', 'show')}>
                    <img src={SetIco} className={'light'} alt={'settings icon'}/>
                    <img src={SetIcoDark} className={'dark'} alt={'settings icon'}/>
                </button>

                <button className={'round_button transp_button'} onClick={handleLogout}>
                    <img src={LogOutIco} className={'light'} alt={'logout icon'}/>
                    <img src={LogOutIcoDark} className={'dark'} alt={'logout icon'}/>
                </button>
            </span>
        </header>
    )
}

export default HeadBar;