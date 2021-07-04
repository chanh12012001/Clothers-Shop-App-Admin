import { combineReducers } from "redux";
import categoryReducer from "./CategoryReducer";

const DEFAULT_REDUCER = (inistate, action) => {
    return{
        key: "Hello World",
    };
};

const rootReducer = combineReducers({
    DEFAULT: DEFAULT_REDUCER,
    categories: categoryReducer,
});

export default rootReducer;