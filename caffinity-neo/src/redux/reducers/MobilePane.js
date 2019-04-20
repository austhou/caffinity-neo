const INITIAL_STATE = false;

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'set_map':
            return true;
        case 'set_list':
            return false;
        case 'toggle_pane':
            return !state;
        default: 
            return state
    }
}