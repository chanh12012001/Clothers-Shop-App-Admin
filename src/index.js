import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter } from "react-router-dom";
import { blueGrey, lightBlue, cyan } from "@material-ui/core/colors";
// const Colors = "../constants/Colors";
import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./Components/Reducer/RootReducer";
//import blue from "@material-ui/core/colors/blue";

const composeEnhancers = window._REDUX_DEVTOOLS_EXTENSION_COMPOSE_ || compose;
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

const theme = createMuiTheme({
  palette: {
    primary: cyan,
    secondary: blueGrey,
  },
});

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </Provider>,
  // </React.StrictMode>,
  document.getElementById("root")
);


