import React,{createContext,useEffect,useState,useReducer} from 'react';
import { Modal,Button } from 'react-bootstrap';

export const RadarContext = createContext();
export const ACTIONS = {
    RADAR_DATA_UPDATE: 'radar-data-update',
    RADAR_STATUS_UPDATE:'radar-status-update',
}


const reducer = (radars,action) => {
    let payload = action.payload;
    switch (action.type) {
        case ACTIONS.RADAR_DATA_UPDATE:
            return radars.map((radar)=>{
                if(radar.name == payload.name) {
                    radar.data[payload.recipient] = radar.data[payload.recipient].map((d)=>{
                        if(d.type == payload.type) {
                            d.time = payload.time;
                            d.file = payload.file;
                            return d;
                        }else{
                            return d;
                        }
                    })
                    return radar;
                }else {
                    return radar;
                }
            });
            break;
        case ACTIONS.RADAR_STATUS_UPDATE:
            return radars.map(radar => {
                if(radar.name == payload.name) {
                    radar.status = payload.status;
                    radar.remarks = payload.remarks;
                    return radar;
                }else{
                    return radar;
                }
            })    
            break;
        default:
            return radars;
            break;
    }
}

export const RadarProvider = (props) => {

    let recipients = ['dic','ftp5','mdsi','pumis','asti','api'];
    let [radars, dispatch] = useReducer(reducer, [  
                                                    {
                                                        'name':'tagaytay',
                                                        'status':2,
                                                        'remarks':'asdasdasdasd',
                                                        'data':{
                                                            'dic':[
                                                                {'type':'z','time':1645511911839,'file':'test.jpg'}
                                                            ],
                                                            'ftp5':[],
                                                            'mdsi':[],
                                                            'pumis':[],
                                                            'asti':[],
                                                            'api':[],
                                                        }
                                                    }   
                                                ]);

    useEffect(() => {
        try {
            window.ict_tool_echo.listen('NewMessage', (e) => {
                console.log(e);

            });
        } catch (error) {
        }
        return () => {
            window.ict_tool_echo.stopListening('NewMessage');
        }
    });

    let values = {
                radars,
                recipients,
                dispatch
    };


    return (
        <RadarContext.Provider value={values}>
            {props.children}
        </RadarContext.Provider>
    );
}
