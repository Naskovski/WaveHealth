import React, { Component } from 'react';
import '../components.css';

class ProgressBar extends Component{

    render(){
        return (
            <div id={'fillbar'} className={'progressBar'}>
                {this.props.orientation === 'horizontal' && <div style={{
                    width: this.props.percentage + '%',
                    height: '100%',
                    left: '0'
                }} className='fill'/>}
                {this.props.orientation === 'vertical' && <div style={{
                    height: this.props.percentage + '%',
                    width: '100%',
                    bottom: '0'
                }} className='fill'/>}
                <span className={'pbChildren'}>{this.props.children}</span>
            </div>
        )
    }

}

export default ProgressBar;