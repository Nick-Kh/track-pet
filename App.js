import React from 'react';
import SwitchNavigator from './navigation/SwitchNavigator.js';
import reducer from './reducers';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import firebase from './config/firebase';
const middleware = applyMiddleware(thunkMiddleware, logger);
const store = createStore(reducer, middleware);
// console.disableYellowBox = true;

export default class App extends React.Component {
  render() {
    return (
    	<Provider store={store}>
      	<SwitchNavigator/>
      </Provider>
    );
  }
}
