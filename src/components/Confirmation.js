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
                        <h2>
                            <i>You're almost there! </i></h2><br /><br />
                        <h4 style={{color:'#4D60A5'}}>  Please check your email to confirm your email address.

                        </h4>
                        <li className="row mt-3 pull-right">
                            <NavLink className="btn unanswered pl-0" to='/signinform'>Finished the confirmation? Sign in Here</NavLink>
                        </li>
                    </div>
                </div>
            </div>
        )
    }
}