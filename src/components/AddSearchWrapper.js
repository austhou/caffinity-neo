/* global google */
import _ from 'lodash';
import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import { SearchBox } from "react-google-maps/lib/components/places/SearchBox";
const { compose, withProps, lifecycle } = require("recompose");

const MAPAPIKEY = "AIzaSyABWS8s0OfEihnSO4l-g4pJc6eF9VFFFE8";
var allResponses = {};
var fs = require('fs');

const AddSearchWrapper = compose(
    connect(
        mapStateToProps
      ),
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${MAPAPIKEY}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{  height: `100%`, marginRight: `0` }} />,
    containerElement: <div style={{ width: `60%`, height: `10rem` }} />,
    mapElement: <div style={{ height: `100%` }} />
    
  }),
  lifecycle({
    componentWillMount() {
      const refs = {}

      this.setState({
        bounds: null,
        center: {
            lat: 37.7749,
            lng: -122.4194
        },
        markers: [],
        onMapMounted: ref => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
          })
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
            
            const places = refs.searchBox.getPlaces();
            console.log(this.props.cafes);

            
            this.props.cafes.forEach(cafe => {
                var request = {
                    query: cafe.name + ' ' + cafe.address.street, //'Museum of Contemporary Art Australia',
                    fields: ['name', 'geometry'],
                };
                const http = new XMLHttpRequest();
                var searchString = cafe.name + ' ' + cafe.address.street;
                searchString = searchString.replace(/\s/g, "+")
                const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchString}&key=${"AIzaSyABWS8s0OfEihnSO4l-g4pJc6eF9VFFFE8"}`;

                const proxyurl = "https://cors-anywhere.herokuapp.com/";
                //const url = "https://example.com"; // site that doesn’t send Access-Control-*
                fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
                .then(response => response.json())
                .then(contents => {
                    
                    console.log(contents)
                

                    allResponses[cafe.name + ' ' + cafe.address.street] = contents.results[0];
                    console.log("all ")
                    console.log(JSON.stringify(allResponses))
                    
                })
                .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))
            })

          /**
          var map_neighborhood = places[0].address_components[2].short_name;
          var map_street = places[0].address_components[0].short_name+" "+places[0].address_components[1].short_name;
          var map_addr = places[0].address_components[3].long_name+", "+places[0].address_components[5].short_name+" "+places[0].address_components[7].short_name;
          var map_citystate = places[0].address_components[3].long_name+", "+places[0].address_components[5].short_name;
          var map_zip = places[0].address_components[7].short_name;
          var map_name = places[0].name;
          var map_lat = (places[0].geometry.viewport.f.b+places[0].geometry.viewport.f.f)/2;
          var map_lng = (places[0].geometry.viewport.b.b+places[0].geometry.viewport.b.f)/2;
          var addCafeData = { 
            "map_neighborhood": map_neighborhood,
            "map_street": map_street,
            "map_addr": map_addr,
            "map_citystate": map_citystate,
            "map_zip": map_zip,
            "map_name": map_name,
            "map_lat": map_lat,
            "map_lng": map_lng
          }

          this.props.mapSelect(addCafeData);


          const bounds = new google.maps.LatLngBounds();

          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport)
            } else {
              bounds.extend(place.geometry.location)
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
          }));
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

          this.setState({
            center: nextCenter,
            markers: nextMarkers,
          });
          // refs.map.fitBounds(bounds);*/
        },
      })
    },
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={13}
    center={props.center}
    onBoundsChanged={props.onBoundsChanged}
    options={{ styles: [
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "saturation": 36
                },
                {
                    "color": "#333333"
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
                    "color": "#fefefe"
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
                    "color": "#fefefe"
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
                    "color": "#f5f5f5"
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
                    "color": "#f5f5f5"
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
                    "color": "#fdfdfd"
                },
                {
                    "lightness": "0"
                }
            ]
        }
    ]}}
  >
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        placeholder="Find a cafe..."
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          marginTop: `27px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
        }}
      />
    </SearchBox>
    {props.markers.map((marker, index) =>
      <Marker key={index} position={marker.position} />
    )}
  </GoogleMap>
);

const mapStateToProps = state => {
    
    const cafes = _.map(state.cafe, (val, uid) => {
        return { ...val, uid };
    });
    const city = state.city;
    console.log(cafes);
    /**
    cafes.forEach(cafe => {
        var request = {
            query: cafe.name + ' ' + cafe.address.street, //'Museum of Contemporary Art Australia',
            fields: ['name', 'geometry'],
        };
        var service = new google.maps.places.PlacesService();
        service.findPlaceFromQuery(request, function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
            //for (var i = 0; i < results.length; i++) {
            //    createMarker(results[i]);
           // }
            console.log(results[0]);
            }
        });
    })**/

    return { cafes, city };
};

export default connect(mapStateToProps, actions)(AddSearchWrapper);