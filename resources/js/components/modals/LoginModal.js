import React from 'react';
import {Modal,Button,Form}from 'react-bootstrap';

function Login ({show,setShow}) {

    return <>
            <Modal show={show} onHide={()=>setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title className='text-capitalize'>Log in</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={()=>setShow(false)}>Close</Button>
                  <Button variant="primary" onClick={()=>console.log('asd')}>Log in</Button>
                </Modal.Footer>
            </Modal>
    </>

}

export default Login;