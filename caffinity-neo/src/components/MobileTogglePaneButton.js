import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import * as actions from '../redux/actions';

import '../App.css';

class MobileTogglePaneButton extends Component {

    returnIcon() {
        if (this.props.mobilePane) {
            return <Icon className='darkIcon blueIcon' name="list" style={{margin: 0}}/>
        }
        else {
            return <Icon className='darkIcon blueIcon' name="map outline" style={{margin: 0}}/>
        }
    }
    render() {
        return (
            <div className="itemButton showMobile" onClick={() => { this.props.togglePane() }} style={{padding: 8, marginLeft: 8}}>
                {this.returnIcon()}
            </div>
        );
    }
}

const mapStateToProps = state => {
    const mobilePane = state.mobilePane;
    return { mobilePane };
}

export default connect(mapStateToProps, actions)(MobileTogglePaneButton);
