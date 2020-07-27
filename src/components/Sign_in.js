import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../logo.png'

export class Sign_in extends Component {

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
                    <div className="container-animation mt-5">
                        <h1 className="text-animation">
                            <span>Welcome</span>
                        </h1>
                        <p className="text-animation small-description">
                            <span>Sign in with us.</span>
                        </p>
                        <br />
                    </div>
                </div>
                <div className="container-sign-in-btn">
                    <button className="btn sign-in-btn bg-black">
                        <NavLink className="sign-in-link" to="/signinform">Sign in to your NUS Account</NavLink>
                    </button>
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