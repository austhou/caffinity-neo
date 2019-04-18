import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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
            rangebox: '',
            locationbox: 'Your Location',
        }
    }
    componentDidMount() {
        document.getElementById('rangeInput').addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.keyCode === 13) {
                console.log("adsf")
                this.props.setRange(this.props.location.lat, this.props.location.lng, parseFloat(this.state.rangebox));
            }
        });
        this.setState({ rangebox: this.props.range });

        if (ReactDOM.findDOMNode(this.refs.searchBox)) {
            ReactDOM.findDOMNode(this.refs.searchBox).focus()
        }
    }
    componentDidUpdate() {
        if (ReactDOM.findDOMNode(this.refs.searchBox)) {
            ReactDOM.findDOMNode(this.refs.searchBox).focus()
        }
    }
    //toggle function between current and custom location
    toggleCustomLocation() {
        if (this.state.customLoc) {
            this.setState({ customLoc: false });
            this.props.setLocation(this.props.geoLocation.lat, this.props.geoLocation.lng, this.props.range);
            
        }
        else {
            this.setState({ customLoc: true });
        }
    }
    //submits range change to redux (and then requeries mongo). called when range updates. 
    submitRange() {
        this.props.setRange(this.props.location.lat, this.props.location.lng, parseFloat(this.state.rangebox));
    }
    //return either a searchbox or text of the user's current location
    returnLocation() {
        if (this.state.customLoc) {
            return <SearchBox
                id="example-searchbox-id"
                ref='searchBox'
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
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <input readOnly className='searchBox blueIcon' value={this.state.locationbox} onFocus={this.toggleCustomLocation.bind(this)} />
                </div>
            )
        }
    }
    //returns 'use my location' button when custom location is active
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
    //return range input form
    returnRange() {
        return (
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <input id="rangeInput" value={this.state.rangebox} onChange={this.handleRangeChange.bind(this)} style={{width: 80, display: 'block'}} className='searchBox' />
                {this.returnRangeButton()}
                
            </div>
        )
    }
    //return range update button if range changes. called by returnRange()
    returnRangeButton() {
        if (parseFloat(this.state.rangebox) !== this.props.range) {
            return (
                <div 
                    className="itemButton smallButton"
                    style={{display: 'flex', flexDirection: 'row', width: 24,height:24, justifyContent: 'center', alignItems: 'center', paddingTop: -4, marginLeft: 8}}
                    onClick={this.submitRange.bind(this)}
                >
                    <Icon className='blueIcon' name='check' style={{margin: 0, marginBottom: 2}}/>
                </div>
            )
        }
        else {
            return <div />
        }
    }
    //sets state when range changes
    handleRangeChange(event) {
        this.setState({rangebox: event.target.value});
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