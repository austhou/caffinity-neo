import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react';

import * as actions from '../redux/actions';
import banner from '../assets/banner.svg';

class TopBar extends Component {
    returnLoginLogoutButtons() {
        if (this.props.user) {
            return(<div 
                className="grayButton"
                style={{width: 'fit-content'}}
                onClick={() => {
                    this.props.logout()
                    this.setState({ loginFormStatus: false })
                }}
            >
                LOGOUT
            </div>)
        }
        else {
            return (<div 
                className="itemButton"
                style={{width: 'fit-content'}}
                onClick={() => { this.setState({ loginFormStatus: true })}}
            >
                LOGIN
            </div>)
        }
    }
    returnSubmitButton() {
        return (
        <div>
            <div 
                className="itemButton"
                style={{width: 'fit-content', marginBottom: 32}}
                onClick={this.openModal}
            >
                + SUBMIT CAFE
            </div>
        </div>
        )
    }

    render() {
        return (
            <div style={{display: 'flex', flexDirection: "row", justifyContent: 'space-between', width: '100%'}}>
                <div style={{marginBottom: 16, position: 'relative'}}>
                    <img src={banner} alt="banner" width="128" style={{position: 'absolute', marginTop: 4}} />                    
                </div>
                <div style={{display: 'flex', flexDirection: 'row', marginTop: 16, marginBottom: 16}}>
                    {this.props.user ? this.returnSubmitButton() : null}
                    {this.returnLoginLogoutButtons()}
                    
                    <div className="itemButton showMobile" onClick={() => { this.setState({ showNavMobile: true }) }} style={{padding: 8, marginLeft: 8}}>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <Icon className='darkIcon blueIcon' name="filter" style={{margin: 0}}/>
                            <p className="smallText">{this.props.cafes && this.returnFilteredCafes().length}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const cafes = state.cafe;
    const location = state.location.current;
    const geoLocation = state.location.geo;
    const range = state.location.range;
    const user = state.user;
    const filters = state.filters;
    
    return { cafes, location, geoLocation, range, user, filters };
}

export default connect(mapStateToProps, actions)(TopBar);