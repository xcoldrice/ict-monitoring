import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import { Container } from 'react-bootstrap';
import Menu from './layouts/Menu';

function App() {
    return (
        <Container fluid>
            <Menu/>
        </Container>
    );
}

export default App;

if (document.getElementById('root')) {
    ReactDOM.render(<App />, document.getElementById('root'));
}