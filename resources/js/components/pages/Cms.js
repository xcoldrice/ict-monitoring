import React, {useContext, useState} from 'react';
import { Badge, Button, Col, Row, Table } from 'react-bootstrap';
import ModelFormModal from '../modals/ModelFormModal';
import { CacheModelContext } from '../contexts/CacheModelContext';


function Cms() {

    let {models, dispatch} = useContext(CacheModelContext);

    let [showModal, setShowModal] = useState(false);

    const render_status = (status) => {
        let bg = 'success';  
        return <Badge bg={bg}>ok</Badge>  
    }

    return <Row>
        <Col>
            <ModelFormModal 
                showModal={showModal} 
                setShowModal={setShowModal} 
                dispatch={dispatch} 
            />
            <h4>
                <Badge bg="light" text="success">PAGASA CMS Data</Badge>
            </h4>
            <Table bordered hover striped responsive size='sm'>
                <thead>
                    <tr>
                        <th>
                            Model
                            <Button 
                                className='mx-2' 
                                variant='primary' 
                                type='button' 
                                size='sm' 
                                onClick={()=>setShowModal(true)}
                            >
                                Add Model
                            </Button>
                        </th>
                        <th>Category</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {models.map((model, index)=> {
                        return <tr key={index}>
                            <td>{model.name}</td>
                            <td className='text-capitalize'>{model.category}</td>
                            <td>{render_status(model.status)}</td>
                        </tr>
                    })}
                </tbody>
            </Table>
        </Col>
    </Row>
}

export default Cms;
