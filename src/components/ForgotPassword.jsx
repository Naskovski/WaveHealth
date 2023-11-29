import React, { useEffect, useState  } from 'react';
import '../components.css';
import { useNavigate } from "react-router-dom";
import {auth, sendPasswordReset} from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import logoWhite from "../img/heart white.svg";
import CloseBt from "../ico/close_dark.svg";
import CloseBtDark from "../ico/close_light.svg";

function Reset(){
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [user, loading] = useAuthState(auth);

    useEffect(() => {
        if (loading) {
            return;
        }
        if (user) navigate("/homepage");
    }, [user, loading]);

    const handleKeyUp = event => {
        if (event.key === 'Enter') {
            sendPasswordReset(email);
        }
    };

    return (
        <div className={'container'}>
            <div id={'PasswordReset'} className={'card squareEXTRA'}>
                <button id={'CornerButton'} onClick={() => navigate('/login')}>
                    <img src={CloseBt} className={'light'} alt={'...'} />
                    <img src={CloseBtDark} className={'dark'} alt={'...'} />
                </button>
                <div className={'card_hd flex_row'} style={{width:''}}>
                    <img src={logoWhite} alt={'white logo'}/>
                    <b> Wave Health</b>
                </div>
                <h1>Reset Password</h1>
                <div id={'inputFields'}>
                    <input
                        autoFocus={true}
                        placeholder={'Email'}
                        type={"email"}
                        value={email}
                        onKeyUp={handleKeyUp}
                        onChange={(e) => setEmail(e.target.value)}/>
                    <button
                        className='rec_button accent'
                        onClick={() => sendPasswordReset(email)}
                    >Reset</button>
                </div>
            </div>
        </div>
    )
}

export default Reset;