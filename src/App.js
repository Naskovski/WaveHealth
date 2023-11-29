import './App.css';
import React, {useEffect} from 'react';
import Login from "./components/login";
import {
    BrowserRouter as Router,
    Routes,
    Route, Navigate
} from "react-router-dom";
import HomePage from "./components/HomePage";
import Register from "./components/Register";
import Reset from "./components/ForgotPassword";
import autoDetectTheme from "./functions/autoDetectTheme";

function App() {

    useEffect(()=>{
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => autoDetectTheme())
    })

    return (
        <div className={'App'} onLoad={autoDetectTheme()}>
               <Router>
                   <Routes>
                       <Route path="/" element={<HomePage/>}/>
                       <Route path="/login" element={<Login />} />
                       <Route path="/register" element={<Register />} />
                       <Route path="/reset" element={<Reset />} />
                       <Route path="*" element={<Navigate to={'/'}/>} />
                   </Routes>
               </Router>
         </div>

    );
}

export default App;