import React, { Component } from 'react';
import '../components.css';

class Counter extends Component{

    render(){
        return (
            <div id={'counter'} className={'containter'}>
                <div>
                    <h1>{this.props.value}</h1>
                    {this.props.what}
                </div>
                <span id={'buttons'} className={'flex_row'}>
                    <button className={'round_button'} onClick={() => this.props.onIncrease(this.props.counter)}>+</button>
                    <button className={'round_button'} onClick={() => this.props.onDecrease(this.props.counter)}>-</button>
                    <button className={'round_button'} onClick={() => this.props.onReset(this.props.counter)}>0</button>
                </span>
            </div>
        )
    }
}

export default Counter;