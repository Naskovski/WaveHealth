import React, { useState } from 'react';
import '../components.css';

import {changeUserPassword} from "../firebase";
import showOverlay from "../functions/showOverlay";

function ChangePassword(){
    const [oldPassword, setOldPassword] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [waitMsg, setWaitMsg] = useState(false);

    function change(oldPassword, password1, password2){
        changeUserPassword(oldPassword, password1, password2);
        setWaitMsg(true);
    }

    return (
        <div id={'ChangePassword'} className={'hidden'} style={{position: "absolute"}}>
            <div className={'blur fullscreen'} id={'blurlayer'} onClick={() => showOverlay('ChangePassword')}/>
            <div className={'bigCard center flex_col'} style={{backgroundColor: '#D5F3E299'}}>
                <h1>Change Password</h1>
                <label>
                    Old password:
                    <input
                        type={"password"}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}/>
                </label>
                <label>
                    New password:
                    <input
                        type={"password"}
                        value={password1}
                        onChange={(e) => setPassword1(e.target.value)}/>

                </label>
                <label>
                    Repeat new password:
                    <input
                        type={"password"}
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}/>
                </label>
                {waitMsg===true && <div>
                    Please wait a few seconds
                </div>}
                <div className={'flex_row'}>
                    <button
                        className='rec_button'
                        onClick={() => showOverlay('ChangePassword')}
                    >Cancel</button>
                    <button
                        className='rec_button accent'
                        onClick={() => change(oldPassword, password1, password2)}
                    >Change</button>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword;