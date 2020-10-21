import React, { createContext, useReducer } from 'react';
import Reducer from './Reducer';

const initialState = {
    authUser: null
};

// eslint-disable-next-line react/prop-types
const Store = ({ children }) => {
    const [state, dispatch] = useReducer(
        Reducer,
        initialState,
        (initial) => initial
    );
    return (
        <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
    );
};

export const Context = createContext(initialState);
export default Store;