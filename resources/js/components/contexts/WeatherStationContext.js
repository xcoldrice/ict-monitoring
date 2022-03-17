import React, { createContext, useReducer, useEffect } from 'react';

export const WeatherStationContext = createContext();
export const ACTIONS = {
    WEATHER_STATION_LOAD_ALL : 'weather-station-load-all',
    UPDATE_STATION_DATA : 'update-station-data',
}

const reducer = (dataset,action) => {
    let payload = action.payload;
    switch(action.type) {
        case ACTIONS.WEATHER_STATION_LOAD_ALL:
            dataset = payload;
            return dataset;
            break;
        case ACTIONS.UPDATE_STATION_DATA:
            let tmp = [...dataset];
            let index = tmp.findIndex((d)=> d.type == payload.type);
            if(index < 0) {
                tmp.push(payload);
            }else {
                tmp[index].time = payload.time; 
            }
            return tmp;
            break;
        default:
            return dataset;
            break;
    }

}


export const WeatherStationProvider = (props) => { 

    let [dataset,dispatch] = useReducer(reducer,[]);

    const getDataSet = async () => {
        await axios({ method: 'GET', url: '/weather-stations' }).then((e) => {
            dispatch({type:ACTIONS.WEATHER_STATION_LOAD_ALL,payload:e.data});
            console.log('WEATHER STATIONS LOADED!')
        }).catch((e) => {
            console.log(e);
            console.log('ERROR LOADING WEATHER STATIONS!')
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
