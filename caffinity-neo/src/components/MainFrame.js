import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../redux/actions';

import '../App.css';
import List from './List';
import MapWrapper from './MapWrapper';
import LeftNav from './LeftNav';

class MainFrame extends Component {


    render() {
        return (
            <div className="App">
                <LeftNav />
                <div className="listPane hideMobile" style={!this.props.mobilePane ? {display: 'block'} : {}}>
                    <List />
                </div>
                <div className="mapPane hideMobile" style={this.props.mobilePane ? {display: 'block'} : {}}>
                    <MapWrapper />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const mobilePane = state.mobilePane;
    return { mobilePane };
}

export default connect(mapStateToProps, actions)(MainFrame);
