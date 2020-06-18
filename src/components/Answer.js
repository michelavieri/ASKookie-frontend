import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Navigation } from './Navigation'
import { animateScroll as scroll } from "react-scroll";

export class Answer extends Component {
    scrollToTop = () => {
        scroll.scrollToTop();
    };

    render() {
        return (
            <div className="mt-5 justify-content-left">
                <Navigation />
                <button class="bottom-right-fixed btn bg-yellow btn-lg refresh-button rounded-edge" onClick={() => this.scrollToTop()} id="myBtn" title="Scroll to top"><i class="fa fa-chevron-up"></i></button>
                <div class="row content">
                    <div class="col-sm-2">
                        <div class="position-fixed">
                            <div class="card d-none d-xl-block text-left mt-3" style={{ width: '10rem' }}>
                                <div class="card-header bg-dark">
                                    FILTER
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
                        {/* feeds to be replaced */}
                        <div class="card mb-3">
                            <div class="card d-none d-xl-block text-left" >
                                <div class="card-header">
                                    Questions for You
                            </div>
                                <ul class="list-group list-group-flush">
                                    <NavLink class="btn-category" to="#"><li class="list-group-item unanswered"><p class="mr-4 mb-0">What is the difference
                                    between exchange and NOC?</p> <i class="fa fa-fw fa-pencil bottom-right icon"></i></li></NavLink>
                                    <NavLink class="btn-category" to="#"><li class="list-group-item unanswered"><p class="mr-4 mb-0">How is CS1231
                                    different from CS1231S?</p><i class="fa fa-fw fa-pencil bottom-right icon"></i></li></NavLink>
                                    <NavLink class="btn-category" to="#"><li class="list-group-item unanswered"><p class="mr-4 mb-0">What are your experiences on internships?</p><i class="fa fa-fw fa-pencil bottom-right icon"></i></li></NavLink>
                                    <NavLink class="btn-category" to="#"><li class="list-group-item unanswered"><p class="mr-4 mb-0">What is the difference between each residential colleges?</p><i class="fa fa-fw fa-pencil bottom-right icon"></i></li></NavLink>
                                    <NavLink class="btn-category" to="#"><li class="list-group-item unanswered"><p class="mr-4 mb-0">Why should I choose Residential College 4?</p><i class="fa fa-fw fa-pencil bottom-right icon"></i></li></NavLink>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}