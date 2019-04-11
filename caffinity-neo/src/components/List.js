import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { distance } from '../util';

import * as actions from '../redux/actions';
import Item from './Item';
import Check from './Check';
//import './App.css';

class List extends Component {
    constructor() {
        super();
        this.state = {
            filterWifi: false,
            filterPower: false,
            filterFood: false,
            filterDistance: 30,
        }
    }
    componentWillMount() {
        navigator.geolocation.getCurrentPosition(this.storeLocation, null, { timeout: 30000 });
        this.props.cafeFetchMongo();
    }

    componentDidMount() {
        this.props.distsort(this.props.location.lat, this.props.location.lng);  
    }

    storeLocation = (loc) => {
        console.log('The location in lat lon format is: [', loc.coords.latitude, ',', loc.coords.longitude, ']');
        this.props.setLocation(loc.coords.latitude, loc.coords.longitude);
        this.props.setGeoLocation(loc.coords.latitude, loc.coords.longitude);
        
    }

    sortCafes (cafes, location) {
        if( location ) {
            const stateArrL = _.map(cafes, (val, uid) => {
                return { ...val };
            });
            const sortedL = _.clone(stateArrL.sort(function(a, b) {
                //console.log(a);
                //action.payload = { lat, lng }
                var alat = a.placesData.geometry.location.lat;//a["lat"];
                var alng = a.placesData.geometry.location.lng;
                var blat = b.placesData.geometry.location.lat;//["lat"];
                var blng = b.placesData.geometry.location.lng;//["lng"];

                var x = parseFloat(distance(alat,alng,location.lat,location.lng,"M"));
                var y = parseFloat(distance(blat,blng,location.lat,location.lng,"M"));

                //console.log(typeof x + '-' + y)

                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            }), true);
            console.log(sortedL)
            return sortedL;
            
        }
        return null;
    }
    returnFilteredCafes() {
        var filterCafes = [...this.props.cafes]
        if (this.state.filterWifi) {
            filterCafes = filterCafes.filter((cafe) => { return cafe.ratingWifi>0 })
        }
        if (this.state.filterPower) {
            filterCafes = filterCafes.filter((cafe) => { return cafe.ratingPower>0 })
        }
        if (this.state.filterFood) {
            filterCafes = filterCafes.filter((cafe) => { return cafe.ratingFood>0 })
        }
        filterCafes = filterCafes.filter((cafe) => { 
            return distance(cafe.placesData.geometry.location.lat, cafe.placesData.geometry.location.lng, this.props.location.lat, this.props.location.lng, "M") < this.state.filterDistance;
        })
        return filterCafes;
    }
    //return an Item component for each cafe in redux state. 
    returnList() {
        if (this.props.cafes) {
            return this.sortCafes(this.returnFilteredCafes(), this.props.location).map((cafe) => {
                return <Item key={cafe.placesData.geometry.location.lat+cafe.placesData.geometry.location.lng} cafe={cafe} />
            })
        }
        else {
            return <div />
        }
    }
    toggleWifi() {
        this.setState({ filterWifi: !this.state.filterWifi });
    }
    toggle(attr) {
        this.setState({ [attr]: !this.state[attr] });
    }
    //return filter checkboxes
    returnChecks() {
        return(
            <div style={{display: 'flex', flexDirection: "row", position: 'relative', alignItems: 'center', paddingBottom: 8, paddingLeft: 16}}>
                <p style={{width: 64, textAlign: 'right', marginRight: 24}}></p>
                <div onClick={this.toggle.bind(this, 'filterWifi')}><Check checked={this.state.filterWifi} /></div>
                <div onClick={this.toggle.bind(this, 'filterPower')}><Check checked={this.state.filterPower} /></div>
                <div onClick={this.toggle.bind(this, 'filterFood')}><Check checked={this.state.filterFood} /></div>
                <p className='textSmall lightColor'>NAME</p>
            </div>
        )
    }
    render() {
        return (
            <div>
                {this.returnChecks()}
                <div className="listContainer" style={{maxHeight: 'calc(100vh - 92px)', overflow: 'scroll', boxSizing: 'content-box'}} >
                    {this.returnList()}
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

export default connect(mapStateToProps, actions)(List);