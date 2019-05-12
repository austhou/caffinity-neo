import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateURL } from '../util';

import * as actions from '../redux/actions';

class QueryProcessor extends Component {
    componentWillReceiveProps(nextProps) {
        const { location, selection } = nextProps;
        let lat = location.current.lat
        let lng = location.current.lng
        let range = location.range
        let id = selection ? selection._id : ""
        updateURL(lat, lng, range, id);
    }
    render() {
        return <div />
    }
}

const mapStateToProps = state => {
    const location = state.location;
    const selection = state.selection;
    return { location: {...location}, selection };
}

export default connect(mapStateToProps, actions)(QueryProcessor);