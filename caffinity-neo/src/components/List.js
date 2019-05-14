import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { distance } from '../util';
import { Icon } from 'semantic-ui-react';

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
            filterDistance: 1,
        }
    }
    getParams(location) {
        const searchParams = new URLSearchParams(location.search);
        return {
          lat: searchParams.get('lat') || '',
          lon: searchParams.get('lon') || '',
          r: searchParams.get('r') || '',
          id: searchParams.get('id') || '',
        };
    }
    componentWillMount() {
        let { lat, lon, r, id } = this.getParams(window.location)
        if (lat && lon && r) {
            this.props.setLocation(parseFloat(lat), parseFloat(lon), parseFloat(r), id);
            navigator.geolocation.getCurrentPosition(this.storeGeoLocation, this.errorHandler, { 
                timeout: 20000, maximumAge:Infinity, enableHighAccuracy: false });
        }
        else {
            navigator.geolocation.getCurrentPosition(this.storeLocation, this.errorHandler, { 
                timeout: 20000, maximumAge:Infinity, enableHighAccuracy: false });
        }
    }
    errorHandler = (error) => {
        console.log(error)
    }
    storeLocation = (loc) => {
        console.log('The location in lat lon format is: [', loc.coords.latitude, ',', loc.coords.longitude, ']');
        this.props.setLocation(loc.coords.latitude, loc.coords.longitude, this.props.range);
        this.props.setGeoLocation(loc.coords.latitude, loc.coords.longitude);
    }
    storeGeoLocation = (loc) => {
        console.log('The location in lat lon format is: [', loc.coords.latitude, ',', loc.coords.longitude, ']');
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
            //console.log(sortedL)
            return sortedL;
            
        }
        return null;
    }
    //applies filters to cafes
    returnFilteredCafes() {
        var filterCafes = [...this.props.cafes]
        if (this.props.filters.filterWifi) {
            filterCafes = filterCafes.filter((cafe) => { return cafe.ratingWifi>0 })
        }
        if (this.props.filters.filterPower) {
            filterCafes = filterCafes.filter((cafe) => { return cafe.ratingPower>0 })
        }
        if (this.props.filters.filterFood) {
            filterCafes = filterCafes.filter((cafe) => { return cafe.ratingFood>0 })
        }
        filterCafes = filterCafes.filter((cafe) => { 
            return distance(cafe.placesData.geometry.location.lat, cafe.placesData.geometry.location.lng, this.props.location.lat, this.props.location.lng, "M") < this.props.range;
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
    //return filter checkboxes, DEPRECATED
    returnChecks() {
        return(
            <MediaQuery query="(min-device-width: 600px)">
                <div className="listHeader" style={{display: 'none'}}>
                    <p className="distanceCol"></p>
                    <div onClick={this.props.toggleFilterWifi.bind(this)}><Check checked={this.props.filters.filterWifi} /></div>
                    <div onClick={this.props.toggleFilterPower.bind(this)}><Check checked={this.props.filters.filterPower} /></div>
                    <div onClick={this.props.toggleFilterFood.bind(this)}><Check checked={this.props.filters.filterFood} /></div>
                    <p className='textSmall lightColor'>NAME</p>
                </div>
            </MediaQuery>
        )
    }
    returnBottomPadding() {
        if (window.innerWidth <= 480) {
            return(144)
         }
         else {
            return(64)
         }
    }
    returnLoading() {
        if (this.props.loading) {
            return (
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', height: `calc(100vh - ${this.returnBottomPadding()}px)`}}>
                    <Icon loading name='cog' size='huge'/>
                </div>
            )
        }
    }
    render() {
        return (
            <div>
                {this.returnChecks()}
                <div className="listContainer" style={{maxHeight: `calc(100vh - ${this.returnBottomPadding()}px)`, height: `calc(100vh - ${this.returnBottomPadding()}px)`, overflow: 'scroll', boxSizing: 'content-box'}} >
                    {this.returnLoading()}
                    {this.returnList()}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const cafes = state.cafe;
    const location = state.location.current;
    const range = state.location.range;
    const filters = state.filters;
    const loading = state.loading;
    return { cafes, location, range, filters, loading };
}

export default connect(mapStateToProps, actions)(List);