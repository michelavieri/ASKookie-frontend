import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import NavigationRouter2 from './Navigation';
import profilePicture from '../default_pp.png';

export class Profile extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
        };
    }
    componentDidMount() {
        fetch('https://whispering-hamlet-08619.herokuapp.com/home')
            .then(res => res.json())
            .then(res => {
                this.setState({ feeds: res.data }, () => console.log('Data fetched', res));
                if (localStorage.usertoken) {
                    const token = localStorage.usertoken;
                    const decoded = jwt_decode(token);
                    this.setState({ name: decoded.result.username });
                }
            })
    };

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
                        {this.state.name != '' &&
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
                        {this.state.name == '' &&
                            <div className="alert alert-danger mt-5 ml-2 mr-2" role="alert">
                                <span class="fa fa-exclamation-triangle mr-2" />
                                Please sign in or register first
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}