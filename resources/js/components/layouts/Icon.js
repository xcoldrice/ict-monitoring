import React, { useContext } from 'react';
import { Badge, OverlayTrigger, Popover } from 'react-bootstrap';
import { AppContext } from './../contexts/AppContext';
import Moment from 'react-moment';

const badge_color = (time, now, {interval, threshold}) => {

    let diff = ((new Date(now).getTime()) - (new Date(time).getTime()));

    let offset = interval + threshold;

    if(typeof time == 'object') return 'light';

    if(diff > ((60 * 60 * 1000) + offset)) return 'danger';

    if(diff > offset) return 'warning';

    return 'success';
} 

const render_popover = ({file, time, category}) => {
    let text = 'File: ';
    let timeDiff = '';
    let dataTime = 'No Data...';
    if(category == 'aws' || category == 'arg') {
        text = 'Site: '; 
    }

    if(typeof time === 'number') {
        dataTime = <Moment date={time} format="[Date:] MMMM DD, YYYY h:mm A"/>;
        timeDiff = <Moment fromNow date={time}/>;
    }

    return <Popover style={{maxWidth:'500px'}}>
                    <Popover.Body>
                        {text}{file}<br/>
                        {dataTime}<br/>
                        {timeDiff}
                    </Popover.Body>
            </Popover>
}

function Icon(props) {

    let {UNIXNOW, OFFSETS} = useContext(AppContext),
        {time,type,category} = props;

    let offset = OFFSETS[category]?? OFFSETS.default;
    let style = {};
        style.margin = '0px 2px';
    let textColor = 'secondary';

    if(typeof time === 'number') {
        textColor = 'light';
    }

    if(String(type).length < 4 && (category == 'aws' || category == 'arg')) {
        style.width = '43.20px';
    }

    return <>
        <OverlayTrigger placement="auto" overlay={render_popover(props)}>
            <Badge 
                className={props.class} 
                style={style} 
                bg={badge_color(time, UNIXNOW, offset)} 
                text={textColor}
            >
                {type}
            </Badge>
        </OverlayTrigger>
    </>
}

export default Icon;