import React, { createContext, useReducer, useEffect } from 'react';
import { ACTIONS } from './AppContext';
import { useToasts } from 'react-toast-notifications';

export const WeatherStationContext = createContext();

const reducer = (dataset,action) => {
    let payload = action.payload;
    switch(action.type) {
        case ACTIONS.WEATHER_STATION_LOAD_ALL:
            dataset = payload;
            return dataset;
            break;
        case ACTIONS.UPDATE_STATION_DATA:
            let tmp = [...dataset],
                index = tmp.findIndex((d)=> d.type == payload.type);
            if(index < 0) {
                tmp.push(payload);
                return tmp;
            }

            tmp[index].time = payload.time; 
            
            return tmp;
            break;
        default:
            return dataset;
            break;
    }

}


export const WeatherStationProvider = (props) => { 

    let [dataset,dispatch] = useReducer(reducer,[]);
    const {addToast} = useToasts();

    const getDataSet = async () => {
        await axios({ method: 'GET', url: '/weather-stations' }).then((e) => {
            dispatch({type:ACTIONS.WEATHER_STATION_LOAD_ALL,payload:e.data});
            addToast('Weather Stations Loaded!',{autoDismiss:true,appearance:'success'})
        }).catch((e) => {
            addToast('Error Loading Weather Stations!',{autoDismiss:true,appearance:'error'});
        })
        
    }



    useEffect(()=> getDataSet() ,[]);

    useEffect(() => {
        try {
            window.ict_tool_echo.listen('PublishWeatherStation', (e) => {
                dispatch({type:ACTIONS.UPDATE_STATION_DATA,payload:e.data});
            })
        } catch (error) {
        }
        return () => {
            window.ict_tool_echo.stopListening('PublishWeatherStation');
        }
    });

    return (
        <WeatherStationContext.Provider value={{dataset}}>
                {props.children}
        </WeatherStationContext.Provider>
    );
}
