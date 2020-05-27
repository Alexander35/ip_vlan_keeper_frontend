import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import IpVlanKeeperFrontend from './components/IpVlanKeeperFrontend';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import rootReducer from './app/reducers'

const store = createStore(rootReducer)

ReactDOM.render(
  <React.StrictMode>
  		<Provider store={store}>
			<IpVlanKeeperFrontend />
		</Provider>,
  </React.StrictMode>,
  document.getElementById('root')
);
