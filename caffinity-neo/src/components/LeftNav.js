import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { SearchBox } from '@loadup/react-google-places-autocomplete';
import { Icon } from 'semantic-ui-react';
import axios from 'axios';

import * as actions from '../redux/actions';
import banner from '../assets/banner.svg';

import Check from './Check';

class LeftNav extends Component {
    constructor() {
        super();
        this.state = {
            customLoc: false,
            editRange: false,
            focusLocation: false,
            rangebox: '',
            locationbox: 'Your Location', //does not change.
            submitModalOpen: false,
            formPlace: null,
            newWifi: false,
            newPower: false,
            newFood: false,
            newId: '',
            loginFormStatus: false,
            loginUser: '',
            loginPassword: '',
        }
        this.openModal = this.openModal.bind(this);
        //this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
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
        if (ReactDOM.findDOMNode(this.refs.searchBox) && this.state.focusLocation) {
            ReactDOM.findDOMNode(this.refs.searchBox).focus()
            this.setState({ focusLocation: false });
        }
    }
    openModal() {
        this.setState({submitModalOpen: true});
    }
    closeModal() {
        this.setState({submitModalOpen: false, formPlace: null});
    }
    //toggle function between current and custom location
    toggleCustomLocation() {
        if (this.state.customLoc) {
            this.setState({ customLoc: false });
            this.props.setLocation(this.props.geoLocation.lat, this.props.geoLocation.lng, this.props.range);
        }
        else {
            this.setState({ customLoc: true, focusLocation: true });
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
    returnIcon(name, iconName) {
        if (this.props.cafe[name] >= 1) {
            return <div style={{marginRight: 16}}><Icon className='darkIcon' name={iconName} /></div>
        }
        else {
            return <div style={{marginRight: 16}}><Icon className="lightIcon" name={iconName} /></div>
        }
    }
    toggleNewWifi() {
        this.setState({ newWifi: !this.state.newWifi });
    }
    toggleNewPower() {
        this.setState({ newPower: !this.state.newPower });
    }
    toggleNewFood() {
        this.setState({ newFood: !this.state.newFood });
    }
    returnSubmitButton() {
        return (
        <div>
            <div 
                className="itemButton"
                style={{width: 'fit-content'}}
                onClick={this.openModal}
            >
                + SUBMIT CAFE
            </div>
            <div 
                className="grayButton"
                style={{width: 'fit-content', marginRight: 16, marginTop: 16}}
                onClick={() => {
                    this.props.logout.bind(this)
                    this.setState({ loginFormStatus: false })
                }}
            >
                LOGOUT
            </div>
        </div>
        )
    }
    returnLoginForm() {
        if (this.state.loginFormStatus) {
            return (
                <div>
                    <p className='textSmall lightColor'>USERNAME</p>
                    <input className='searchBox' value={this.state.loginUser} onChange={(event) => { this.setState({loginUser: event.target.value }) }} />
                    <div style={{height: 8}} />
                    <p className='textSmall lightColor'>PASSWORD</p>
                    <input type='password' className='searchBox' value={this.state.loginPassword} onChange={(event) => { this.setState({loginPassword: event.target.value }) }} />
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 16}}>
                        <div 
                            className="grayButton"
                            style={{width: 'fit-content', marginRight: 16}}
                            onClick={() => { this.setState({ loginFormStatus: false })}}
                        >
                            CANCEL
                        </div>
                        <div 
                            className="itemButton"
                            style={{width: 'fit-content'}}
                            onClick={(event) => { 
                                this.handleLoginSubmit(event)
                            }}
                        >
                            SUBMIT
                        </div>
                    </div>
                </div>
            )
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
    //send API login call
    handleLoginSubmit(event) {
        this.props.login(this.state.loginUser, this.state.loginPassword)
            .catch(err => {
                console.error(err)
                this.setState({error: 'Failed to log in. Check email/password.'})
            })
        event.preventDefault();
    }
    putDataToDB = (placesObject, ratingWifi, ratingPower, ratingFood) => {
        if (this.state.formPlace) {
            let idToBeAdded = this.state.newId;

            axios.post("https://caffinity.co/backend/api/putData", {
            id: idToBeAdded,
            ratingWifi: ratingWifi,
            ratingPower: ratingPower,
            ratingFood: ratingFood,
            placesData: placesObject
            }).then(() => {
                    this.setState({newFood: false, newPower: false, newWifi: false, newId: null})
                    ReactDOM.findDOMNode(this.refs.searchBox).value = "";
                }
            )
        }
    }
    render() {
        return (
            <div style={{width: '15%'}}>
                    <Modal
                    isOpen={this.state.submitModalOpen}
                    //onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    className="submitModal"
                    contentLabel="Example Modal"
                    verticallyCenter
                    >
                        <SearchBox
                            id="add-searchbox-id"
                            ref='searchBox'
                            onPlaceChanged={({ original, parsed }) => {
                                console.log(original)
                                //let placeData = original[0]
                                //let latitude = placeData.geometry.location.lat()
                                //let longitude = placeData.geometry.location.lng()
                                //this.props.setLocation(latitude, longitude, this.props.range);
                                // original is an array of Google Maps PlaceResult Object
                                // parsed is an array of parsed address components
                                this.setState({ formPlace: {...original[0]}, newId: original[0].place_id });
                                console.log(original[0])
                            }}
                            className="searchBox"
                            placeholder="Enter a Cafe Name"
                            style={{width: '100%'}}
                        />
                        <div style={{height: 32}} />
                        <p className="textSmall lightColor" style={{marginBottom: 16}}>Select Properties</p>
                        <div style={{display: 'flex', flexDirection: 'row', marginBottom: 16 }}>
                            <div onClick={this.toggleNewWifi.bind(this)}><Check checked={this.state.newWifi} /></div>
                            <Icon className={(this.state.newWifi ? 'darkIcon' : 'lightIcon')} name="wifi" />
                            <p style={{marginLeft: 16}}>{(this.state.newWifi ? 'Has Wifi' : "No Wifi")}</p>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'row', marginBottom: 16 }}>
                            <div onClick={this.toggleNewPower.bind(this)}><Check checked={this.state.newPower} /></div>
                            <Icon className={(this.state.newPower ? 'darkIcon' : 'lightIcon')} name="plug" />
                            <p style={{marginLeft: 16}}>{(this.state.newPower ? 'Has Outlets' : "No Outlets")}</p>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'row', marginBottom: 16 }}>
                            <div onClick={this.toggleNewFood.bind(this)}><Check checked={this.state.newFood} /></div>
                            <Icon className={(this.state.newFood ? 'darkIcon' : 'lightIcon')} name="food" />
                            <p style={{marginLeft: 16}}>{(this.state.newFood ? 'Has Food' : "No Food")}</p>
                        </div>
                        <div style={{height: 32}} />
                        <div style={{marginLeft: 'auto', marginRight: 0, display: 'flex', flexDirection: 'row', width: 'fit-content'}}>
                            <div 
                                className="grayButton"
                                style={{width: 'fit-content', marginRight: 16}}
                                onClick={this.closeModal}
                            >
                                CLOSE
                            </div>
                            <div 
                                className="itemButton"
                                style={{width: 'fit-content'}}
                                onClick={() => this.putDataToDB(this.state.formPlace, this.state.newWifi, this.state.newPower, this.state.newFood)}
                            >
                                SUBMIT
                            </div>
                        </div>
                        
                    </Modal>
                <img src={banner} alt="banner" width="128" style={{marginBottom: 16}} />
                <p className='textSmall lightColor'>LOCATION</p>
                {this.returnLocation()}
                <div style={{height: 4}} />
                {this.returnLocationButton()}
                <div style={{height: 32}} />
                <p className='textSmall lightColor'>DISTANCE (mi)</p>
                {this.returnRange()}
                <div style={{height: 32}} />

                {this.props.user ? this.returnSubmitButton() : this.returnLoginForm()}
                
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
    
    return { cafes, location, geoLocation, range, user };
}

export default connect(mapStateToProps, actions)(LeftNav);