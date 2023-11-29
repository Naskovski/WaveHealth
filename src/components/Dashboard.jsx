import React from 'react';
import '../components.css';
import WaterIntake from "./WaterIntake";
import Steps from "./Steps";
import Sleep from "./Sleep";
import BMI from "./BMI";
import Calories from "./Calories";
import Exercise from "./Exercise";
import History from "./History";

function Dashboard(){

    return (
        <div id={'dash'} className={'containter'}>
            <Steps/>
            <Exercise/>
            <BMI/>
            <Calories/>
            <Sleep/>
            <WaterIntake/>
            <History/>
        </div>
    );
}

export default Dashboard;