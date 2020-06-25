import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../logo.png'

export class Sign_in extends Component {

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
                    <div class="container-animation mt-5">
                        <h1 class="text-animation">
                            <span>Welcome</span>
                        </h1>
                        <p class="text-animation small-description">
                            <span>Sign in with us.</span>
                        </p>
                        <br />
                    </div>
                </div>
                <div class="container-sign-in-btn">
                    <button class="btn sign-in-btn bg-black">
                        <NavLink class="sign-in-link" to="/signinform">Sign in to your NUS Account</NavLink>
                    </button>
                </div>


                <div class="container d-none d-xl-block">
                    <div class="row">
                        <div class="container">
                            <div class="row">
                                <button class="intro-banner-vdo-play-btn pinkBg">
                                    <i class="glyphicon glyphicon-play whiteText" aria-hidden="true"></i>
                                    <span class="ripple pinkBg"></span>
                                    <span class="ripple pinkBg"></span>
                                    <span class="ripple pinkBg"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}