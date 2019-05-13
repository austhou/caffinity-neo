

export default (state=false, action) => {
    switch (action.type) {
        case 'getting_cafe_data':
            return true;
        case 'get_cafe_data':
            return false;
        default: 
            return state;
    }
}