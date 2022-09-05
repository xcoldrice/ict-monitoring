import React, { createContext, useEffect, useReducer } from 'react';
import { ACTIONS } from './AppContext';

export const CacheModelContext = createContext();

const reducer = (models, action) => {
    let payload = action.payload;
    switch (action.type) {
        case ACTIONS.MODEL_LOAD_ALL:
            return payload;
            break;
        case ACTIONS.MODEL_ADD:
            models = [...models, payload];
            return models;
            
            break
        default:
            break;
    }

}



export const CacheModelProvider = (props) => {
    let [models, dispatch] = useReducer(reducer, []);
    useEffect(()=>{
        let sample_data = [
            {
                'name':'test1',
                'category':'api',
                'status':1,
                'data': {}
            },
            {
                'name':'test2',
                'category':'database',
                'status':1,
                'data': {}
            }
        ];

        dispatch({type:ACTIONS.MODEL_LOAD_ALL, payload:sample_data});
    },[]);

    return (<CacheModelContext.Provider value={{models,dispatch}}>
        {props.children}
    </CacheModelContext.Provider>);

}