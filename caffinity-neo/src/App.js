import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';


import reducers from './redux/reducers';

import './App.css';
import MainFrame from './components/MainFrame';

class App extends Component {

    componentWillMount() {    
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
