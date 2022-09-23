import axios from 'axios';
import React, {createContext, useEffect, useReducer} from 'react';
import {ACTIONS} from './AppContext';
import {useToasts} from 'react-toast-notifications';

export const RadarContext = createContext();

const reducer = (radars,action) => {
    let payload = action.payload,
        {status, category, name, remarks, type, recipient} = payload;

    switch (action.type) {
        case ACTIONS.RADAR_DATA_UPDATE:
            return radars.map(radar => {
                if(radar.name == name && radar.category == category) {
                    if(!radar.data[recipient]) radar.data[recipient] = [];
                    
                    let index = radar.data[recipient].findIndex(d => (
                        d.type == type
                    ));

                    if(index < 0) {
                        radar.data[recipient].push(payload);

                        return radar;
                    }

                    radar.data[recipient][index] = payload;
                }

                return radar;
            });
        case ACTIONS.RADAR_STATUS_UPDATE:
            let tmp = [...radars],
                index = tmp.findIndex(t => (
                    t.name == name && t.category == category
                ));

            if(tmp[index].status == status) {
                tmp[index].remarks = remarks?? '';

                return tmp;
            }

            let removed = tmp.splice(index,1)[0];
                removed.status = status;
                removed.remarks = remarks?? '';

            let statusIndex = tmp.map(r => {
                if(r.category != 'mosaic') return r.status;
            }).lastIndexOf(status);
            
            let mosIndex = tmp.findIndex(r => r.category == 'mosaic');

            if(statusIndex < 0) {
                if(status == 1) {
                    tmp.unshift(removed);
                    return tmp;
                }

                if(status == 3 && mosIndex > 0) statusIndex =  mosIndex - 1;

                if(status == 0) statusIndex = mosIndex;

                if(status == 2) statusIndex = tmp.length;
            }
            statusIndex = statusIndex + 1;
            tmp.splice(statusIndex,0,removed);

            return tmp;
        case ACTIONS.RADAR_LOAD_ALL:
            return payload;
        default:
            return radars;
    }
}

export const RadarProvider = (props) => {

    let recipients = [
        'dic',
        'ftp5',
        'mdsi',
        'api'
    ];

    let [radars, dispatch] = useReducer(reducer,[]);

    let {addToast} = useToasts();

    const getRadars = async () => {
        await axios({method:'GET', url:'/radars'}).then(response => {
            dispatch({
                type:ACTIONS.RADAR_LOAD_ALL, 
                payload:response.data
            });

            addToast('Radars loaded!',{
                autoDismiss:true,
                appearance:'success'
            });
        }).catch(() => {
            addToast('Error Loading Radars!',{
                appearance:'error', 
                autoDismiss:true
            })
        })
        
    }
                                          
    useEffect(()=> getRadars(),[]);

    useEffect(() => {
        try {
            window.ict_tool_echo.listen('PublishRadar', event => {
                dispatch({
                    type:ACTIONS.RADAR_DATA_UPDATE, 
                    payload:event.data
                });
            })
            window.ict_tool_echo.listen('UpdateRadarStatus', event =>{
                dispatch({
                    type:ACTIONS.RADAR_STATUS_UPDATE, 
                    payload:event.data
                });

                addToast('Radar Status Updated!',{
                    autoDismiss:true,
                    appearance:'success'
                });
            });
        } catch (error) {
        }
        return () => {
            window.ict_tool_echo.stopListening('PublishRadar');
            window.ict_tool_echo.stopListening('UpdateRadarStatus');
        }
    });

    return <RadarContext.Provider value={{radars, recipients, dispatch}}>
        {props.children}
    </RadarContext.Provider>
}
