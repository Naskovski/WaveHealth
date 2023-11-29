import React, { Component } from 'react';
import '../components.css';

class LTBTN extends Component{

    render(){
        return (
            <button id={'LTBTN'} className={'transp_button'} style={{width: "33%", justifyContent: "flex-start"}} onClick={this.props.onClickAction}>
                <span id={'spanBt'} className={'bt bigCircBt'}>
                    <img className={'light'} src={this.props.photoLight} alt={this.props.title}/>
                    <img className={'dark'} src={this.props.photoDark} alt={this.props.title}/>
                </span>
                <h3>{this.props.title}</h3>

            </button>
        )
    }

}

export default LTBTN;