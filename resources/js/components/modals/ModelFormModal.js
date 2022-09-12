import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col} from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';
import axios from 'axios';

function ModelFormModal(props) {
    const {addToast} = useToasts();

    let { showModal, setShowModal, model, setModel} = props;

    let categories = [
        'api',
        'data',
        'database',
        'ftp',
        'page',
        'receiver'
    ];


    const close_modal = () => {
        setShowModal(false);
        setModel(pre => ({
            ...pre, 
            id:null, 
            name:'',
            category:'', 
            status:2, 
            remarks:"", 
            edit:false
        }));
    }

    const modal_change =(e) => {
        let key = e.target.name,
            value = e.target.value;
        setModel((pre)=>({...pre,[key]:value}));
    }

    const handle_save = async (e) => {
        let form = e.currentTarget;
            e.preventDefault();
            e.stopPropagation();

        if(!form.checkValidity()) {
            form.reportValidity();
            return;
        }   

        let data = new FormData();
            data.append('id', model.id);
            data.append('name', model.name);
            data.append('category', model.category)
            data.append('status', model.status);
            data.append('remarks', model.remarks);

        await axios({method:'POST', url:'/models', data})
        .then(response => {
            if(response.data.success) return;        
            addToast('Error Adding new Model!',{autoDismiss:true,appearance:'error'});
        })  
        .catch(error => {
            addToast('Error Adding new Model!',{autoDismiss:true,appearance:'error'});
        });

        close_modal();
    }


    return (<Modal show={showModal} onHide={()=>{close_modal()}} size="lg">
        <Modal.Header closeButton>
            <Modal.Title>
                Add Model
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form noValidate onSubmit={(e)=>handle_save(e)}>
                <Row>
                    <Col xl="12">
                        <Form.Group className="mb-3">
                            <Form.Label>Model Name</Form.Label>
                            <Form.Control 
                                type='text' 
                                name='name' 
                                onChange={(e)=> modal_change(e)} 
                                value={model.name}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col xl="12">
                        < Form.Group className='mb-3'>
                            <Form.Label>Category</Form.Label>
                            <Form.Select 
                                name='category' 
                                onChange={(e)=> modal_change(e)} 
                                value={model.category}
                                required
                            >
                                <option disabled value="">Select Category</option>
                                {categories.map((category,index) => {
                                    return <option key={index} value={category}>
                                            {category}
                                    </option>
                                })}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    {model.edit && 
                        <Col xl="12">
                            < Form.Group className='mb-3'>
                                <Form.Label>Status</Form.Label>
                                <Form.Select 
                                    name='status' 
                                    onChange={(e)=> modal_change(e)} 
                                    value={model.status}
                                >
                                    <option disabled value="">Select status</option>
                                    <option value="1">active</option>
                                    <option value="0">down</option>
                                    <option value="2">under development</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Remarks</Form.Label>
                                <Form.Control 
                                    as='textarea' 
                                    name='remarks' 
                                    onChange={(e)=> modal_change(e)} 
                                    value={model.remarks}
                                />
                            </Form.Group>
                        </Col>
                    }
                </Row>
                <Button type='submit' variant='primary'>Save</Button>
            </Form>
        </Modal.Body>
    </Modal>
    )
}

export default ModelFormModal;