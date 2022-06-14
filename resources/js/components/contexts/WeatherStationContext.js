import React, { createContext, useReducer, useEffect } from 'react';
import { ACTIONS } from './AppContext';
import { useToasts } from 'react-toast-notifications';

export const WeatherStationContext = createContext();

const reducer = (dataset, action) => {
    let {payload, type} = action;
    switch(type) {
        case ACTIONS.WEATHER_STATION_LOAD_ALL:
            return payload;
            break;
        case ACTIONS.UPDATE_STATION_DATA:
            let temp = [...dataset],
                index = temp.findIndex(data => data.type == payload.type);
            if(index < 0) {
                temp.push(payload);
                return temp;
            }

            temp[index].time = payload.time; 
            
            return temp;
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
        await axios({ method: 'GET', url: '/weather-stations' }).then(response => {
            dispatch({type:ACTIONS.WEATHER_STATION_LOAD_ALL, payload:response.data});
            addToast('Weather Stations Loaded!',{autoDismiss:true, appearance:'success'})
        }).catch(() => {
            addToast('Error Loading Weather Stations!',{autoDismiss:true,appearance:'error'});
        })
        
    }



    useEffect(() => getDataSet() ,[]);

    useEffect(() => {
        try {
            window.ict_tool_echo.listen('PublishWeatherStation', event => {
                dispatch({type:ACTIONS.UPDATE_STATION_DATA,payload: event.data});
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
