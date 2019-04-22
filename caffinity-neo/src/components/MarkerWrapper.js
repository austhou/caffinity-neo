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
        console.log(this.state.cafe)
        if (this.props.selected) {
            this.props.clearSelection();
        }
        else {
            this.props.setSelection(this.state.cafe);
            //this.props.setCenter(this.state.cafe.lat, this.state.cafe.lng);
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
    const selfIdentifier = ownProps.cafe.id;
    const selectIdentifier = state.selection && state.selection.id; 
    const selected = selectIdentifier === selfIdentifier;
    const selection = state.selection;
    return { selected, selection };
};

export default connect(mapStateToProps, actions)(MarkerWrapper);