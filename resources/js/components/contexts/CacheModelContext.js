import axios from "axios";
import React, { createContext, useEffect, useReducer } from "react";
import { useToasts } from "react-toast-notifications";
import { ACTIONS } from "./AppContext";

export const CacheModelContext = createContext();

const reducer = (models, action) => {
    let payload = action.payload;

    switch (action.type) {
        case ACTIONS.MODEL_LOAD_ALL:
            return payload;
        case ACTIONS.MODEL_ADD:
            return [...models, payload];
        case ACTIONS.MODEL_UPDATE:
            let index = models.findIndex((model) => model.id == payload.id);
            models[index] = payload;

            return models;
        default:
            return models;
    }
};

export const CacheModelProvider = (props) => {
    let { addToast } = useToasts();

    let [models, dispatch] = useReducer(reducer, []);

    const getModels = async () => {
        await axios({ method: "GET", url: "/models" })
            .then((response) => {
                dispatch({
                    type: ACTIONS.MODEL_LOAD_ALL,
                    payload: response.data,
                });

                addToast("Models loaded!", {
                    autoDismiss: true,
                    appearance: "success",
                });
            })
            .catch((error) => {
                addToast("Error loading Models!", {
                    autoDismiss: true,
                    appearance: "error",
                });
            });
    };

    useEffect(() => getModels(), []);

    useEffect(() => {
        try {
            window.ict_tool_echo.listen("AddNewModel", (event) => {
                let message = "New Model Added!",
                    action = ACTIONS.MODEL_ADD;

                if (event.data.type == "update") {
                    message = "Model Updated!";
                    action = ACTIONS.MODEL_UPDATE;
                }

                dispatch({
                    type: action,
                    payload: event.data.data,
                });

                addToast(message, {
                    autoDismiss: true,
                    appearance: "success",
                });
            });
        } catch (error) {}
        return () => {
            window.ict_tool_echo.stopListening("AddNewModel");
        };
    });

    return (
        <CacheModelContext.Provider value={{ models }}>
            {props.children}
        </CacheModelContext.Provider>
    );
};
