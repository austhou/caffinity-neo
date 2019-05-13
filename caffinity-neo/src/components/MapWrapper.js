import React, { Component } from 'react';
import '../App.css';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import MarkerWrapper from './MarkerWrapper';
import iconData from '../data/generalIcons.json';
import { distance } from '../util';

const MAPAPIKEY = "AIzaSyBABXrbgUP5XYi-sGHvJ_R9KuLlugctX8s";

const MapComponent = withScriptjs(withGoogleMap((props) => {
    var lat = props.lat;
    var lng = props.lng;
    if (props.selection) {
        lat = props.selection.placesData.geometry.location.lat;
        lng = props.selection.placesData.geometry.location.lng;
    }
    var zoom = 11;
    if (zoom < 8 && zoom >= 5) {
        zoom = 12;
    }
    if (props.range < 5 && props.range > 2) {
        zoom = 13;
    }
    if (props.range <= 2) {
        zoom = 14;
    }
    return (
        <GoogleMap
            defaultZoom={12}
            zoom={zoom}
            center={{ lat: lat, lng: lng }}
            options={{ styles: [
                {
                    "featureType": "all",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "saturation": 36
                        },
                        {
                            "color": "#303335"
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
                            "color": "#fafefe"
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
                            "color": "#fafefe"
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
                            "color": "#F3F5F7"
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
                            "color": "#F3F5F7"
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
                            "color": "#dedfdf"
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
                            "color": "#f2f5f6"
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
                            "color": "#F3F5F7"
                        },
                        {
                            "lightness": "0"
                        }
                    ]
                }
            ]}}
        >

            {props.cafes.map(item => <MarkerWrapper cafe={item} key={item.placesData.name+" "+item.placesData.formatted_address}/>)}

            <Marker
                icon={{
                    path: props.locationSvg,
                    fillColor: '#169DFF',
                    fillOpacity: 1,
                    strokeOpacity: 0,
                    anchor: { x: 15, y: 15 }
                }}
                position={{ lat: props.lat, lng: props.lng }}
                zIndex={1000}
            />
            
        </GoogleMap>)
    }
))

class MapWrapper extends Component {

    componentWillMount() {
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
            return distance(cafe.placesData.geometry.location.lat, cafe.placesData.geometry.location.lng, this.props.location.lat, this.props.location.lng, "M") < this.props.range;
        })
        return filterCafes;
    }

    returnBottomPadding() {
        if (window.innerWidth <= 480) {
            return(144)
         }
         else {
            return(64)
         }
    }

    render () {
        var lat = this.props.lat;
        var lng = this.props.lng;
        return (
            <MapComponent
                isMarkerShown
                googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&key=${MAPAPIKEY}&libraries=geometry,drawing,places`}
                loadingElement={<div style={{ height: `calc(100vh - ${this.returnBottomPadding()}px)` }} />}
                containerElement={<div style={{ height: `calc(100vh - ${this.returnBottomPadding()}px)` }} />}
                mapElement={<div style={{ height: `calc(100vh - ${this.returnBottomPadding()}px)` }} />}
                cafes={this.props.cafes}
                selection = {this.props.selection}
                //city={this.props.city}
                lat={lat}
                lng={lng}
                locationSvg={iconData.yourlocation.svg}
                range = {this.props.range}
            />
        )
    }
}

//filter cafes for markers in here
const mapStateToProps = state => {
    const cafes = state.cafe;  // && Object.keys(state.cafe).map(key => state.cafe[key]);
    const location = state.location.current;
    const range = state.location.range;
    const filters = state.filters;
    const selection = state.selection;

    var filterCafes = []


    if (cafes) {
        filterCafes = [...cafes]
        if (filters.filterWifi) {
            filterCafes = filterCafes.filter((cafe) => { return cafe.ratingWifi>0 })
        }
        if (filters.filterPower) {
            filterCafes = filterCafes.filter((cafe) => { return cafe.ratingPower>0 })
        }
        if (filters.filterFood) {
            filterCafes = filterCafes.filter((cafe) => { return cafe.ratingFood>0 })
        }
        filterCafes = filterCafes.filter((cafe) => { 
            return distance(cafe.placesData.geometry.location.lat, cafe.placesData.geometry.location.lng, location.lat, location.lng, "M") < range;
        })
    }
    return { cafes: filterCafes, lat: location.lat, lng: location.lng, selection, range };
};

export default connect(mapStateToProps, actions)(MapWrapper);
