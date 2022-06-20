import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Col} from 'react-bootstrap';
import { AppProvider } from './contexts/AppContext';
import Menu from './layouts/Menu';

function App() {
    return (
        <AppProvider>
            <Row>
                <Col>
                    <Menu/>
                </Col>
            </Row>
        </AppProvider>
    );
}

export default App;

if (document.getElementById('root')) {
    ReactDOM.render(<App />, document.getElementById('root'));
}