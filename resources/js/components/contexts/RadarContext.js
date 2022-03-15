import axios from 'axios';
import React,{createContext,useEffect,useState,useReducer} from 'react';
import { Modal,Button } from 'react-bootstrap';

export const RadarContext = createContext();
export const ACTIONS = {
    RADAR_DATA_UPDATE: 'radar-data-update',
    RADAR_STATUS_UPDATE:'radar-status-update',
    RADAR_LOAD_ALL : 'radar-load-all',
}

const reducer = (radars,action) => {
    let payload = action.payload;
    switch (action.type) {
        case ACTIONS.RADAR_DATA_UPDATE:
            return radars.map((radar)=>{
                if(radar.name == payload.name && radar.category == payload.category) {
                    if(!radar.data[payload.recipient]) {
                        radar.data[payload.recipient] = [];
                    }
                    let index = radar.data[payload.recipient].findIndex((d)=> d.type == payload.type);

                    if(index < 0) {
                        radar.data[payload.recipient].push(payload);
                    }else {
                        radar.data[payload.recipient][index] = payload;
                    }
                    return radar;

                }else {
                    return radar;
                }
            });
            break;
        case ACTIONS.RADAR_STATUS_UPDATE:
            return radars.map(radar => {
                if(radar.name == payload.name && radar.category == payload.category) {
                    radar.status = payload.status;
                    radar.remarks = payload.remarks?? '';
                    return radar;
                }else{
                    return radar;
                }
            })    
            break;
        case ACTIONS.RADAR_LOAD_ALL:
            radars = payload;
            return radars;
            break;
        default:
            return radars;
            break;
    }
}

export const RadarProvider = (props) => {

    let recipients = ['dic','ftp5','mdsi','pumis','asti','api'];
    let [radars, dispatch] = useReducer(reducer, []);

    const getRadars = async () => {
        await axios({ method: 'GET', url: '/radars' }).then((e) => {
            dispatch({type:ACTIONS.RADAR_LOAD_ALL,payload:e.data});
            console.log('RADARS LOADED!')
        }).catch((e) => {
            console.log('ERROR LOADING RADARS!')
        })
        
    }
                                                
    useEffect(()=> getRadars() ,[]);

    useEffect(() => {
        try {
            window.ict_tool_echo.listen('PublishRadar', (e) => {
                console.log(e.data);
                dispatch({type:ACTIONS.RADAR_DATA_UPDATE,payload:e.data});
            })
            window.ict_tool_echo.listen('UpdateRadarStatus',(s)=>{
                dispatch({type:ACTIONS.RADAR_STATUS_UPDATE,payload:s.data});
            });
        } catch (error) {
        }
        return () => {
            window.ict_tool_echo.stopListening('PublishRadar');
            window.ict_tool_echo.stopListening('UpdateRadarStatus');
        }
    });

    let values = {
                radars,
                recipients,
                dispatch,
    };

    return (
        <RadarContext.Provider value={values}>
            {props.children}
        </RadarContext.Provider>
    );
}
