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
            success: '2'
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
                if (res.data.token) {
                    localStorage.setItem('usertoken', res.data.token);
                    this.props.history.push(``);
                } else {
                    this.setState({ success: res.success });
                }
                this.setState({ success: res.data.success });
            })
            .catch(err => {
                console.log(err);
            });
    };

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
                            <span>Sign In</span>
                        </h1>
                        <form noValidate onSubmit={this.handleSubmit}>
                            <div className="form-group row">
                                <label for="username" className="col-sm-3 col-form-label col-form-label-sm">Username</label>
                                <div className="col-sm-8">
                                    <input className="form-control form-control-sm" placeholder="Enter Username"
                                        value={this.state.username} onChange={this.handleUserChange} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label for="password" className="col-sm-3 col-form-label col-form-label-sm">Password</label>
                                <div className="col-sm-8">
                                    <PasswordMask
                                        type="password"
                                        className="form-control form-control-sm"
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
                            {this.state.success == 0 &&
                                <div className="alert alert-danger" role="alert">
                                    Username does not exist
                        </div>}
                            {this.state.success == 1 &&
                                <div className="alert alert-danger" role="alert">
                                    Email has not been verified, please verify your email
                        </div>}
                            {this.state.success == 3 &&
                                <div className="alert alert-danger" role="alert">
                                    Incorrect password
                        </div>} 
                            <div className="position-fixed row ml-0">
                                <ul className="pl-2">
                                    <li className="row">
                                        <button type="submit" className="btn sign-in-btn bg-black">
                                            Sign in
                                    </button>
                                    </li>
                                    <li className="row mt-3">
                                        <NavLink className="btn unanswered pl-0" to='/register'>Don't have an account? Register Here</NavLink>
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