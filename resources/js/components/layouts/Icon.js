import React, { useContext } from 'react';

import { AppContext } from './../contexts/AppContext';

const five_minutes = 5*60*1000;
const ten_minutes = 10*60*1000;

const badge_color = (time) => {
    if(time < five_minutes) {
        return 'bg-success';
    }else if ((time > five_minutes) && (time < ten_minutes)){
        return 'bg-warning'
    }
    return 'bg-danger';
} 

const get_time_difference = (now, fileTime) => {
    return now - fileTime;
}

function Icon({children,file,time}) {
    let {UNIXNOW} = useContext(AppContext);

    let timeDiff = get_time_difference(UNIXNOW,time);
    console.log(timeDiff / 1000 /60)
    return <span data-toggle="tooltip" data-placement="auto" title={file} className={`badge ${badge_color(timeDiff)}`}>{children}</span>
}

export default Icon;