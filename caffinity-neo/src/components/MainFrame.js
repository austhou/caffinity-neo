import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../redux/actions';
import ReactStars from 'react-stars';

import '../App.css';
import List from './List';
import MapWrapper from './MapWrapper';
import LeftNav from './LeftNav';
import MobileTogglePaneButton from './MobileTogglePaneButton';


class MainFrame extends Component {
    openInNewTab(href) {
        Object.assign(document.createElement('a'), {
          target: '_blank',
          href,
        }).click();
    }
    returnCard() {
        if (this.props.selection) {
            console.log(this.props.selection)
            return (
                <div className="cardHolder">
                    <div className="cardItem">
                        <div style={{display: 'flex', flexFlow: 'row wrap', alignItems: 'center', marginBottom: 8}}>
                            <p className="blueIcon" style={{marginRight: 8}}>{this.props.selection.placesData.name}</p>
                            <ReactStars
                                count={5}
                                color1={'#F3F5F7'}
                                value={this.props.selection.placesData.rating}
                                //size={24}
                                edit={false}
                                color2={'rgba(2, 37, 62, .33)'} 
                                size={12}
                            />
                        </div>
                        <p>{this.props.selection.placesData.formatted_address}</p>
                        <p>{this.props.selection.placesData.formatted_phone_number}</p>
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', width: '100%', marginTop: 16}}>
                            <div 
                                onClick={this.openInNewTab.bind(
                                    this, 
                                    `https://maps.google.com/maps?daddr=${this.props.selection.placesData.name+' '+this.props.selection.placesData.formatted_address}&amp;ll=`)} 
                                className="itemButton"
                                style={{width: 'fit-content'}}
                            >
                                NAVIGATE
                            </div>
                            <MobileTogglePaneButton />
                        </div>
                    </div>
                </div>
            )
        }
    }
    render() {
        return (
            <div className="App" style={{position: 'relative'}}>
                <LeftNav />
                <div className="listPane hideMobile" style={!this.props.mobilePane ? {display: 'block', position: 'relative'} : { position: 'relative' }}>
                    <div className="showMobile">
                        {this.returnCard()}
                    </div>
                    <List />
                </div>
                <div className="mapPane hideMobile" style={this.props.mobilePane ? {display: 'block', position: 'relative'} : { position: 'relative' }}>
                    {this.returnCard()}
                    <MapWrapper style={{zIndex: 5}}/>
                </div>
                <div style={{position: 'absolute', bottom: 0, right: 0}}>
                    <MobileTogglePaneButton largebutt={true}/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const mobilePane = state.mobilePane;
    const selection = state.selection;
    return { mobilePane, selection };
}

export default connect(mapStateToProps, actions)(MainFrame);
