import React, { createContext, useEffect, useReducer } from "react";
import { useToasts } from "react-toast-notifications";
import { ACTIONS } from "./AppContext";

export const WeatherStationContext = createContext();

const reducer = (dataset, action) => {
    let { payload, type } = action,
        index = dataset.findIndex(({ type }) => type == payload.type);

    switch (type) {
        case ACTIONS.WEATHER_STATION_LOAD_ALL:
            return payload;
        case ACTIONS.UPDATE_STATION_DATA:
            if (index < 0) {
                dataset.push(payload);
                return dataset;
            }

            dataset[index].time = payload.time;

            return dataset;
        default:
            return dataset;
    }
};

export const WeatherStationProvider = (props) => {
    let [dataset, dispatch] = useReducer(reducer, []);

    const { addToast } = useToasts();

    const getDataSet = async () => {
        await axios({ method: "GET", url: "/weather-stations" })
            .then((response) => {
                dispatch({
                    type: ACTIONS.WEATHER_STATION_LOAD_ALL,
                    payload: response.data,
                });
                addToast("Weather Stations Loaded!", {
                    autoDismiss: true,
                    appearance: "success",
                });
            })
            .catch(() => {
                addToast("Error Loading Weather Stations!", {
                    autoDismiss: true,
                    appearance: "error",
                });
            });
    };

    useEffect(() => getDataSet(), []);

    useEffect(() => {
        try {
            window.ict_tool_echo.listen("PublishWeatherStation", (event) => {
                dispatch({
                    type: ACTIONS.UPDATE_STATION_DATA,
                    payload: event.data,
                });
            });
        } catch (error) {}
        return () => {
            window.ict_tool_echo.stopListening("PublishWeatherStation");
        };
    });

    return (
        <WeatherStationContext.Provider value={{ dataset }}>
            {props.children}
        </WeatherStationContext.Provider>
    );
};
