import React from 'react';
import logo from './logo.png'
import './App.css'

import { Home } from './components/Home'
import { Answer } from './components/Answer'
import {Sign_in} from './components/Sign_in'
import {Thread} from './components/Thread'
import {Temp_Sign_In} from './components/Temp_Sign_In'
import {Temp_Register} from './components/Temp_Register'
import {About_Us} from './components/About_Us'
import {Faculties} from './components/Faculties'
import {Accommodation} from './components/Accommodation'
import {Student_Life} from './components/Student_Life'
import {Job_Intern} from './components/Job_Intern'
import {Exchange_Noc} from './components/Exchange_Noc'
import {Others} from './components/Others'

import { BrowserRouter, Route, Switch } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Switch>
          <Route exact path='/' component={Home} exact />
          <Route path='/answer' component={Answer} />
          <Route path='/signin' component={Sign_in} />
          <Route path='/thread/:id' component={Thread} />
          <Route path='/signinform' component={Temp_Sign_In} />
          <Route path='/register' component={Temp_Register} />
          <Route path='/about_us' component={About_Us} />
          <Route path='/faculties' component={Faculties} />
          <Route path='/accommodation' component={Accommodation} />
          <Route path='/student_life' component={Student_Life} />
          <Route path='/job_intern' component={Job_Intern} />
          <Route path='/exchange_noc' component={Exchange_Noc} />
          <Route path='/others' component={Others} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
