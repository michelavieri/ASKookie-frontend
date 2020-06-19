import React from 'react';
import logo from './logo.png'
import './App.css'

import { Home } from './components/Home'
import { Answer } from './components/Answer'
import {Sign_in} from './components/Sign_in'
import {Categories} from './components/Categories'
import {Thread} from './components/Thread'
import {Temp_Sign_In} from './components/Temp_Sign_In'
import {Temp_Register} from './components/Temp_Register'
import {About_Us} from './components/About_Us'

import { BrowserRouter, Route, Switch } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Switch>
          <Route exact path='/' component={Home} exact />
          <Route path='/answer' component={Answer} />
          <Route path='/signin' component={Sign_in} />
          <Route path='/categories' component={Categories} />
          <Route path='/thread/:id' component={Thread} />
          <Route path='/signinform' component={Temp_Sign_In} />
          <Route path='/register' component={Temp_Register} />
          <Route path='/about_us' component={About_Us} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
