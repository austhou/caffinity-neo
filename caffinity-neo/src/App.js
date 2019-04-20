import React, { Component } from 'react';
import firebase from 'firebase';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';


import reducers from './redux/reducers';

import './App.css';
import List from './components/List';
import MapWrapper from './components/MapWrapper';
import LeftNav from './components/LeftNav';
import MainFrame from './components/MainFrame';

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
                <MainFrame />
            </Provider>
        );
    }
}

export default App;
