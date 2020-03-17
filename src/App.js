import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Homepage from './pages/homepage/homepage'
import Errorpage from './pages/errorpage/errorpage'
import Dashboard from './pages/dashboard/dashboard'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

function App() {
  return (
    <Router>
    <Switch>
      <Route path="/error" component={Errorpage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route exact path="/" component={Homepage} />
      <Redirect from="*" to="/error" />
    </Switch>
  </Router>
  );
}

export default App;
