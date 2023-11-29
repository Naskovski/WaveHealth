import React, { useEffect, useState, useContext } from 'react';
import '../components.css';
import {DataContext} from "../DataContext";
import showOverlay from "../functions/showOverlay";
import CloseBt from "../ico/close_dark.svg";
import toggleTheme from "../functions/toggleTheme";
import CloseBtDark from "../ico/close_light.svg";

export default function Settings(){
    const {unit, setUnit} = useContext(DataContext);
    const {counterType, setCounterType} = useContext(DataContext);
    const [theme, setTheme] = useState('dark');

    function setCounter(text){
        setCounterType(text);
        localStorage.setItem('CounterType', text);
    }
    function changeTheme(text){
        setTheme(text);
        toggleTheme(text);
    }

    useEffect(() => {
        if(unit==='Metric'){
            document.getElementById('SettingsBtMetric').classList.add('accent');
            document.getElementById('SettingsBtImperial').classList.remove('accent');
        }else{
            document.getElementById('SettingsBtImperial').classList.add('accent');
            document.getElementById('SettingsBtMetric').classList.remove('accent');
        }

        if(counterType==='Plain'){
            document.getElementById('SettingsBtPlain').classList.add('accent');
            document.getElementById('SettingsBtSurfer').classList.remove('accent');
        }else{
            document.getElementById('SettingsBtSurfer').classList.add('accent');
            document.getElementById('SettingsBtPlain').classList.remove('accent');
        }

        if(localStorage.getItem('theme') === null){
            document.getElementById('SettingsBtOS').classList.add('accent');
            document.getElementById('SettingsBtLight').classList.remove('accent');
            document.getElementById('SettingsBtDark').classList.remove('accent');
        }else{
            document.getElementById('SettingsBtOS').classList.remove('accent');
            if(document.querySelector(":root").classList.contains('light-mode')){
                document.getElementById('SettingsBtLight').classList.add('accent');
                document.getElementById('SettingsBtDark').classList.remove('accent');
            }else{
                document.getElementById('SettingsBtDark').classList.add('accent');
                document.getElementById('SettingsBtLight').classList.remove('accent');
            }
        }

    },[unit, counterType, theme]);

    return (
        <div id={'Settings'} className={'hidden fullscreen'} style={{position: "absolute"}}>
            <div className={'blur fullscreen'} id={'blurlayer'} onClick={() => showOverlay('Settings')}/>
            <div className={'bigCard center'}>
                <button id={'CornerButton'} onClick={() => showOverlay('Settings')}>
                    <img src={CloseBt} className={'light'} alt={'...'} />
                    <img src={CloseBtDark} className={'dark'} alt={'...'} />
                </button>
                <h1>Settings</h1>

                <label>
                    Steps counter type:
                    <div className={'flex_row'}>
                        <button onClick={() => setCounter('Plain')} id={'SettingsBtPlain'}>Plain</button>
                        <button onClick={() => setCounter('Surfer')} id={'SettingsBtSurfer'}>Surfer</button>
                    </div>
                </label>
                <label>
                    Unit of measurement:
                    <div className={'flex_row'}>
                        <button onClick={() => setUnit('Metric')} id={'SettingsBtMetric'}>Metric</button>
                        <button onClick={() => setUnit('Imperial')} id={'SettingsBtImperial'}>Imperial</button>
                    </div>
                </label>
                <label>
                    Theme:
                    <div className={'flex_row'}>
                        <button onClick={() => changeTheme('light')} id={'SettingsBtLight'}>Light</button>
                        <button onClick={() => changeTheme('dark')} id={'SettingsBtDark'}>Dark</button>
                        <button onClick={() => changeTheme('os')} id={'SettingsBtOS'}>OS Preferred</button>

                    </div>
                </label>
                <div style={{width: '100%'}} className={'flex_col'}>
                    <hr className={'divider'}/>
                    <button onClick={() => showOverlay('Settings')} id={'Confirm'} className={'accent'}> OK </button>
                </div>
            </div>
            <p id={'copyrightText'}>&copy;2022 Filip Naskovski</p>
        </div>
    )

}