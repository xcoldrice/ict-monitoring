import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import ReactDOM from "react-dom";
import { AppProvider } from "./contexts/AppContext";
import Menu from "./layouts/Menu";

function App() {
    return (
        <Container fluid>
            <AppProvider>
                <Row>
                    <Col>
                        <Menu />
                    </Col>
                </Row>
            </AppProvider>
        </Container>
    );
}

export default App;

if (document.getElementById("root")) {
    ReactDOM.render(<App />, document.getElementById("root"));
}
