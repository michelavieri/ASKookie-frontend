import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import NavigationRouter2 from './Navigation';
import profilePicture from '../default_pp.png';
import { trackPromise } from 'react-promise-tracker';

export class Profile extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            saved: [],
        };
    }
    componentDidMount() {
        if (localStorage.usertoken) {
            const token = localStorage.usertoken;
            const decoded = jwt_decode(token);
            this.setState({ name: decoded.result.username });
        }
        trackPromise(
            fetch('http://localhost:5000/save/' + `${this.state.username}`)
                .then(res => res.json())
                .then(res => {
                    this.setState({ saved: res.data });
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

                    {/* saved posts */}
                    <div class="col-sm-12 mt-5">
                        <div class="card d-none d-xl-block text-left">
                            <div class="card-header">
                                My Saved Threads
                            </div>
                            <ul class="list-group list-group-flush">
                                {this.state.saved && this.state.saved.map((saved) => (
                                    <NavLink class="btn-category" to={`/thread/${saved.postID}`}><li class="list-group-item unanswered"><p class="mr-4 mb-0"></p> </li></NavLink>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}