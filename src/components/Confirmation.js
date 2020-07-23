import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../logo.png';

export class Confirmation extends Component {
    constructor() {
        super();
    }

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
                        <h2>
                            <i>You're almost there! </i></h2><br /><br />
                        <h4 style={{color:'#4D60A5'}}>  Please check your email to confirm your email address.

                        </h4>
                        <li class="row mt-3 pull-right">
                            <NavLink class="btn unanswered pl-0" to='/signinform'>Finished the confirmation? Sign in Here</NavLink>
                        </li>
                    </div>
                </div>
            </div>
        )
    }
}