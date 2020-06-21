import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../logo.png';
import { register } from './UserFunction';
import axios from 'axios';

export class Temp_Register extends Component {
    constructor() {
        super();
        this.state = {
            username: "",
            email: "",
            password: ""
        };

         this.handleUserChange = this.handleUserChange.bind(this);
         this.handleEmailChange = this.handleEmailChange.bind(this);
         this.handlePassChange = this.handlePassChange.bind(this);
         this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleUserChange = e => {
        this.setState({ username: e.target.value })
    }

    handleEmailChange = e => {
        this.setState({ email: e.target.value })
    }

    handlePassChange = e => {
        this.setState({ password: e.target.value })
    }

    handleSubmit(e) {

        e.preventDefault();

        const newUser = {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
        }

        axios
            .post('/register', newUser)
            .then(res => {
                if(res.data != null) {
                    console.log(res.data);
                    console.log("Registered");
                    this.props.history.push(`\signin`);
                }
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
    }

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
                            <span>Register Now</span>
                        </h1>
                        <form noValidate onSubmit={this.handleSubmit}>
                        <div class="form-group row">
                            <label for="username" class="col-sm-3 col-form-label col-form-label-sm">Email</label>
                            <div class="col-sm-8">
                                <input class="form-control form-control-sm" placeholder="Enter Email" 
                                 value={this.state.email} onChange={this.handleEmailChange}/>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="username" class="col-sm-3 col-form-label col-form-label-sm">Username</label>
                            <div class="col-sm-8">
                                <input class="form-control form-control-sm" placeholder="Enter Username" 
                                 value={this.state.username} onChange={this.handleUserChange}/>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="password" class="col-sm-3 col-form-label col-form-label-sm">Password</label>
                            <div class="col-sm-8">
                                <input type="password" class="form-control form-control-sm" placeholder="Enter Password" 
                                 value={this.state.password} onChange={this.handlePassChange}/>
                            </div>
                        </div>
                        <div class="container-sign-in-btn position-fixed row ml-0">
                            <ul class="pl-2">
                                <li class="row">
                                    <button type="submit" class="btn sign-in-btn bg-black">
                                        Register
                                    </button>
                                </li>
                                <li class="row mt-3">
                                    <NavLink class="btn unanswered pl-0" to='/signinform'>Already have an account? Sign in Here</NavLink>
                                </li>
                            </ul>
                        </div>
                        </form>
                    </div>
                </div>


                <div class="container d-none d-xl-block">
                    <div class="row">
                        <div class="container">
                            <div class="row">
                                <a href="#" class="intro-banner-vdo-play-btn pinkBg">
                                    <i class="glyphicon glyphicon-play whiteText" aria-hidden="true"></i>
                                    <span class="ripple pinkBg"></span>
                                    <span class="ripple pinkBg"></span>
                                    <span class="ripple pinkBg"></span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}