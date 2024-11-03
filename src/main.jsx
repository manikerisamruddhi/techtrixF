import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store'; // Redux store
import App from './App';
import './index.css'; // Global styles
import { checkForAutoLogout } from '../src/redux/slices/loginSlice' // Import the function

// Call auto-logout check after the store has been created
checkForAutoLogout();

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
