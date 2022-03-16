import { defaultsDeep, map } from 'lodash';
import React, { useContext } from 'react';
import { Row,Col, Table } from 'react-bootstrap';
import { render } from 'react-dom';
import Icon from '../layouts/Icon';
import {WeatherStationContext} from './../contexts/WeatherStationContext';

function WeatherStations() {

    let {dataset} = useContext(WeatherStationContext);

    const render_icons = (values) => {
        return <Icon {...values}/>
    }

    const render_fields = () => {
        let aws = [];
        let arg = [];

        dataset.forEach((element,key) => {
            let  {time ,type , file } = element;
            let icon = <Icon {...{time,type,file,key}} />
            
            if(element.station == 'aws') aws.push(icon);
            if(element.station == 'arg') arg.push(icon);

        });

        return <>
                    <td>{aws}</td>
                    <td>{arg}</td>
                </>

    }

    return (
            <Row>
                <Col>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th className='text-center'>aws</th>
                            <th className='text-center'>arg</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {render_fields()}
                        </tr>
                    </tbody>
                </Table>
                </Col>
            </Row>
    );
}

export default WeatherStations;