import React, { useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useToasts } from "react-toast-notifications";

function RadarStatusModal(props) {

    const { addToast } = useToasts();

    let {selectedRadar, setSelectedRadar, show, setShow} = props;


    const handle_click = async (event) => {

        event.preventDefault();

        let data = new FormData();

        data.append("radar_id", selectedRadar.id);
        data.append("name", selectedRadar.name);
        data.append("category", selectedRadar.category);
        data.append("status", selectedRadar.status.status);
        data.append("description", selectedRadar.status.description);

        await axios({ method: "POST", url: "/radars", data })
            .then((response) => {

                if (response.data.success) return;

                // addToast("Error Updating Radar Status!", { autoDismiss: true, appearance: "error" });
            })
            .catch((error) => {

                addToast("Error Updating Radar Status!", { autoDismiss: true, appearance: "error"});
                
            });

        setShow(false);

    }

    return <>
        <Modal show={show} onHide={e => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>update {selectedRadar.name} {selectedRadar.category} status</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col lg="12">
                    <Form.Group>
                        <Form.Label>Status</Form.Label>
                        <Form.Select 
                            className='form-select'
                            value={selectedRadar.status?.status ?? "active"}
                            onChange={(e) => setSelectedRadar(pre => ({
                                ...pre,
                                status:{
                                    ...pre.status,
                                    status:e.target.value
                                }
                            }))}
                        >
                            {["active", "down", "under_development"].map((st) => 
                                <option key={st} value={st}>{st}</option>)
                            }
                        </Form.Select>
                    </Form.Group>

                    </Col>
                    <Col lg="12">
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <textarea 
                                rows={3}
                                className='form-control' 
                                value={selectedRadar.status?.description ?? ""}
                                onChange={e => setSelectedRadar(pre => ({
                                    ...pre,
                                    status:{
                                        ...pre.status,
                                        description:e.target.value
                                    }
                                }))}
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button size='sm' variant='success' onClick={e => handle_click(e)}>Save</Button>
                <Button size='sm' variant='danger' onClick={e => setShow(false)}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    </>
}

export default RadarStatusModal;