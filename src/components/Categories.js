import React, { Component } from 'react';
import NavigationRouter2 from './Navigation'
import { NavLink, Link } from 'react-router-dom';
import { animateScroll as scroll } from "react-scroll";
import logo from '../logo.png'

export class Categories extends Component {
    scrollToTop = () => {
        scroll.scrollToTop();
    };
    render() {
        return (
            <div className="mt-5 justify-content-left">
                <NavigationRouter2 />
                <button class="bottom-right-fixed btn bg-yellow btn-lg refresh-button rounded-edge" onClick={() => this.scrollToTop()} id="myBtn" title="Scroll to top"><i class="fa fa-chevron-up"></i></button>
                <div class="row content">
                    <div class="col-sm-2">
                        <div class="position-fixed">
                            <div class="card d-none d-xl-block text-left mt-3" style={{ width: '10rem' }}>
                                <div class="card-header">
                                    Categories
                                </div>
                                <div class="card-body">
                                    <ul class="list-group list-group-flush large-space">
                                        <NavLink class="listku card-link" to="/categories/faculties"><li>Faculties</li></NavLink>
                                        <NavLink class="listku" to="/categories/accomodation"><li>Accomodation</li></NavLink>
                                        <NavLink class="listku" to="/categories/studentlife"><li>Student Life</li></NavLink>
                                        <NavLink class="listku" to="/categories/jobs"><li>Job/Internship</li></NavLink>
                                        <NavLink class="listku" to="/categories/exchange"><li>Exchange/NOC</li></NavLink>
                                        <NavLink class="listku" to="/categories/others"><li>Others</li></NavLink>
                                    </ul>
                                </div>
                                <div class="card-footer">
                                    <NavLink class="text-dark small" to="/about_us">About us</NavLink>
                                    <br />
                                    <a class="text-dark small" href="mailto:askookie@gmail.com" target="_blank">Email us</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-7 text-left mt-3">
                           <h1 class ="mb-4"> Category: Faculties</h1>

                    {/* feeds to be replaced */}
                    <div class="card mb-3">
                        <div class="card-body">
                            <ul class="list-group">
                                <li>
                                    <div class="sub-text">
                                        <NavLink class="sub-link" to=""><h8>@1728 </h8></NavLink>
                                        &middot; posted by
                                        <NavLink class="sub-link" to=""><h8> Michela Vieri </h8></NavLink>
                                    </div>
                                </li>
                                <li>
                                    <NavLink class="btn-category unanswered font-weight-bold lead" to="">What residence should I pick?</NavLink>
                                </li>
                                <li>
                                    <div class="show-more" data-type="text" data-number="80">
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pretium leo in ex
                                        vehicula sagittis.  Tortor hendrerit elit porta auctor. Maecenas fringilla eleifend ante,
                                        sed hendrerit massa rutrum vel. Orci varius natoque penatibus et magnis dis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pretium leo in ex
                                        vehicula sagittis.  Tortor hendrerit elit porta auctor. Maecenas fringilla eleifend ante,
                                        <br /><br />
                                            <img src={logo} class="img-responsive" width="100%"></img>
                                        sed hendrerit massa rutrum vel. Orci varius natoque penatibus et magnis dis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pretium leo in ex
                                        vehicula sagittis.  Tortor hendrerit elit porta auctor. Maecenas fringilla eleifend ante,
                                        sed hendrerit massa rutrum vel. Orci varius natoque penatibus et magnis dis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pretium leo in ex
                                        vehicula sagittis.  Tortor hendrerit elit porta auctor. Maecenas fringilla eleifend ante,
                                        sed hendrerit massa rutrum vel. Orci varius natoque penatibus et magnis disLorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pretium leo in ex
                                        vehicula sagittis.  Tortor hendrerit elit porta auctor. Maecenas fringilla eleifend ante,
                                        sed hendrerit massa rutrum vel. Orci varius natoque penatibus et magnis dis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pretium leo in ex
                                        vehicula sagittis.  Tortor hendrerit elit porta auctor. Maecenas fringilla eleifend ante,
                                        <br /><br />
                                        sed hendrerit massa rutrum vel. Orci varius natoque penatibus et magnis dis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pretium leo in ex
                                        vehicula sagittis.  Tortor hendrerit elit porta auctor. Maecenas fringilla eleifend ante,
                                        sed hendrerit massa rutrum vel. Orci varius natoque penatibus et magnis dis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pretium leo in ex
                                        vehicula sagittis.  Tortor hendrerit elit porta auctor. Maecenas fringilla eleifend ante,
                                        sed hendrerit massa rutrum vel. Orci varius natoque penatibus et magnis dis</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="card mb-3">
                        <div class="card-body">
                            <div class="sub-text">
                                <NavLink class="sub-link" to=""><h8>@1728 </h8></NavLink>
                                        &middot; posted by
                                        <NavLink class="sub-link" to=""><h8> Michela Vieri </h8></NavLink>
                            </div>
                            <p>sdaskdfhlskjdfhlaksdjh <br /><br /><br /><br /><br /><br /><br /><br />
                                <br /><br /><br /><br /><br /><br /></p>
                        </div>
                    </div>
                    <div class="card mb-3">
                        <div class="card-body">
                            <div class="sub-text">
                                <NavLink class="sub-link" to=""><h8>@1728 </h8></NavLink>
                                        &middot; posted by
                                        <NavLink class="sub-link" to=""><h8> Michela Vieri </h8></NavLink>
                            </div>
                            <p>sdaskdfhlskjdfhlaksdjh <br /><br /><br /><br /><br /><br /><br /><br />
                                <br /><br /><br /><br /><br /><br /></p>
                        </div>
                    </div>
                </div>
            </div>
            </div >
        )
    }
}