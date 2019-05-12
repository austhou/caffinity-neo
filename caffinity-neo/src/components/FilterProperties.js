import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { Icon } from 'semantic-ui-react';
import MediaQuery from 'react-responsive';

import iconData from '../data/generalIcons.json';

import * as actions from '../redux/actions';
import Check from './Check';

class FilterProperties extends Component {

    render() {
        return(
            <div>
                <p className="textSmall lightColor" style={{marginBottom: 4}}>Properties</p>
                <div className="filterItem" onClick={this.props.toggleFilterWifi.bind(this)}>
                    <div><Check checked={this.props.filters.filterWifi} /></div>
                    <Icon className={(this.props.filters.filterWifi ? 'darkIcon' : 'lightIcon')} name="wifi" />
                    <p style={{marginLeft: 16}}>{(this.props.filters.filterWifi ? 'Has Wifi' : "No Wifi")}</p>
                </div>
                <div className="filterItem" onClick={this.props.toggleFilterPower.bind(this)}>
                    <div><Check checked={this.props.filters.filterPower} /></div>
                    <Icon className={(this.props.filters.filterPower ? 'darkIcon' : 'lightIcon')} name="plug" />
                    <p style={{marginLeft: 16}}>{(this.props.filters.filterPower ? 'Has Outlets' : "No Outlets")}</p>
                </div>
                <div className="filterItem" onClick={this.props.toggleFilterFood.bind(this)}>
                    <div><Check checked={this.props.filters.filterFood} /></div>
                    <Icon className={(this.props.filters.filterFood ? 'darkIcon' : 'lightIcon')} name="food" />
                    <p style={{marginLeft: 16}}>{(this.props.filters.filterFood ? 'Has Food' : "No Food")}</p>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const cafes = state.cafe;
    const location = state.location.current;
    const geoLocation = state.location.geo;
    const range = state.location.range;
    const user = state.user;
    const filters = state.filters;
    
    return { cafes, location, geoLocation, range, user, filters };
}

export default connect(mapStateToProps, actions)(FilterProperties);