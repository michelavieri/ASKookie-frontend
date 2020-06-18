import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Navigation } from './Navigation'
import { animateScroll as scroll } from "react-scroll";
import logo from '../logo.png'

export class Home extends Component {
    constructor() {
        super();
        this.state = {
            feeds: []
        };
    }
    componentDidMount() {
        fetch('/home')
            .then(res => res.json())
            .then(res => this.setState({feeds: res.data}, () => console.log('Data fetched', res)))
    }
    scrollToTop = () => {
        scroll.scrollToTop();
    };

    render() {
        const first = this.state.feeds[0];
        var id = first;
        console.log(first);
        return (
            <div class="container-fluid text-center margin-top">
                <Navigation />
                <button class="bottom-right-fixed btn bg-yellow btn-lg refresh-button rounded-edge d-none d-xl-block" onClick={() => this.scrollToTop()} id="myBtn" title="Scroll to top"><i class="fa fa-chevron-up"></i></button>
                <div class="row content">
                    <div class="col-sm-2">
                        <div class="position-fixed">
                            <div class="card d-none d-xl-block text-left" style={{ width: '10rem' }}>
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
                    <div class="col-sm-7 text-left">
                        <div class="card mb-3">
                            <div class="card-body">
                                <h7 class="card-title" style={{ opacity: '50%' }}>Name,</h7>
                                <br />
                                <button class="questionButton" type="button" data-toggle="modal" data-target="#askModal">
                                    <NavLink class="text-dark text-decoration-none stretched-link" to="#">What is your Question?</NavLink></button>
                            </div>
                        </div>

                        {/* feeds to be replaced */}
                        <div class="card mb-3">
                            <div class="card-body">
                                <ul class="list-group">
                                    <li>
                                        <div class="sub-text">
                                            <NavLink class="sub-link" to="/thread"><h8> @{this.state.feeds[0] && this.state.feeds[0].postID} </h8></NavLink>
                                        &middot; posted by
                                        <NavLink class="sub-link" to=""><h8> {this.state.feeds[0] && this.state.feeds[0].asker} </h8></NavLink>
                                        </div>
                                    </li>
                                    <li>
                                        <NavLink class="btn-category unanswered font-weight-bold lead" to="">What residence should I pick?</NavLink>
                                    </li>
                                    <li>
                                        <div class="show-more" data-type="text" data-number="80">
                                            <p>{this.state.feeds[0] && this.state.feeds[0].post}
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
                                    <NavLink class="sub-link" to="/thread"><h8> @{this.state.feeds[1] && this.state.feeds[1].postID} </h8></NavLink>
                                        &middot; posted by
                                        <NavLink class="sub-link" to=""><h8> {this.state.feeds[1] && this.state.feeds[1].asker} </h8></NavLink>
                                </div>
                                <p>{this.state.feeds[1] && this.state.feeds[1].post} <br /><br /><br /><br /><br /><br /><br /><br />
                                    <br /><br /><br /><br /><br /><br /></p>
                            </div>
                        </div>
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="sub-text">
                                    <NavLink class="sub-link" to="/thread"><h8>@1728 </h8></NavLink>
                                        &middot; posted by
                                        <NavLink class="sub-link" to=""><h8> Michela Vieri </h8></NavLink>
                                </div>
                                <p>sdaskdfhlskjdfhlaksdjh <br /><br /><br /><br /><br /><br /><br /><br />
                                    <br /><br /><br /><br /><br /><br /></p>
                            </div>
                        </div>


                    </div>
                    <div class="col-sm-2">
                        <div class="card d-none d-xl-block text-left" style={{ width: '13rem' }}>
                            <div class="card-header">
                                Unanswered Questions
                            </div>
                            <ul class="list-group list-group-flush">
                                <NavLink class="btn-category" to="/thread"><li class="list-group-item unanswered"><p class="mr-4 mb-0">What is the difference
                                    between exchange and NOC?</p> <i class="fa fa-fw fa-pencil bottom-right icon"></i></li></NavLink>
                                <NavLink class="btn-category" to="/thread"><li class="list-group-item unanswered"><p class="mr-4 mb-0">How is CS1231
                                    different from CS1231S?</p><i class="fa fa-fw fa-pencil bottom-right icon"></i></li></NavLink>
                                <NavLink class="btn-category" to="/thread"><li class="list-group-item unanswered"><p class="mr-4 mb-0">What are your experiences on internships?</p><i class="fa fa-fw fa-pencil bottom-right icon"></i></li></NavLink>
                                <NavLink class="btn-category" to="/thread"><li class="list-group-item unanswered"><p class="mr-4 mb-0">What is the difference between each residential colleges?</p><i class="fa fa-fw fa-pencil bottom-right icon"></i></li></NavLink>
                                <NavLink class="btn-category" to="/thread"><li class="list-group-item unanswered"><p class="mr-4 mb-0">Why should I choose Residential College 4?</p><i class="fa fa-fw fa-pencil bottom-right icon"></i></li></NavLink>
                            </ul>
                            <div class="card-footer overflow-auto">
                                <button class="btn refresh-button pull-right"><i class="fa fa-fw fa-refresh mx-lg-1 fa-lg"></i>Refresh</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}