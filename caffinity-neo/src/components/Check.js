import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import ReactStars from 'react-stars';

import { distance } from '../util';


import * as actions from '../redux/actions';
//import './App.css';


class Check extends Component {

    render() {
        return (
            <div style={{display: 'flex', flexDirection: "row", alignItems: 'center',  width: 20, height: 20, marginRight: 16}}>
                <div style={{width: 14,height:14, borderRadius: 2, border: '2px solid #229EC5'}}>
                    {this.props.checked && <div style={{width: 10,height:10, backgroundColor: '#229EC5'}} />}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const cafes = state.cafe;
    const location = state.location.current;
    return { cafes, location };
}

export default connect(mapStateToProps, actions)(Check);