import React from 'react';
import ReactDOM from 'react-dom/client'; // Import createRoot
import { Provider } from 'react-redux';
import { store } from './redux/store'; // Redux store
import App from './App';
import './index.css'; // Global styles
import { checkForAutoLogout } from './redux/slices/loginSlice'; // Import the function

// Call auto-logout check after the store has been created
checkForAutoLogout();

// Use createRoot for rendering
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
