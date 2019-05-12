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
        if (this.props.largebutt) {
            return (
                <div className="itemButton showMobile itemButtonBlue" onClick={() => { this.props.togglePane() }} 
                    style={{padding: 8, marginLeft: 8, width: 48, height: 48, maxHeight: 48,borderRadius: 24, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
                >
                    {this.returnIcon()}
                </div>
            );
        }
        else {
            return (
                <div className="itemButton showMobile itemButtonBlue" onClick={() => { this.props.togglePane() }} style={{padding: 8, marginLeft: 8, display: 'flex', flexDirection: 'row'}}>
                    {this.returnIcon()}
                    <p style={{marginLeft: 8}} className="textSmall">VIEW {this.props.mobilePane ? "LIST" : "MAP"}</p>
                </div>
            );
        }
    }
}

const mapStateToProps = state => {
    const mobilePane = state.mobilePane;
    return { mobilePane };
}

export default connect(mapStateToProps, actions)(MobileTogglePaneButton);
