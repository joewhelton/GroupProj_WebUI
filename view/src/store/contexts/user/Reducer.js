const Reducer = (state, action) => {
    switch (action.type) {
        case 'SET_AUTH_USER':
            return {
                ...state,
                authUser: action.payload.authUser,
            };
        default:
            return state;
    }
};

export default Reducer;