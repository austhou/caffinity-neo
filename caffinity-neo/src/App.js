import React, { Component } from 'react';
import firebase from 'firebase';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';


import reducers from './redux/reducers';

import logo from './logo.svg';
import './App.css';
import List from './components/List';

import banner from './assets/banner.svg';
import MapWrapper from './components/MapWrapper';

class App extends Component {

  componentWillMount() {
    const config = {
        apiKey: "AIzaSyBRw1I9CcdfqHRcZSCyLXMRAmGihSH9mco",
        authDomain: "coffee-49b01.firebaseapp.com",
        databaseURL: "https://coffee-49b01.firebaseio.com",
        projectId: "coffee-49b01",
        storageBucket: "coffee-49b01.appspot.com",
        messagingSenderId: "779895610961"
    };
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    
    document.title = 'caffinity - your cafe grind resource'
    

    }

    render() {
        return (
            <Provider store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}>
                <div className="App">
                    <div style={{width: '50%'}}>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',width: '100%'}}>
                            <img src={banner} width="200" style={{marginBottom: 16}} />
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <div 
                                    className="grayButton"
                                    style={{marginRight: 8}}
                                >
                                    CHANGE LOCATION
                                </div>
                                <div 
                                    className="itemButton"
                                    style={{marginRight: 8}}
                                >
                                    SUBMIT CAFE
                                </div>
                            </div>
                        </div>
                        
                        <div className="listContainer" style={{maxHeight: 'calc(100vh - 130px)', overflow: 'scroll', boxSizing: 'content-box'}} >
                            <List />
                        </div>
                    </div>
                    <div style={{width: 'calc(50% - 32px', marginLeft: 32}} >
                        <MapWrapper />
                    </div>
                </div>
            </Provider>
        );
    }
}

export default App;
