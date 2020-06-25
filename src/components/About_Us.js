import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../logo.png'

export class About_Us extends Component {

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
                       <p> <b>ASKookie</b> is a forum platform specifically designed for NUS Students and Staffs to ask and answer
                       about doubts that we encounter during our time here. The forum is neatly divided into main categories to ease students'
                       experience in searching for the type of question or answers they'd like to read.
                       <br /> <br />
                       What are you waiting for? Ask your doubts away!
                       <br />
                       <b><i>Ask Anytime, Anywhere!!</i></b>
                       <br /> <br /><br/>
                       <i>Application made by Christabelle and Michela.</i></p>
                    </div>
                </div>

            </div>
        )
    }
}