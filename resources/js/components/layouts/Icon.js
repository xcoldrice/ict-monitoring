import React, { useContext, useEffect} from 'react';
import { Badge, OverlayTrigger, Popover } from 'react-bootstrap';
import { AppContext } from './../contexts/AppContext';


const months = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ];

const badge_color = (diff,offset) => {
    let one_hour = 60 * 60 * 1000;
        offset = offset.interval + offset.threshold;
    if (diff > (one_hour + offset)) {
        return 'danger';
    }else if(diff > offset) {
        return 'warning';
    }else{
        return 'success';
    }
} 

const parse_date = (dt) => {
    let hours = dt.getHours();
        // hours = hours % 12;
    var AMPM = hours >= 12 ? "PM":"AM";
    hours = (hours % 12) || 12;
    return `${months[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()} ${hours}:${(dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes()} ${AMPM}`;
}

const calculate_time_difference = (timeNow, fileTime,file,offset) => {
    let start = new Date(fileTime),
        end = new Date((timeNow));
    let diff = end.getTime() - start.getTime();
    let date = parse_date(start);
    let popover = <Popover style={{maxWidth:'500px'}}>
                        <Popover.Body>
                            {file} <br/> {date}
                        </Popover.Body>
                </Popover>



    return {
                badge_color : badge_color(diff,offset),
                popover
        }
}

function Icon(props) {

    let {UNIXNOW, OFFSETS} = useContext(AppContext),
        {file,time,type,category} = props;
    let offset = OFFSETS[category]?? OFFSETS.default;
    let compute = calculate_time_difference(UNIXNOW,time,file,offset);
    let style = {
        margin:'0px 2px',
    }
    
    return <>
        <OverlayTrigger placement="auto" overlay={compute.popover}>
            <Badge style={style} bg={compute.badge_color}>{type}</Badge>
        </OverlayTrigger>
    </>
}

export default Icon;