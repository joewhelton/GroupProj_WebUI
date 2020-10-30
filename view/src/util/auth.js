export const authMiddleWare = (history) => {
    const authToken = localStorage.getItem('AuthToken');
    if(authToken === null){
        history.push('/login')
    }
}

export const authorizeMiddleware = (history, userData, level) => {
    if(userData) {
        if (!userData.userRoles[level]) {
            history.push('/login')
        }
    }
}
