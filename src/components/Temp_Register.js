import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../logo.png'

export class Temp_Register extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            email: '',
            password: ''
        };
    }
    componentDidMount() {
        fetch('/register')
            .then(res => res.json())
            .then(res => this.setState({feeds: res.data}, () => console.log('Data fetched', res)))
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
                        <div class="form-group row">
                            <label for="username" class="col-sm-3 col-form-label col-form-label-sm">Username</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control form-control-sm" id="colFormLabelSm" placeholder="Enter Username" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="password" class="col-sm-3 col-form-label col-form-label-sm">Password</label>
                            <div class="col-sm-8">
                                <input type="password" class="form-control form-control-sm" id="colFormLabelSm" placeholder="Password" />
                            </div>
                        </div>
                        <div class="container-sign-in-btn position-fixed row ml-0">
                            <ul class="pl-2">
                                <li class="row">
                                    <button class="btn sign-in-btn bg-black">
                                        <NavLink class="sign-in-link" to="#">Register</NavLink>
                                    </button>
                                </li>
                                <li class="row mt-3">
                                    <NavLink class="btn unanswered pl-0" to='/signinform'>Already have an account? Sign Here</NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>


                <div class="container d-none d-xl-block">
                    <div class="row">
                        <div class="container">
                            <div class="row">
                                <a href="#" class="intro-banner-vdo-play-btn pinkBg" target="_blank">
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