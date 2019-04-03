import _ from 'lodash';
import React, { Component } from 'react';
import '../App.css';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, SearchBox } from "react-google-maps";
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import MarkerWrapper from './MarkerWrapper';
import iconData from '../data/generalIcons.json';

const MAPAPIKEY = "AIzaSyBABXrbgUP5XYi-sGHvJ_R9KuLlugctX8s";

const MapComponent = withScriptjs(withGoogleMap((props) =>
    <GoogleMap
        defaultZoom={12}
        center={{ lat: props.lat, lng: props.lng }}
        options={{ styles: [
            {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "saturation": 36
                    },
                    {
                        "color": "#333030"
                    },
                    {
                        "lightness": 40
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#ffffff"
                    },
                    {
                        "lightness": 16
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#fefafa"
                    },
                    {
                        "lightness": "20"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#fefafa"
                    },
                    {
                        "lightness": 17
                    },
                    {
                        "weight": 1.2
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#f5f1f1"
                    },
                    {
                        "lightness": "-4"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#f5f1f1"
                    },
                    {
                        "lightness": 21
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#dedede"
                    },
                    {
                        "lightness": 21
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#ffffff"
                    },
                    {
                        "lightness": 17
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#ffffff"
                    },
                    {
                        "lightness": 29
                    },
                    {
                        "weight": 0.2
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#ffffff"
                    },
                    {
                        "lightness": 18
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#ffffff"
                    },
                    {
                        "lightness": 16
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#f2f2f2"
                    },
                    {
                        "lightness": 19
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#f8f4f4"
                    },
                    {
                        "lightness": "0"
                    }
                ]
            }
        ]}}
    >

        {props.cafes.map(item => <MarkerWrapper cafe={item} key={item.name+" "+item.address.street}/>)}

        <Marker
            icon={{
                path: props.locationSvg,
                fillColor: '#0d95d4',
                fillOpacity: 1,
                strokeOpacity: 0,
                anchor: { x: 15, y: 15 }
            }}
            position={{ lat: props.lat, lng: props.lng }}
            zIndex={1000}
        />
        
    </GoogleMap>
))

class MapWrapper extends Component {
    constructor () {
        super()
    }

    componentWillMount() {
    }

    render () {
        return (
            <MapComponent
                isMarkerShown
                googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&key=${MAPAPIKEY}&libraries=geometry,drawing,places`}
                loadingElement={<div style={{ height: `calc(100vh - 64px)` }} />}
                containerElement={<div style={{ height: `calc(100vh - 64px)` }} />}
                mapElement={<div style={{ height: `calc(100vh - 64px)` }} />}
                cafes={this.props.cafes}
                //city={this.props.city}
                lat={this.props.lat}
                lng={this.props.lng}
                locationSvg={iconData.yourlocation.svg}
            />
        )
    }
}

const mapStateToProps = state => {
    const cafes = state.cafe && Object.keys(state.cafe).map(key => state.cafe[key]);
    const location = state.location;
    console.log(cafes)
    return { cafes, lat: location.lat, lng: location.lng };
};

export default connect(mapStateToProps, actions)(MapWrapper);
