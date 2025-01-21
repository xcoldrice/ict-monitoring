import React from 'react';
import { useParams } from 'react-router-dom';

function Radar() {

    let { name } = useParams();

    return name;

}

export default Radar;