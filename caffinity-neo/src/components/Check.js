import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';

class Check extends Component {

    render() {
        return (
            <div style={{display: 'flex', flexDirection: "row", alignItems: 'center',  width: 20, height: 20, marginRight: 16}}>
                <div className="checkBox">
                    {this.props.checked && <div style={{width: 10,height:10, backgroundColor: '#229EC5'}} />}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const cafes = state.cafe;
    const location = state.location.current;
    return { cafes, location };
}

export default connect(mapStateToProps, actions)(Check);