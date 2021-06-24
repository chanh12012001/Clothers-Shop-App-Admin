import logo from './logo.svg';
import './App.css';
import { Switch , Route , Redirect} from "react-router-dom"
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import firebase from './firebase';
import Authenticated from './Components/Authenticated';
function App() {
  return (
    <Switch>
        <Route exact path="/">
          <Authenticated>
            <Dashboard/>
          </Authenticated>
        </Route>
        <Route exact path="/login" >
          <Authenticated nonAuthenticated={true}>
              <Login/>
          </Authenticated>
        </Route>
        <Route path="*" render={()=>"404 Not Found"}/>
    </Switch>
  );
}

export default App;
