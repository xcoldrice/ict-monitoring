import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useToasts } from "react-toast-notifications";

let defaultRemark = { title : "remark", description : "", priority_level : "low" };

function RemarksModal(props) {

    const { addToast } = useToasts();
    const [remark, setRemark] = useState(defaultRemark);

    let {selectedRadar, selectedRemark, setSelectedRemark, show, setShow} = props;

    let isUpdating = Object.keys(selectedRemark).length > 0;

    const handle_on_hide = () => {

        setSelectedRemark({});

        setRemark(defaultRemark);

        setShow(false);
    }

    const handle_save_click = async (event) => {
        event.preventDefault();

        let url = "/remarks";

        let data = new FormData();
        data.append("radar_id", selectedRadar.id);
        data.append("title", remark.title);
        data.append("description", remark.description);
        data.append("priority_level", remark.priority_level);

        if(isUpdating) {
            data.append("_method", "put");
            data.append("type", "update");
            url = `/remarks/${selectedRemark.id}`;
        }
    
        await axios({ method: "POST", url, data })
            .then((response) => {

                if (response.data.success) return;

                // addToast("Error Updating Radar Status!", { autoDismiss: true, appearance: "error" });
            })
            .catch((error) => {

                addToast("Error Creating Remarks!", { autoDismiss: true, appearance: "error"});
                
            });

        handle_on_hide();
    }   

    useEffect(() => {
        if(isUpdating) {

            let {title, description, priority_level} = selectedRemark;

            let radar_id = selectedRadar.id;

            description = description ?? "";

            setRemark({
                radar_id, 
                title, 
                description, 
                priority_level
            });

        }
    }, [selectedRemark]);

    return <>
        <Modal show={show} onHide={e => handle_on_hide()}>
        <   Modal.Header closeButton>
                <Modal.Title>add remarks for {selectedRadar.name} {selectedRadar.category}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col lg="12">
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control 
                                type='text'
                                value={remark.title}
                                onChange={e => setRemark((pre) => ({...pre, title:e.target.value}))}
                            />
                        </Form.Group>
                    </Col>
                    <Col lg="12">
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <textarea 
                                className='form-control' 
                                rows={3}
                                value={remark.description}
                                onChange={e => setRemark((pre) => ({...pre, description:e.target.value}))}
                            />
                        </Form.Group>
                    </Col>
                    <Col lg="12">
                        <Form.Group>
                            <Form.Label>Priority Level</Form.Label>
                            <Form.Select
                                value={remark.priority_level}
                                onChange={e => setRemark((pre) => ({...pre, priority_level:e.target.value}))}
                            >
                                {["low", "high"].map((p) => <option key={p} value={p}>{p}</option>)}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button size='sm' variant='success' onClick={e => handle_save_click(e)}>Save</Button>
                <Button size='sm' variant='danger' onClick={e => handle_on_hide()}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    </>
} 

export default RemarksModal;