import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react';


import { distance } from '../util';


import * as actions from '../redux/actions';
//import './App.css';


class List extends Component {
    constructor() {
        super();
        this.state = {
            placeId: "",
            openNow: true,
            nextHour: "",
            rating: 0,
        }
    }

    componentWillMount() {
        /*get open hours. this i
        this.setState({ openNow: result.opening_hours.open_now })
        var googData= null;
        if (googData) {
            this.setState({placeId: googData.place_id, rating: googData.rating});
            var hours = this.getPlaceDetails(googData.place_id, (err, result) => {
                if(err){ 
                  return console.log('Request error: '+err+result);
                };
                
            });
        }*/

    }
    //return semantic UI icon. takes the property name (to decide icon color) and the icon name (to select correct icon)
    returnIcon(name, iconName) {
        if (this.props.cafe[name] >= 1) {
            return <div className="iconHolder"><Icon className='darkIcon listIcon' name={iconName} /></div>
        }
        else {
            return <div className="iconHolder"><Icon className="lightIcon listIcon" name={iconName} /></div>
        }
    }
    //get place details from google map with placeId (ref). [DEPRECATED]
    getPlaceDetails(ref,callback){
        /* var config = {   
            uri:'https://maps.googleapis.com/maps/api/place/details/json',
            qs: {
                key: "SOME-VALID-GOOGLEPLACES-API-KEY",
                // Generate a new Simple API key and plug it in
                // https://code.google.com/apis/console
                reference:ref,
                sensor:'false',
            }
        };*/
        const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${ref}&key=${"AIzaSyABWS8s0OfEihnSO4l-g4pJc6eF9VFFFE8"}&fields=opening_hours`;
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
            .then(response => response.json())
            .then(contents => {
                return callback(null, contents.result);
            })
            .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))
    };
    //open link in new tab
    openInNewTab(href) {
        Object.assign(document.createElement('a'), {
          target: '_blank',
          href,
        }).click();
    }
    selectItem() {
        if (this.props.selected) {
            this.props.clearSelection();
        }
        else {
            this.props.setSelection(this.props.cafe)
        }
    }
    render() {
        return (
            <div className="itemHolder" onClick={this.selectItem.bind(this)}>
                { this.props.cafe && 
                    <div style={{display: 'flex', flexDirection: "row", position: 'absolute', alignItems: 'center', maxWidth: '100%'}}>
                        <p 
                            className="distanceCol textLight"
                        >
                            {distance(this.props.cafe.placesData.geometry.location.lat, this.props.cafe.placesData.geometry.location.lng, this.props.location.lat, this.props.location.lng, "M") + " mi"}
                        </p>
                        {this.returnIcon('ratingWifi','wifi')}
                        {this.returnIcon('ratingPower','plug')}
                        {this.returnIcon('ratingFood','food')}
                        <p className={this.props.selected ? "textName itemName blueIcon" : "textName itemName"}>
                            {this.props.cafe.placesData.name}
                            <span style={{marginLeft: 16}} className="textLight textSmall">{!this.state.openNow && 'CLOSED'}</span>
                            <span style={{marginLeft: 0, display: 'none'}} className="textLight textSmall textReveal">{this.state.openNow && 'OPEN'}</span>
                        </p>
                    </div>
                }
                <div className="itemMenu">
                    <div 
                        onClick={this.openInNewTab.bind(
                            this, 
                            `https://maps.google.com/maps?daddr=${this.props.cafe.placesData.name+' '+this.props.cafe.placesData.formatted_address}&amp;ll=`)} 
                        className="itemButton hideMobile"
                    >
                        NAVIGATE
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const cafes = state.cafe;
    const location = state.location.current;

    const selfIdentifier = ownProps.cafe.id;
    const selectIdentifier = state.selection && state.selection.id; 
    const selected = selectIdentifier === selfIdentifier;
    const selection = state.selection;
    
    return { cafes, location, selected };
}

export default connect(mapStateToProps, actions)(List);