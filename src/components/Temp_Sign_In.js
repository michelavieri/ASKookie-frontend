import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../logo.png'
import { login } from './UserFunction';
import axios from 'axios';

export class Temp_Sign_In extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: ''
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleInputChange(e) {
        this.setState({[e.target.name]: e.target.value});
    };

    handleSubmit(e) {

        e.preventDefault()

        const user = {
            username: this.state.username,
            password: this.state.password
        }

        axios
            .post('/login', user)
            .then(res => {
                if(res.token != null) {
                    console.log(res.token);
                    localStorage.setItem('usertoken', res.data.token);
                    this.props.history.push(``);
                }
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
            });
        /*login(user).then(res => {
            if(res) {
                this.props.history.push(`\home`)
            }
        })*/
    };

    render() {
        return (
            <div className="container-fluid">
                <div class="container-sign-in margin-top-none d-none d-xl-block">
                    <div class="left-half bg-yellow">
                        <img src={logo} class="logo-fluid" />
                        <br />
                        <div class="textRevealContainer">
                            <div class="textReveal rotateY">
                                <div>
                                    <div>
                                        Ask Anytime, Anywhere
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="right-half">
                    <div class="nav-link text-right mt-3 fixed-top mr-4">
                        <button class="btn btn-opacity">
                            <NavLink class="btn-back-home" to="/"><i class="fa fa-fw fa-angle-left fa-lg" />Back to Home
                        </NavLink></button>
                    </div>
                    <div class="container-animation">
                        <h1 class="text-animation">
                            <span>Sign In</span>
                        </h1>
                        <form noValidate onSubmit={this.handleSubmit}>
                        <div class="form-group row">
                            <label for="username" class="col-sm-3 col-form-label col-form-label-sm">Username</label>
                            <div class="col-sm-8">
                                <input class="form-control form-control-sm" placeholder="Enter Username"
                                 value={this.state.username} onChange={this.handleInputChange}/>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="password" class="col-sm-3 col-form-label col-form-label-sm">Password</label>
                            <div class="col-sm-8">
                                <input class="form-control form-control-sm" placeholder="Enter Password"
                                 value={this.state.password} onChange={this.handleInputChange}/>
                            </div>
                        </div>
                        <div class="container-sign-in-btn position-fixed row ml-0">
                            <ul class="pl-2">
                                <li class="row">
                                    <button class="btn sign-in-btn bg-black">
                                        <NavLink class="sign-in-link" to="">Sign in</NavLink>
                                    </button>
                                </li>
                                <li class="row mt-3">
                                    <NavLink class="btn unanswered pl-0" to='/register'>Don't have an account? Register Here</NavLink>
                                </li>
                            </ul>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}