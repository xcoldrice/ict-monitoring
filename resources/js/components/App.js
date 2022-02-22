import React,{useContext} from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Container } from 'react-bootstrap';
import { AppProvider } from './contexts/AppContext';
import Menu from './layouts/Menu';

function App() {
    return (
        <AppProvider>
            <Container fluid>
                <Menu/>
            </Container>
        </AppProvider>
    );
}

export default App;

if (document.getElementById('root')) {
    ReactDOM.render(<App />, document.getElementById('root'));
}