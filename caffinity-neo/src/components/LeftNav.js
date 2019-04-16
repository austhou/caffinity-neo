import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SearchBox } from '@loadup/react-google-places-autocomplete';
import { Icon } from 'semantic-ui-react';

import * as actions from '../redux/actions';
import banner from '../assets/banner.svg';

class LeftNav extends Component {
    constructor() {
        super();
        this.state = {
            customLoc: false,
            editRange: false,
        }
    }
    toggleCustomLocation() {
        if (this.state.customLoc) {
            this.setState({ customLoc: false });
            this.props.setLocation(this.props.geoLocation.lat, this.props.geoLocation.lng, this.props.range);
        }
        else {
            this.setState({ customLoc: true });
        }
    }
    //return either a searchbox or text of the user's current location
    returnLocation() {
        if (this.state.customLoc) {
            return <SearchBox
                id="example-searchbox-id"
                onPlaceChanged={({ original, parsed }) => {
                    console.log(original)
                    let placeData = original[0]
                    let latitude = placeData.geometry.location.lat()
                    let longitude = placeData.geometry.location.lng()
                    this.props.setLocation(latitude, longitude, this.props.range);
                    // original is an array of Google Maps PlaceResult Object
                    // parsed is an array of parsed address components
                }}
                className="searchBox"
                placeholder="Enter a Location"
            />
        }
        else {
            return (
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <p className='textName'>{Math.round(this.props.location.lat*100)/100 + ", " + Math.round(this.props.location.lng*100)/100}</p>
                    {this.returnEditButton(this.toggleCustomLocation)}
                </div>
            )
        }
    }
    returnEditButton(someFunc, param=null) {
        if (param) {
            return (
                <div 
                    className="itemButton smallButton"
                    style={{width: 'fit-content', display: 'flex', flexDirection: 'row', padding: 2, paddingBottom: 6, marginLeft: 8, marginTop: -3, marginBottom: 0}}
                    onClick={someFunc.bind(this, param)}
                >
                    <Icon className='blueIcon' name='pencil' style={{margin: 0}}/>
                </div>
            )
        }
        else {
            return (
                <div 
                    className="itemButton smallButton"
                    style={{width: 'fit-content', display: 'flex', flexDirection: 'row', padding: 2, paddingBottom: 6, marginLeft: 8, marginTop: -3, marginBottom: -2}}
                    onClick={someFunc.bind(this)}
                >
                    <Icon className='blueIcon' name='pencil' style={{margin: 0}}/>
                </div>
            )
        }
    }
    returnLocationButton() {
        if (this.state.customLoc) {
            return <div 
                className="itemButton smallButton"
                style={{width: 'fit-content', display: 'flex', flexDirection: 'row'}}
                onClick={this.toggleCustomLocation.bind(this)}
            >
                <Icon className='blueIcon' name='point' />
                USE MY LOCATION
            </div>
        }
        else {
            return null
        }
    }
    returnRange() {
        if (this.state.editRange) {
            return (
                <input />
            )
        }
        else {
            return (
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <p className='textName'>{this.props.range}</p>
                    <div 
                        className="itemButton smallButton"
                        style={{width: 'fit-content', display: 'flex', flexDirection: 'row', padding: 2, paddingBottom: 6, marginLeft: 8, marginTop: -3, marginBottom: 0}}
                        onClick={this.props.setRange.bind(this, this.props.location.lat, this.props.location.lng, 6)}
                    >
                        <Icon className='blueIcon' name='pencil' style={{margin: 0}}/>
                    </div>
                </div>
            )
        }
    }
    render() {
        return (
            <div style={{width: '15%'}}>
                <img src={banner} alt="banner" width="128" style={{marginBottom: 16}} />
                <p className='textSmall lightColor'>LOCATION</p>
                {this.returnLocation()}
                <div style={{height: 4}} />
                {this.returnLocationButton()}
                <div style={{height: 32}} />
                <p className='textSmall lightColor'>DISTANCE (mi)</p>
                {this.returnRange()}
                <div style={{height: 32}} />
                <div 
                    className="itemButton"
                    style={{width: 'fit-content'}}
                >
                    + SUBMIT CAFE
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
    
    return { cafes, location, geoLocation, range };
}

export default connect(mapStateToProps, actions)(LeftNav);