import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import NavigationRouter2 from './Navigation'
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { findRenderedDOMComponentWithClass } from 'react-dom/test-utils';

export class Thread extends Component {
    constructor() {
        super();
        this.state = {
            feeds: [],
            answer: "",
            answerer: "",
        };
    }
    componentDidMount() {

        fetch('/home')
            .then(res => res.json())
            .then(res => this.setState({ feeds: res.data }, () => console.log('Data fetched', res)))
    }

    onAnswerChange = e => {
        const token = localStorage.usertoken;
        const decoded = jwt_decode(token);
        this.setState({
            answer: e.target.value,
            answerer: decoded.result.username
        });
    };

    handleSubmit = e => {
        const { id } = this.props.match.params;

        e.preventDefault();

        const data = {
            postID: id,
            answer: this.state.answer,
            answerer: this.state.answerer
        };
        axios
            .post('/answer', data)
            .then(
                res => {
                    console.log(res);
                })
            .catch(err => console.log(err));
    };

    refreshPage() {
        window.location.reload(false);
    }

    render() {
        var urlArray = [];
        var myURL = window.location.href;
        urlArray = myURL.split('/');
        const { answer } = this.state;

        return (
            <div className="container-fluid margin-top">
                <NavigationRouter2 />
                <div class="row content">
                    <div class="col-sm-9 text-left">
                        {this.state.feeds && this.state.feeds.filter(feeds => feeds.postID == urlArray[urlArray.length - 1]).map((feeds, index) => (
                            <div class="card mb-3 border border-secondary">
                                <div class="card-body">
                                    <ul class="list-group">
                                        <li>
                                            <div class="sub-text">
                                                <h8>@ {`${feeds.postID}`}</h8>
                                                {/* &middot; Posted on 17/01/2020 */}
                                            </div>
                                        </li>
                                        <li>

                                            <p class="font-weight-bold lead" to="">{feeds.post}</p>
                                        </li>
                                        <li>
                                            <hr class="mt-0 mb-4" />
                                        </li>
                                        <li>
                                            <form className="post" onSubmit={this.handleSubmit}>
                                                <div class="form-row align-items-left mb-3 ml-3">
                                                    <textarea
                                                        rows="5"
                                                        class="form-control col-sm-9"
                                                        placeholder="What are your thoughts? "
                                                        value={this.state.answer}
                                                        onChange={this.onAnswerChange}
                                                        required />
                                                    <small class="form-text text-muted col-sm-11">
                                                        Inappropriate or irrelevant answers will be filtered accordingly.
                                                </small>
                                                </div>
                                                {!localStorage.usertoken &&
                                                <div className="alert alert-danger" role="alert">
                                                Please sign in to answer this question
                                                </div>}
                                                {/* <div class="form-check row pull-left ml-3">
                                                <input class="form-check-input" type="checkbox" value="" id="anonymousCheck" />
                                                <label class="form-check-label" for="anonymousCheck">
                                                    Appear Anonymous to others
                                                </label>
                                            </div> */}
                                            <br />
                                                <button type="submit" class="btn btn-outline-success my-2 my-sm-0 ml-2 bottom-right" 
                                                onClick={this.refreshPage}>
                                                    Answer
                                                </button>
                                            </form>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ))}
                        <h2> <b>Answer: </b></h2>

                        {/* start answer */}
                        {this.state.feeds && this.state.feeds.filter(feeds => feeds.answer != null).filter(feeds => feeds.postID == urlArray[urlArray.length - 1]).map((feeds, index) => (
                            <div class="card mb-3">
                                <div class="card-body mr-4">
                                    <ul>
                                        <li>
                                            <div class="sub-text">
                                                Posted by
                                        <NavLink class="sub-link" to=""><h8> {feeds.answerer} </h8></NavLink>
                                                {/* &middot; Answered on 17/01/2020 */}
                                            </div>
                                        </li>
                                        <li>
                                            <p>{feeds.answer}</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ))}
                        {/* end of answer */}
                    </div>

                    {/* unanswered Questions */}
                    <div class="col-sm-2">
                        <div class="card d-none d-xl-block text-left" style={{ width: '18rem' }}>
                            <div class="card-header">
                                Unanswered Questions
                            </div>
                            <ul class="list-group list-group-flush">
                                {this.state.feeds && this.state.feeds.filter(feeds => feeds.answer == null).slice(0,6).map((feeds, index) => (
                                    <NavLink class="btn-category" to={`/thread/${feeds.postID}`}><li class="list-group-item unanswered"><p class="mr-4 mb-0">{feeds.post}</p> <i class="fa fa-fw fa-pencil bottom-right icon"></i></li></NavLink>
                                ))}
                            </ul>
                            <div class="card-footer overflow-auto">
                                <button class="btn refresh-button pull-right">
                                    {/* <i class="fa fa-fw fa-refresh mx-lg-1 fa-lg" /> */}
                                    <NavLink class="listku" to="/answer">See More</NavLink></button>
                            </div>
                        </div>
                    </div>
                    {/* end of unanswered Questions */}
                </div>
            </div>
        )
    }
}