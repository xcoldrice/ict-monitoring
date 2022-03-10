import React, { useContext, useEffect} from 'react';
import { Badge, OverlayTrigger, Popover } from 'react-bootstrap';
import { AppContext } from './../contexts/AppContext';

const five_minutes = 5*60*1000;
const ten_minutes = 10*60*1000;
const fifteen_minutes = 15*60*1000;
const one_hour = 60 * 60 * 1000;
let interval = fifteen_minutes;
let threshold = five_minutes;
let offset = interval + threshold;
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const badge_color = (diff) => {
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

const calculate_time_difference = (timeNow, fileTime,file) => {
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
                badge_color : badge_color(diff),
                popover
        }
}

function Icon(props) {

    let {UNIXNOW} = useContext(AppContext),
        {file,time,type} = props;
        
    let compute = calculate_time_difference(UNIXNOW,time,file);
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