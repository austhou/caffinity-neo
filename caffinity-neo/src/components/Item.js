import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import ReactStars from 'react-stars';

import { distance } from '../util';


import * as actions from '../redux/actions';
//import './App.css';
import cafeData from '../assets/data.json';

import request from 'request';


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
        var googData = cafeData[this.props.cafe.name + ' ' + this.props.cafe.address.street];
        if (googData) {
            this.setState({placeId: googData.place_id, rating: googData.rating});
            var hours = this.getPlaceDetails(googData.place_id, (err, result) => {
                if(err){ 
                  return console.log('Request error: '+err+result);
                };
                //console.log('Request successful:')
                //console.log(result)
                this.setState({ openNow: result.opening_hours.open_now })
            });
        }
        //console.log(this.props.cafe)

    }

    returnIcon(name, iconName) {
        if (this.props.cafe.attributes[name] >= 1) {
            return <div style={{marginRight: 16}}><Icon className='darkIcon' name={iconName} /></div>
        }
        else {
            return <div style={{marginRight: 16}}><Icon className="lightIcon" name={iconName} /></div>
        }
    }
      
    getPlaceDetails(ref,callback){
        var config = {   
            uri:'https://maps.googleapis.com/maps/api/place/details/json',
            qs: {
                key: "SOME-VALID-GOOGLEPLACES-API-KEY",
                // Generate a new Simple API key and plug it in
                // https://code.google.com/apis/console
                reference:ref,
                sensor:'false',
            }
        };
        /**
        request(config, function(err, response, body){
            if(err){ return callback(err) };
            var res = JSON.parse(body);
            switch(res.status){
                case "OK":           return callback(null, res.result);
                case "ZERO_RESULTS": return callback(null, res.result);
                default:             return callback(res.status, body);
            };
        }); */

        const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${ref}&key=${"AIzaSyABWS8s0OfEihnSO4l-g4pJc6eF9VFFFE8"}&fields=opening_hours`;
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        //const url = "https://example.com"; // site that doesn’t send Access-Control-*
        fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
            .then(response => response.json())
            .then(contents => {
                return callback(null, contents.result);
            })
            .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))
    };

    openInNewTab(href) {
        Object.assign(document.createElement('a'), {
          target: '_blank',
          href,
        }).click();
      }

    render() {
        return (
            <div className="itemHolder">
                { this.props.cafe && 
                    <div style={{display: 'flex', flexDirection: "row", position: 'absolute', alignItems: 'center'}}>
                        <p 
                            style={{width: 64, textAlign: 'right', marginRight: 32}} 
                            className="textLight"
                        >
                            {distance(this.props.cafe.lat, this.props.cafe.lng, this.props.location.lat, this.props.location.lng, "M") + " mi"}
                        </p>
                        <p style={{
                            width: 360, 
                            textAlign: 'left', 
                            marginRight: 8, 
                            display: 'flex', 
                            flexDirection: 'row',
                            alignItems: 'center',
                            }} 
                            className="textName"
                        >
                            {this.props.cafe.name}
                            <span style={{marginLeft: 16}} className="textLight textSmall">{!this.state.openNow && 'CLOSED'}</span>
                            <span style={{marginLeft: 0}} className="textLight textSmall textReveal">{this.state.openNow && 'OPEN'}</span>
                        </p>
                        {this.returnIcon('wifi','wifi')}
                        {this.returnIcon('outlets','plug')}
                        {this.returnIcon('food','food')}
                        <div style={{marginLeft: 32}}>
                            <ReactStars
                                count={5}
                                color1={'#F3F5F7'}
                                value={this.state.rating}
                                size={24}
                                edit={false}
                                color2={'rgba(2, 37, 62, .33)'} 
                                size={'16px'}
                            />
                        </div>
                    </div>
                }
                <div className="itemMenu">
                    
                    <div 
                        onClick={this.openInNewTab.bind(
                            this, 
                            `https://maps.google.com/maps?daddr=${this.props.cafe.name+' '+this.props.cafe.address.street}&amp;ll=`)} 
                        className="itemButton"
                    >
                        NAVIGATE
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const cafes = state.cafe;
    const location = state.location;
    
    return { cafes, location };
}

export default connect(mapStateToProps, actions)(List);