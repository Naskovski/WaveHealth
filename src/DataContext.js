import React, { useState, createContext } from 'react';

const DataContext = createContext();

const DataProvider = ({ children }) => {
    const [name, setName] = useState('');
    const [steps, setSteps] = useState(0);
    const [goal, setGoal] = useState(6000);//steps goal
    const [counterType, setCounterType] = useState('Surfer')
    const [height, setHeight] = useState(0);
    const [weight, setWeight] = useState(0);
    const [unit, setUnit] = useState('Metric');
    const [gender, setGender] = useState('');
    const [birthdate, setBirthdate] = useState('1970-01-01');
    const [edit, setEdit] = useState(false);
    const [bmr, setBmr] = useState(2000);
    const [activityDate, setActivityDate] = useState(new Date());
    const [workoutCalories, setWorkoutCalories] = useState(0);
    const [totWOdur, setTotWOdur] = useState(-25);

    const value={  name, setName,
        steps, setSteps,
        goal, setGoal,
        counterType, setCounterType,
        height, setHeight,
        weight, setWeight,
        unit, setUnit,
        gender, setGender,
        birthdate, setBirthdate,
        edit, setEdit,
        bmr, setBmr,
        activityDate, setActivityDate,
        workoutCalories, setWorkoutCalories,
        totWOdur, setTotWOdur
    };
    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
export { DataContext, DataProvider };