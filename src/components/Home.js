import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import NavigationRouter2 from './Navigation'
import { animateScroll as scroll } from "react-scroll";
import jwt_decode from 'jwt-decode';
import Linkify from 'react-linkify';

export class Home extends Component {
    constructor() {
        super();
        this.state = {
            feeds: [],
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
        <a href={href} key={key} target="_blank"  rel="noopener noreferrer">
          {text}
        </a>
      );

    scrollToTop = () => {
        scroll.scrollToTop();
    };

    shuffleArray = () => {
        let i = this.state.feeds.length - 1;
        var array = this.state.feeds;
        for (; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    render() {
        var shuffledPosts = this.shuffleArray();

        return (
            <div class="container-fluid text-center margin-top">
                <NavigationRouter2 />
                <button class="bottom-right-fixed btn bg-yellow btn-lg refresh-button rounded-edge d-none d-xl-block" onClick={() => this.scrollToTop()} id="myBtn" title="Scroll to top"><i class="fa fa-chevron-up"></i></button>
                <div class="row content">
                    <div class="col-sm-2 mr-4">
                        <div class="position-fixed">
                            <div class="card d-none d-xl-block text-left" style={{ width: '11rem' }}>
                                <div class="card-header">
                                    Categories
                                </div>
                                <div class="card-body">
                                    <ul class="list-group list-group-flush large-space">
                                        <NavLink class="listku card-link" to="/faculties"><li>Faculties</li></NavLink>
                                        <NavLink class="listku" to="/accommodation"><li>Accommodation</li></NavLink>
                                        <NavLink class="listku" to="/student_life"><li>Student Life</li></NavLink>
                                        <NavLink class="listku" to="/job_intern"><li>Job/Internship</li></NavLink>
                                        <NavLink class="listku" to="/exchange_noc"><li>Exchange/NOC</li></NavLink>
                                        <NavLink class="listku" to="/others"><li>Others</li></NavLink>
                                    </ul>
                                </div>
                                <div class="card-footer">
                                    <NavLink class="text-dark small" to="/about_us">About us</NavLink>
                                    <br />
                                    <a class="text-dark small" href="mailto:askookie@gmail.com">Email us</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-7 col-sm-push-10 text-left">
                        <div class="card mb-3">
                            <div class="card-body">
                                {this.state.name != '' && <h7 class="card-title" style={{ opacity: '50%' }}>{this.state.name},</h7>}
                                {this.state.name == '' && <h7 class="card-title" style={{ opacity: '50%' }}>Hi,</h7>}
                                <br />
                                <button class="questionButton" type="button" data-toggle="modal" data-target="#askModal">
                                    <p class="text-dark text-decoration-none stretched-link">What is your Question?</p></button>
                            </div>
                        </div>

                        {/* feeds */}
                        {shuffledPosts && shuffledPosts.filter(feeds => feeds.answer != null).map((feeds, index) => (
                            <div class="card mb-3">
                                <div class="card-body">
                                    <ul class="list-group">
                                        <li>
                                            <div class="sub-text">
                                                <NavLink target="_blank" class="sub-link" to={`/thread/${feeds.postID}`}><h8> @{feeds.postID} </h8></NavLink>
                                                &middot; posted by {feeds.answerer}
                                            </div>
                                        </li>
                                        <li>
                                            <NavLink target="_blank" class="btn-category unanswered font-weight-bold lead" to={`thread/${feeds.postID}`}>{feeds.post}</NavLink>
                                        </li>
                                        <li>
                                            <Linkify componentDecorator={this.componentDecorator}>
                                                <div class="show-more" data-type="text" data-number="80">
                                                    <p class="whiteSpace">{feeds.answer}</p>
                                                </div>
                                            </Linkify>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ))}
                        {/* end of feeds */}
                    </div>

                    {/* unanswered questions */}
                    <div class="col-sm-2">
                        <div class="card d-none d-xl-block text-left" style={{ width: '13rem' }}>
                            <div class="card-header">
                                Unanswered Questions
                            </div>
                            <ul class="list-group list-group-flush">
                                {shuffledPosts && shuffledPosts.filter(feeds => feeds.answer == null).slice(0, 6).map((feeds, index) => (
                                    <NavLink class="btn-category" to={`/thread/${feeds.postID}`}><li class="list-group-item unanswered"><p class="mr-4 mb-0">{feeds.post}</p> <i class="fa fa-fw fa-pencil bottom-right icon"></i></li></NavLink>
                                ))}
                            </ul>
                            <div class="card-footer overflow-auto">
                                <button class="btn refresh-button pull-right">
                                    {/* <i class="fa fa-fw fa-refresh mx-lg-1 fa-lg" />
                                    Refresh */}
                                    <NavLink class="listku" to="/answer">See More</NavLink>
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* end of unanswered questions */}
                </div>
            </div >
        )
    }
}