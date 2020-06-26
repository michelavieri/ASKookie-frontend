import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../logo.png'
import axios from 'axios';
import PasswordMask from 'react-password-mask';

export class Temp_Sign_In extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            success: '0'
        };

        this.handleUserChange = this.handleUserChange.bind(this);
        this.handlePassChange = this.handlePassChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUserChange = e => {
        this.setState({ username: e.target.value })
    }

    handlePassChange = e => {
        this.setState({ password: e.target.value })
    }

    handleSubmit(e) {

        e.preventDefault()

        const user = {
            username: this.state.username,
            password: this.state.password
        }

        axios
            .post('https://whispering-hamlet-08619.herokuapp.com/login', user)
            .then(res => {
                console.log(user);
                if (res.data.token) {
                    console.log(res.token);
                    localStorage.setItem('usertoken', res.data.token);
                    console.log(this.props);
                    this.props.history.push(``);
                } else {
                    this.setState({ success: res.success });
                }
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    };

    render() {
        return (
            <div className="container-fluid">
                <div class="container-sign-in margin-top-none d-none d-xl-block">
                    <div class="left-half bg-yellow">
                        <img src={logo} alt="" class="logo-fluid" />
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
                                        value={this.state.username} onChange={this.handleUserChange} />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="password" class="col-sm-3 col-form-label col-form-label-sm">Password</label>
                                <div class="col-sm-8">
                                    <PasswordMask
                                        type="password"
                                        class="form-control form-control-sm"
                                        placeholder="Enter Password"
                                        value={this.state.password}
                                        onChange={this.handlePassChange}
                                        buttonClassName="pass"
                                        inputClassName="passForm"
                                    />
                                </div>
                            </div>
                            {/*this.state.success === 0 &&
                        <div className="alert alert-danger" role="alert">
                            Invalid username
                        </div>*/}
                            {this.state.success != 0 &&
                                <div className="alert alert-danger" role="alert">
                                    Invalid username or password
                        </div>}
                            <div class="position-fixed row ml-0">
                                <ul class="pl-2">
                                    <li class="row">
                                        <button type="submit" class="btn sign-in-btn bg-black">
                                            Sign in
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