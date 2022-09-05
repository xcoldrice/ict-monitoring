import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col} from 'react-bootstrap';
import { ACTIONS } from '../contexts/AppContext';
import { useToasts } from 'react-toast-notifications';

function ModelFormModal(props) {

    let { showModal, setShowModal, dispatch } = props;

    let [data, setData] = useState({
        name:'',
        category:'',
        status:0,
    });
 
    let categories = [
        'api',
        'data',
        'database',
        'ftp',
        'page',
        'receiver'
    ];

    let {addToast} = useToasts();


    const close_modal = () => {
        setShowModal(false);
        setData(pre => ({...pre, name:'',category:'', status:0}));
    }


    const handle_save = (e) => {       
        let form = e.currentTarget; 
        e.preventDefault();
        e.stopPropagation();

        if(!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        dispatch({type:ACTIONS.MODEL_ADD, payload:data});

        addToast('Added New Model!',{autoDismiss:true,appearance:'success'});

        close_modal();
    }

    const modal_change =(e) => {
        let key = e.target.name,
            value = e.target.value;

        setData((pre)=>({...pre,[key]:value}));
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
                    <Col >
                        <Form.Group className="mb-3">
                            <Form.Label>Model Name</Form.Label>
                            <Form.Control 
                                type='text' 
                                name='name' 
                                onChange={(e)=> modal_change(e)} 
                                value={data.name} 
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        < Form.Group className='mb-3'>
                            <Form.Label>Category</Form.Label>
                            <Form.Select 
                                name='category' 
                                onChange={(e)=> modal_change(e)} 
                                value={data.category} 
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
                </Row>
                <Button type='submit' variant='primary'>Save</Button>
            </Form>
        </Modal.Body>
    </Modal>
    )
}

export default ModelFormModal;