import React, { useContext } from 'react';
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { AppContext } from './../contexts/AppContext';

const five_minutes = 5*60*1000;
const ten_minutes = 10*60*1000;

const badge_color = (time) => {
    if(time < five_minutes) {
        return 'success';
    }else if ((time > five_minutes) && (time < ten_minutes)){
        return 'warning'
    }
    return 'danger';
} 

const get_time_difference = (now, fileTime) => {
    return now - fileTime;
}

function tooltip(file) {
    <Tooltip>
        {file}
  </Tooltip>

}


function Icon({children,file,time}) {
    let {UNIXNOW} = useContext(AppContext);

    let timeDiff = get_time_difference(UNIXNOW,time);

    return <>
        <OverlayTrigger placement="right" delay={{ show: 100, hide: 500 }} overlay={<Tooltip>{file}</Tooltip>}>
            <Badge bg={badge_color(timeDiff)}>{children}</Badge>
        </OverlayTrigger>
    </>
    

    // return <span data-toggle="tooltip" data-placement="auto" title={file} className={`badge ${badge_color(timeDiff)} mx-1`}>{children}</span>
}

export default Icon;