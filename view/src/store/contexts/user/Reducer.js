const Reducer = (state, action) => {
    switch (action.type) {
        case 'SET_AUTH_USER':
            return {
                ...state,
                authUser: action.payload.authUser,
            };
        case 'SET_USER_DATA':
            return {
                ...state,
                userData: action.payload.userData,
            }
        case 'LOG_OUT_USER':
            return {
                authUser: null,
                userData: null
            }
        default:
            return state;
    }
};

export default Reducer;