const INITIAL_STATE = null;

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'set_user':
            return action.payload || null
        case 'login':
            return action.payload
        case 'logout':
            return null
        default: 
            return state
    }
}