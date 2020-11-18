import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignUp from './components/SignUp'
import LoginMenu from './components/LoginMenu'
import SignIn from './components/SignIn'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <LoginMenu />
        <Switch>
          <Route path="/signup" exact component={SignUp} />
          <Route path="/signin" component={SignIn} />
        </Switch>
      </div>
    </Router>

  );
}

export default App;
