import React, { Component } from 'react';
import '../App.css';
import { Marker } from "react-google-maps";
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import iconData from '../data/generalIcons.json';

class MarkerWrapper extends Component {
    constructor () {
        super();

        this.state = {
            cafe: {},
            selected: false
        }
    }

    componentWillMount() {
        this.setState({ cafe: this.props.cafe });
    }

    selectionProcess() {
        if (this.props.selected) {
            this.props.clearCafe();
        }
        else {
            this.props.selectCafe(this.state.cafe.placesData.name+" "+this.state.cafe.placesData.formatted_address);
            this.props.setCenter(this.state.cafe.lat, this.state.cafe.lng);
        }
    }

    displayMarker() {
        if (this.props.selected) {
            return (
                <Marker
                    onClick={this.selectionProcess.bind(this)}
                    icon={{
                        path: iconData.pin.svg,
                        fillColor: '#229EC5',
                        fillOpacity: 1,
                        strokeOpacity: 0,
                        anchor: { x: 15, y: 31 }
                    }}
                    position={{ lat: this.state.cafe.placesData.geometry.location.lat, lng: this.state.cafe.placesData.geometry.location.lng }}
                    zIndex={1000}
                />
            )
        }
        else {
            return (
                <Marker
                    onClick={this.selectionProcess.bind(this)}
                    icon={{
                        path: iconData.pin.svg,
                        fillColor: '#02253E',
                        fillOpacity: 1,
                        strokeOpacity: 0,
                        anchor: { x: 15, y: 31 }
                    }}
                    position={{ lat: this.state.cafe.placesData.geometry.location.lat, lng: this.state.cafe.placesData.geometry.location.lng }}
                />
            )
        }
    }

    render() {
        return (
            <div className='mapMarker'>
                {this.displayMarker()}
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const selectIdentifier = ownProps.cafe.placesData.name + " " + ownProps.cafe.placesData.formatted_address;
    const selected = selectIdentifier === state.selectedName;
    return { selected };
};

export default connect(mapStateToProps, actions)(MarkerWrapper);