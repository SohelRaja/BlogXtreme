import React, {useEffect, createContext, useReducer, useContext} from 'react';
import {HashRouter, Route, Switch, useHistory, Redirect} from 'react-router-dom';
import 'materialize-css/dist/css/materialize.min.css';

import './App.css';
import NavBar from './components/Navbar';
import Home from './components/screens/Home';
import Signin from './components/screens/Signin';
import Signup from './components/screens/Signup';
import Profile from './components/screens/Profile';
import CreatePost from './components/screens/CreatePost';
import EditPost from './components/screens/EditPost';
import NotFoundPage from './components/screens/NotFoundPage';

import {reducer, initialState} from './reducers/userReducer';

export const UserContext = createContext();

const Routing = ()=>{
  const history = useHistory();
  const {state, dispatch} = useContext(UserContext);
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(()=>{ 
    if(user){
      dispatch({type:"USER", payload: user});
    }else{
      history.push('/signin');
    }
  },[history,dispatch]);
  return(
    <Switch>
      {state && 
        <Route path="/" exact>
          <Home />
        </Route>
      }
      {!state && 
        <Switch>
          <Route path="/signin">
            <Signin />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route>
            <NotFoundPage />
          </Route>
        </Switch>
      }
      {state ? 
        <Switch>
          <Route path="/profile" exact>
            <Profile />
          </Route>
          <Route path="/create">
            <CreatePost />
          </Route>
          <Route path="/editpost/:postId">
            <EditPost />
          </Route>
          <Route>
            <NotFoundPage />
          </Route>
        </Switch>
        : <Redirect to='/signin' />
      }  
    </Switch>
  );
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div className="App">
      <UserContext.Provider value={{state:state, dispatch:dispatch}}>
        <HashRouter>
          <NavBar />
          <Routing />
        </HashRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
