import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { animateScroll as scroll } from "react-scroll";
import logo from '../logo.png'


export class Navigation extends Component {constructor() {
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
        return (
            <div class="container-fluid">
                <nav class="navbar fixed-top navbar-expand-lg navbar-light bg-yellow">
                    <NavLink class="navbar-brand smooth-scroll" onClick={() => this.scrollToTop()} to="/">
                        <img src={logo} class="img-fluid" alt="" />
                    </NavLink>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                        <i class="fa fa-bars"></i>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarText">
                        <ul class="navbar-nav mr-auto">
                            <li class="nav-item">
                                <Link class="nav-link px-lg-5" to="/"><i class="fa fa-fw fa-home fa-lg"></i> Home <span class="sr-only">(current)</span></Link>
                            </li>
                            <li class="nav-item">
                                <Link class="nav-link px-lg-5" to="/answer">
                                    <i class="fa fa-fw fa-pencil-square-o mx-lg-1 fa-lg"></i>Answer</Link>
                            </li>

                        </ul>
                        <form class="form-inline my-2 my-lg-0 ml-auto">
                            <div class="form-group has-search">
                                <span class="fa fa-search form-control-feedback  d-none d-xl-block"></span>
                                <input class="form-control mr-sm-2" type="search" id="myInput" placeholder="Search" aria-label="Search" />
                            </div>
                        </form>

                        {/* modal button */}
                        <button class="btn btn-orange my-2 my-sm-0" type="button" data-toggle="modal" data-target="#askModal">Add Question</button>


                        <ul class="navbar-nav">
                            {/* <li class="nav-item dropdown nav-icon">
                                <NavLink class="nav-link icon" to="#" id="notifDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa fa-fw fa-bell fa-lg mt-2"></i></NavLink>
                                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="notifDropdown">
                                    <NavLink class="dropdown-item" to="#">Someone answered your question!</NavLink>
                                    <div class="dropdown-divider"></div>
                                    <NavLink class="dropdown-item" to="#">Your followed thread posted something new!</NavLink>
                                    <div class="dropdown-divider"></div>
                                    <NavLink class="dropdown-item" to="#">Someone commented on your answer!</NavLink>
                                </div>
                            </li> */}
                            <li class="nav-item dropdown nav-icon">
                                <NavLink class="nav-link icon" to="#" id="notifDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <img src="https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/fox.jpg" width="40" class="rounded-circle" /></NavLink>
                                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="notifDropdown">
                                    {/* <NavLink class="dropdown-item" to="#">Followed Categories/Threads</NavLink>
                                    <NavLink class="dropdown-item" to="#">Your Asked/Answered Questions</NavLink>
                                    <NavLink class="dropdown-item" to="#">Saved Posts</NavLink>
                                    <NavLink class="dropdown-item" to="#">Liked Posts</NavLink>
                                    <div class="dropdown-divider"></div> */}
                                    <NavLink class="dropdown-item" to="#">Help</NavLink>
                                    <NavLink class="dropdown-item" to="#">Logout</NavLink>
                                </div>
                            </li>
                        </ul>
                    </div>
                </nav>
                {/* modal ask  */}
                <div id="askModal" class="modal fade" role="dialog">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header pinkBg">
                                <h4 class="modal-title text-white">Ask a Question!</h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <div class="form-row align-items-left mb-3">
                                    <label for="inputQuestion" class="col-sm-2 col-form-label font-weight-bold">Your Question</label>
                                    <textarea type="text" rows="2" class="form-control col-sm-9" id="inputQuestion" aria-describedby="questionHere" placeholder="Start your question with 'What', 'Why', 'How', etc. " />
                                    <small id="passwordHelpBlock" class="form-text text-muted col-sm-11">
                                        Make sure your question has not been asked already and keep your question short.
                                    </small>
                                </div>
                                <div class="form-row align-items-left mb-3">
                                    <label for="inputQuestion" class="col-sm-2 col-form-label font-weight-bold">Category</label>
                                    <select id="inputState" class="form-control col-sm-9">
                                        <option selected>Choose one...</option>
                                        <option>Faculties</option>
                                        <option>Accomodation</option>
                                        <option>Student Life</option>
                                        <option>Job/Internship</option>
                                        <option>Exchange Program/NOC</option>
                                        <option>Others</option>
                                    </select>
                                    <small id="passwordHelpBlock" class="form-text text-muted col-sm-11">
                                        Your question will be posted anonymously but any inapporpriate content will be filtered.
                                    </small>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default far-right" data-dismiss="modal">Cancel</button>
                                <button type="submit" class="btn btn-orange my-2 my-sm-0 ml-2" >Add Question</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}