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
            let tmp = [...radars];
            let {status,category,name, remarks} = payload;

            let index = tmp.findIndex((t)=>(t.name == name && t.category == category));
            if(tmp[index].status == status) {
                tmp[index].remarks = remarks?? '';

                return tmp;
            }
            
            let tmpRemoved = tmp.splice(index,1)[0];
                tmpRemoved.status = status;
                tmpRemoved.remarks = remarks?? '';
            let lastIndexOfActive = tmp.map(r=>r.status).lastIndexOf(1);

            let lastStatusIndex = tmp.map(r => r.status).lastIndexOf(status);
                lastStatusIndex = lastStatusIndex + 1;
                
            if(status == 1) {
                lastStatusIndex = lastStatusIndex - 1;
            }

            if(lastStatusIndex == 0) {
                lastStatusIndex = lastIndexOfActive + 1; 
            }

            tmp.splice(lastStatusIndex,0,tmpRemoved);

            return tmp;

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

    let recipients = ['dic','ftp5','mdsi','api'];
    let [radars, dispatch] = useReducer(reducer, []);

    let {addToast} = useToasts();

    const getRadars = async () => {
        await axios({ method: 'GET', url: '/radars' }).then(response => {
            dispatch({type:ACTIONS.RADAR_LOAD_ALL, payload:response.data});
            addToast('Radars loaded!',{autoDismiss:true,appearance:'success'})
        }).catch(() => {
            addToast('Error Loading Radars!',{appearance:'error', autoDismiss:true})
        })
        
    }
                                                
    useEffect(()=> getRadars() ,[]);

    useEffect(() => {
        try {
            window.ict_tool_echo.listen('PublishRadar', event => {
                dispatch({type:ACTIONS.RADAR_DATA_UPDATE, payload:event.data});
            })
            window.ict_tool_echo.listen('UpdateRadarStatus', event =>{
                dispatch({type:ACTIONS.RADAR_STATUS_UPDATE, payload:event.data});
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
