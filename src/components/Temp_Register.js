import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../logo.png';
import axios from 'axios';
import PasswordMask from 'react-password-mask';

export class Temp_Register extends Component {
    constructor() {
        super();
        this.state = {
            username: "",
            email: "",
            password: "",
            success: ""
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
            .post('https://whispering-hamlet-08619.herokuapp.com/register', newUser)
            .then(res => {
                if (res.data != null) {
                    this.props.history.push(`/Confirmation`);
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({ success: 1 });
            });
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="container-sign-in margin-top-none d-none d-xl-block">
                    <div className="left-half bg-yellow">
                        <img src={logo} alt="" className="logo-fluid" />
                        <br />
                        <div className="textRevealContainer">
                            <div className="textReveal rotateY">
                                <div>
                                    <div>
                                        Ask Anytime, Anywhere
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="right-half">
                    <div className="nav-link text-right mt-3 fixed-top mr-4">
                        <button className="btn btn-opacity">
                            <NavLink className="btn-back-home" to="/"><i className="fa fa-fw fa-angle-left fa-lg" />Back to Home
                        </NavLink></button>
                    </div>
                    <div className="container-animation">
                        <h1 className="text-animation">
                            <span>Register Now</span>
                        </h1>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group row">
                                <label for="username" className="col-sm-3 col-form-label col-form-label-sm">Email</label>
                                <div className="col-sm-8">
                                    <input className="form-control form-control-sm" placeholder="Enter Email"
                                        value={this.state.email} onChange={this.handleEmailChange} required />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label for="username" className="col-sm-3 col-form-label col-form-label-sm">Username</label>
                                <div className="col-sm-8">
                                    <input className="form-control form-control-sm" placeholder="Enter Username"
                                        value={this.state.username} onChange={this.handleUserChange} required />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label for="password" className="col-sm-3 col-form-label col-form-label-sm">Password</label>
                                <div className="col-sm-8">
                                    <PasswordMask type="password"
                                        className="form-control form-control-sm"
                                        placeholder="Enter Password"
                                        value={this.state.password}
                                        onChange={this.handlePassChange}
                                        buttonClassName= "pass"
                                        inputClassName="passForm"
                                        required
                                    />
                                </div>
                            </div>
                            {this.state.success === 1 &&
                                <div className="alert alert-danger" role="alert">
                                    Username/Email already exists
                        </div>}
                            <div className="container-sign-in-btn position-fixed row ml-0">
                                <ul className="pl-2">
                                    <li className="row">
                                        <button type="submit" className="btn sign-in-btn bg-black">
                                            Register
                                    </button>
                                    </li>
                                    <li className="row mt-3">
                                        <NavLink className="btn unanswered pl-0" to='/signinform'>Already have an account? Sign in Here</NavLink>
                                    </li>
                                </ul>
                            </div>
                        </form>
                    </div>
                </div>


                <div className="container d-none d-xl-block">
                    <div className="row">
                        <div className="container">
                            <div className="row">
                                <button className="intro-banner-vdo-play-btn pinkBg">
                                    <i className="glyphicon glyphicon-play whiteText" aria-hidden="true"></i>
                                    <span className="ripple pinkBg"></span>
                                    <span className="ripple pinkBg"></span>
                                    <span className="ripple pinkBg"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}