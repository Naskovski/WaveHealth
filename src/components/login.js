import React, { useEffect, useState  } from 'react';
import '../components.css';
import logo from '../img/heart red.svg';
import GoogleLogo from '../img/Google__G__Logo.svg';
import { useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";


function Login(){
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, loading] = useAuthState(auth);

    useEffect(() => {
        if (loading) {
            return;
        }
        if (user) {
            navigate("/");
        }
    }, [user, loading]);

    function handleKeyUp(event, action){
        if (event.key === 'Enter') {
            if(action === 'Confirm'){
                logInWithEmailAndPassword(email, password);
            }
            if(action === 'Next'){
                document.getElementById('loginPasswordInput').focus();
            }
        }
    }

    return (
        <div id={'loginWrapper'}>
            <div id={'login'} className={'login bigCard'}>
                <img src={logo} alt={'logo'} id={'LoginLogo'}/>
                <h1>WaveHealth</h1>
                <h2>Log In</h2>
                <div id={'inputFields'}>
                    <input
                        placeholder={'Email'}
                        type={"email"}
                        value={email}
                        onKeyUp={(e)=>handleKeyUp(e, 'Next')}
                        onChange={(e) => setEmail(e.target.value)}/>
                    <input
                        id={'loginPasswordInput'}
                        placeholder={'Password'}
                        type={"password"}
                        value={password}
                        onKeyUp={(e)=>handleKeyUp(e, 'Confirm')}
                        onChange={(e) => setPassword(e.target.value)}/>
                    <button
                        className='rec_button accent'
                        onClick={() => logInWithEmailAndPassword(email, password)}
                    >Log In</button>
                </div>
                <hr style={{width: '80%', opacity: '0.2'}}/>
                    <button  onClick={signInWithGoogle}>
                        <img src={GoogleLogo} alt={'Google Logo'} className={'button_logo'}/> Continue with Google
                    </button>
            </div>
            <div>
                <a href="/reset">Forgot Password?</a>
            </div>
            <div>
                Don't have an account? <a href="/register">Register</a> now.
            </div>
        </div>
    )
}

export default Login;