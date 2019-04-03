import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { distance } from '../util';

import * as actions from '../redux/actions';
import Item from './Item';
//import './App.css';

class List extends Component {
    componentWillMount() {
        navigator.geolocation.getCurrentPosition(this.storeLocation, null, { timeout: 30000 });
        this.props.cityCheck("San Francisco");
    }

    componentDidMount() {
        this.props.distsort(this.props.location.lat, this.props.location.lng);  
    }

    storeLocation = (loc) => {
        console.log('The location in lat lon format is: [', loc.coords.latitude, ',', loc.coords.longitude, ']');
        this.props.getLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    }

    sortCafes (cafes, location) {
        if( location ) {
            const stateArrL = _.map(cafes, (val, uid) => {
                return { ...val };
            });
            const sortedL = _.clone(stateArrL.sort(function(a, b) {

                //action.payload = { lat, lng }
                var alat = a["lat"];
                var alng = a["lng"];
                var blat = b["lat"];
                var blng = b["lng"];

                var x = distance(alat,alng,location.lat,location.lng,"M");
                var y = distance(blat,blng,location.lat,location.lng,"M");

                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            }), true);
            
            return sortedL;
        }
        return null;
    }

    render() {
        if (this.props.cafes) {
            return this.sortCafes(this.props.cafes, this.props.location).map((cafe) => {
                return <Item key={cafe.lat+cafe.lng} cafe={cafe} />
            })
        }
        else {
            return <div />
        }
    }
}

const mapStateToProps = state => {
    const cafes = state.cafe;
    const location = state.location;
    return { cafes, location };
}

export default connect(mapStateToProps, actions)(List);