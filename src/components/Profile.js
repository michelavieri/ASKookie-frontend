import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import NavigationRouter2 from './Navigation';
import profilePicture from '../default_pp.png';
import { trackPromise } from 'react-promise-tracker';
// import AvatarEditor from 'react-avatar-editor'

export class Profile extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            saved: [],
            followed: [],
            posted: [],
        };
    }
    componentDidMount() {
        var token;
        var decoded;
        if (localStorage.usertoken) {
            token = localStorage.usertoken;
            decoded = jwt_decode(token);
            this.setState({ name: decoded.result.username });
        }

        trackPromise(
            fetch('http://localhost:5000/follow/' + `${decoded.result.username}`)
                .then(res => res.json())
                .then(res => {
                    this.setState({ followed: res.data });
                    console.log(res.data)
                }))
        trackPromise(
            fetch('http://localhost:5000/save/' + `${decoded.result.username}`)
                .then(res => res.json())
                .then(res => {
                    this.setState({ saved: res.data });
                    console.log(res.data)
                }))
        trackPromise(
            fetch('http://localhost:5000/post/' + `${decoded.result.username}`)
                .then(res => res.json())
                .then(res => {
                    this.setState({ posted: res.data });
                    console.log(res.data)
                }))
    }


    componentDecorator = (href, text, key) => (
        <a href={href} key={key} target="_blank" rel="noopener noreferrer">
            {text}
        </a>
    );

    logOut(e) {
        e.preventDefault();
        localStorage.removeItem('usertoken');
        this.props.history.push(``);
        window.location.reload(false);
    }

    render() {
        return (
            <div className="container-fluid">
                <NavigationRouter2 />
                <div class="row content">
                    <div class="col-sm-3">
                        <img src={profilePicture} alt="" width="200" class="rounded-circle profile-picture" />
                    </div>
                    <div class="col-sm-6 profile-content">
                        {localStorage.usertoken &&
                            <ul class="list-group">
                                <li>
                                    <h2 class="name">{this.state.name}</h2>
                                </li>
                                <li>
                                    <button class="btn btn-logout">
                                        <NavLink class="link-logout stretched-link" to={``} onClick={this.logOut.bind(this)}>Logout</NavLink>
                                    </button>
                                </li>
                                <li class="mt-3">
                                    <NavLink class="btn-back-home" to="/"><i class="fa fa-fw fa-angle-left fa-lg" />Back to Home</NavLink>
                                </li>
                            </ul>}
                        {!localStorage.usertoken &&
                            <div className="alert alert-danger mt-5 ml-2 mr-2" role="alert">
                                <span class="fa fa-exclamation-triangle mr-2" />
                                Please sign in or register first
                            </div>
                        }
                    </div>
                </div>
                <div class="mt-4">
                    <ul class="nav nav-tabs tab-profile-link pinkBg pl-5 pr-5 pt-3 pb-0" id="myTab" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link tab-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">My Saved Threads</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link tab-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">My Followed Threads</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link tab-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">My Posts/Questions</a>
                        </li>
                    </ul>
                    <div class="tab-content mb-5 ml-3 mt-3 pr-5 pl-5" id="myTabContent">
                        <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                            {this.state.saved && this.state.saved.map((saved) => (
                                <NavLink class="btn-category" to={`/thread/${saved.postID}`}><li class="list-group-item unanswered"><p class="mr-4 mb-0">{saved.title}{saved.question}</p> </li></NavLink>
                            ))}
                            {!this.state.saved || this.state.saved.length == 0 &&
                                <div class="muted-text mt-3 pl-4 pb-3">
                                    No saved threads yet!
                                    </div>
                            }
                        </div>
                        <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                            {this.state.followed && this.state.followed.map((followed) => (
                                <NavLink class="btn-category" to={`/thread/${followed.postID}`}><li class="list-group-item unanswered"><p class="mr-4 mb-0">{followed.title}{followed.question}</p> </li></NavLink>
                            ))}
                            {!this.state.followed || this.state.followed.length == 0 &&
                                <div class="muted-text mt-3 pl-4 pb-3">
                                    No followed threads yet!
                                    </div>
                            }
                        </div>
                        <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                            {this.state.posted && this.state.posted.map((posted) => (
                                <NavLink class="btn-category" to={`/thread/${posted.postID}`}><li class="list-group-item unanswered"><p class="mr-4 mb-0">{posted.title}{posted.question}</p> </li></NavLink>
                            ))}
                            {!this.state.posted || this.state.posted.length == 0 &&
                                <div class="muted-text mt-3 pl-4 pb-3">
                                    You never posted or asked a question before!
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}