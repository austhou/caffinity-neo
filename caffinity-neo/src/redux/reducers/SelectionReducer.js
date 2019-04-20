const INITIAL_STATE = null;

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'set_selection':
            return action.payload || null
        case 'clear_selection':
            return null
        default: 
            return state
    }
}