import React, { useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useToasts } from "react-toast-notifications";

function RadarStatusModal(props) {

    const { addToast } = useToasts();

    let {selectedRadar, setSelectedRadar, show, setShow} = props;

    let selectedType = selectedRadar.type == "radar" ? 'status' : selectedRadar.type;
    console.log(selectedType)
    const handle_click = async (event) => {

        event.preventDefault();

        let data = new FormData();

        data.append("radar_id", selectedRadar.id);
        data.append("name", selectedRadar.name);
        data.append("category", selectedRadar.category);
        data.append("type", selectedRadar.type);
        data.append("status", selectedRadar[selectedType].status);
        data.append("description", selectedRadar[selectedType].description);

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
                <Modal.Title>
                    {(`update ${selectedRadar.name} ${selectedRadar.category} ${selectedRadar.type} status`).toUpperCase()}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col lg="12">
                    <Form.Group>
                        <Form.Label>Status</Form.Label>
                        <Form.Select 
                            className='form-select'
                            value={selectedRadar[selectedType]?.status ?? "active"}
                            onChange={(e) => setSelectedRadar(pre => ({
                                ...pre,
                                [selectedType]:{
                                    ...pre[selectedType],
                                    status:e.target.value
                                }
                            }))}
                        >
                            {["active", "warning", "down", "under_development"].map((st) => 
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
                                value={selectedRadar[selectedType]?.description ?? ""}
                                onChange={e => setSelectedRadar(pre => ({
                                    ...pre,
                                    [selectedType]:{
                                        ...pre[selectedType],
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