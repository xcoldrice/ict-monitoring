import axios from 'axios';
import React,{createContext,useEffect,useContext,useReducer} from 'react';
import { ACTIONS } from './AppContext';
import { useToasts } from 'react-toast-notifications';

export const RadarContext = createContext();

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
                        return radar;
                    }
                    radar.data[payload.recipient][index] = payload;
                }
                return radar;
            });
            break;
        case ACTIONS.RADAR_STATUS_UPDATE:
            return radars.map(radar => {
                if(radar.name == payload.name && radar.category == payload.category) {
                    radar.status = payload.status;
                    radar.remarks = payload.remarks?? '';
                }
                return radar;
            })    
            break;
        case ACTIONS.RADAR_LOAD_ALL:
            return payload;
            break;
        default:
            return radars;
            break;
    }
}

export const RadarProvider = (props) => {

    let recipients = ['dic','ftp5','mdsi','pumis','asti','api'];
    let [radars, dispatch] = useReducer(reducer, []);

    let {addToast} = useToasts();

    const getRadars = async () => {
        await axios({ method: 'GET', url: '/radars' }).then((e) => {
            dispatch({type:ACTIONS.RADAR_LOAD_ALL,payload:e.data});
            addToast('Radars loaded!',{autoDismiss:true,appearance:'success'})
        }).catch((e) => {
            addToast('Error Loading Radars!',{appearance:'error',autoDismiss:true})
        })
        
    }
                                                
    useEffect(()=> getRadars() ,[]);

    useEffect(() => {
        try {
            window.ict_tool_echo.listen('PublishRadar', (e) => {
                dispatch({type:ACTIONS.RADAR_DATA_UPDATE,payload:e.data});
                $(`.${e.data.class}`).fadeOut().fadeIn();
            })
            window.ict_tool_echo.listen('UpdateRadarStatus',(s)=>{
                dispatch({type:ACTIONS.RADAR_STATUS_UPDATE,payload:s.data});
                addToast('Radar Status Updated!',{autoDismiss:true,appearance:'success'});
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
