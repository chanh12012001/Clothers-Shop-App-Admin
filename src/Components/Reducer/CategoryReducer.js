const iniState = null;

const categoryReducer = (state=iniState,action) => {
    switch(action.type){

        case "Load_CATEGORIES":
            state = action.payload;
            break;
        default:
            break;
    }
    return state;
};
export default categoryReducer;