import React, { useEffect, useState  } from 'react';
import '../components.css';

import { useNavigate } from "react-router-dom";
import { auth, registerWithEmailAndPassword} from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import logoWhite from "../img/heart white.svg";
import CloseBt from "../ico/close_dark.svg";
import CloseBtDark from "../ico/close_light.svg";

function Register(){
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [user, loading] = useAuthState(auth);

    useEffect(() => {
        if (loading) {
            return;
        }
        if (user) navigate("/homepage");
    }, [user, loading]);

    function handleKeyUp(event, action, elementId){
        if (event.key === 'Enter') {
            if(action === 'Confirm'){
                registerWithEmailAndPassword(name, email, password1, password2);
            }
            if(action === 'Next'){
                document.getElementById(elementId).focus();
            }
        }
    }

    return (
        <div className={'container'}>
            <div id={'Register'} className={'login bigCard'}>
                <button id={'CornerButton'} onClick={() => navigate('/login')}>
                    <img src={CloseBt} className={'light'} alt={'...'} />
                    <img src={CloseBtDark} className={'dark'} alt={'...'} />
                </button>
                <div className={'flex_row'}>
                    <img src={logoWhite} alt={'white logo'}/>
                    <b> Wave Health</b>
                </div>
                <h1>Register</h1>
                <div id={'inputFields'}>
                    <input
                        id={'regNameInput'}
                        placeholder={'Name'}
                        type={"text"}
                        value={name}
                        onKeyUp={(e)=>handleKeyUp(e, 'Next', 'regEmailInput')}
                        onChange={(e) => setName(e.target.value)}/>
                    <input
                        id={'regEmailInput'}
                        placeholder={'Email'}
                        type={"email"}
                        value={email}
                        onKeyUp={(e)=>handleKeyUp(e, 'Next', 'regPassword1')}
                        onChange={(e) => setEmail(e.target.value)}/>

                    <input
                        id={'regPassword1'}
                        placeholder={'Password'}
                        type={"password"}
                        value={password1}
                        onKeyUp={(e)=>handleKeyUp(e, 'Next', 'regPassword2')}
                        onChange={(e) => setPassword1(e.target.value)}/>
                    <input
                        id={'regPassword2'}
                        placeholder={'Repeat password'}
                        type={"password"}
                        value={password2}
                        onKeyUp={(e)=>handleKeyUp(e, 'Confirm')}
                        onChange={(e) => setPassword2(e.target.value)}/>
                    <button
                        className='rec_button accent'
                        onClick={() => registerWithEmailAndPassword(name, email, password1, password2)}
                    >Register</button>
                </div>
            </div>
        </div>
    )

}

export default Register;