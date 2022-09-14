import axios from 'axios';
import React,{createContext, useEffect, useReducer} from 'react';
import { ACTIONS } from './AppContext';
import { useToasts } from 'react-toast-notifications';

export const RadarContext = createContext();

const reducer = (radars,action) => {
    let payload = action.payload,
        {status, category, name, remarks, type, recipient} = payload;

    switch (action.type) {
        case ACTIONS.RADAR_DATA_UPDATE:
            return radars.map((radar)=>{
                if(radar.name == name && radar.category == category) {
                    if(!radar.data[recipient]) {
                        radar.data[recipient] = [];
                    }
                    let index = radar.data[recipient].findIndex((d)=> d.type == type);

                    if(index < 0) {
                        radar.data[recipient].push(payload);
                        return radar;
                    }
                    radar.data[recipient][index] = payload;
                }
                return radar;
            });
            break;
        case ACTIONS.RADAR_STATUS_UPDATE:
            let tmp = [...radars];
            let index = tmp.findIndex((t)=>(t.name == name && t.category == category));
            if(tmp[index].status == status) {
                tmp[index].remarks = remarks?? '';
                return tmp;
            }



            let tmpRemoved = tmp.splice(index,1)[0];
                tmpRemoved.status = status;
                tmpRemoved.remarks = remarks?? '';

            let lastStatusIndex = tmp.map(r => {
                if(r.category != 'mosaic') {
                    return r.status;
                }    
            }).lastIndexOf(status);
            
            let mosaicIndex = tmp.findIndex(r => r.category == 'mosaic');

            if(lastStatusIndex < 0) {
                if(status == 1) {
                    tmp.unshift(tmpRemoved);
                    return tmp;
                }

                if(status == 3 && mosaicIndex > 0) {
                    lastStatusIndex =  mosaicIndex - 1;
                }

                if(status == 0) {
                    lastStatusIndex = mosaicIndex;
                }

                if(status == 2) {
                    lastStatusIndex = tmp.length;
                }
            }

            lastStatusIndex = lastStatusIndex + 1;
            console.log(lastStatusIndex);
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
