import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import NavigationRouter2 from './Navigation'
import { animateScroll as scroll } from "react-scroll";
import jwt_decode from 'jwt-decode';
import Linkify from 'react-linkify';
import { trackPromise } from 'react-promise-tracker';
import {
    EmailShareButton,
    EmailIcon,
    FacebookShareButton,
    FacebookIcon,
    LineShareButton,
    LineIcon,
    TelegramShareButton,
    TelegramIcon,
    TwitterShareButton,
    TwitterIcon,
    WhatsappShareButton,
    WhatsappIcon,
} from "react-share";


export class Home extends Component {
    constructor() {
        super();
        this.state = {
            feeds: [],
            name: '',
        };
    }
    componentDidMount() {
        trackPromise(
            fetch('https://whispering-hamlet-08619.herokuapp.com/home')
                .then(res => res.json())
                .then(res => {
                    this.setState({ feeds: res.data }, () => console.log('Data fetched', res));
                    if (localStorage.usertoken) {
                        const token = localStorage.usertoken;
                        const decoded = jwt_decode(token);
                        this.setState({ name: decoded.result.username });
                    }
                }));
    };

    componentDecorator = (href, text, key) => (
        <a href={href} key={key} target="_blank" rel="noopener noreferrer">
            {text}
        </a>
    );

    scrollToTop = () => {
        scroll.scrollToTop();
    };

    shuffleArray = () => {
        let i = this.state.feeds.length - 1;
        var array = this.state.feeds.slice();
        for (; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    mostRecent = () => {
        let i = this.state.feeds.length - 1;
        var array = this.state.feeds.slice();
        var j = 0;
        for (; i > j; i--) {
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
            j++;
        }
        return array;
    }


    render() {
        var shuffledPosts = this.shuffleArray();
        var mostRecentPosts = this.mostRecent();

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
                                    <a class="text-dark small" href="mailto:askookieforum@gmail.com">Email us</a>
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
                                <button class="questionButton" style={{ opacity: '50%' }} type="button" data-toggle="modal" data-target="#askModal">
                                    <p class="text-decoration-none stretched-link text-dark pb-0" >What is your Question?</p></button>
                            </div>
                        </div>

                        {/* feeds */}
                        {mostRecentPosts && mostRecentPosts.filter(feeds => feeds.answer != '').map((feeds, index) => (
                            <div class="card mb-3">
                                <div class="card-body pb-1">
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
                                        <li class="feeds-footer">
                                            <button class="btn btn-icon like pr-1 pl-0" title="Like"><i class="fa fa-thumbs-o-up pr-1" /> 256</button>
                                            <button class="btn btn-icon pl-3 pr-1 comment" title="View comments" type="button" data-toggle="modal" data-target="#commentsModal"><i class="fa fa-comment-o pr-1" />10</button>
                                            <div class="btn-group dropright">
                                                <button class="btn btn-icon pl-3 pr-1 share" title="Share" id="shareDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-share" /></button>
                                                <div class="dropdown-menu dropdown-menu-left pb-2" aria-labelledby="shareDropdown">
                                                    <p class="dropdown-item greyBg font-weight-bold pb-2 mb-0" to="#"><i class="fa fa-share pr-2" />Share Thread</p>
                                                    <div class="dropdown-divider mt-0"></div>
                                                    <button class="dropdown-item pl-3" onClick={() => { navigator.clipboard.writeText(`https://askookie.netlify.app/thread/${feeds.postID}`) }}
                                                    ><i class="fa fa-files-o pr-3 fa-lg ml-0" />Copy Link</button>
                                                    <div class="dropdown-divider"></div>
                                                    <WhatsappShareButton class="dropdown-item" url={`https://askookie.netlify.app/thread/${feeds.postID}`}><WhatsappIcon class="pr-2 pl-2" size={50} round={true} />Whatsapp</WhatsappShareButton>
                                                    <div class="dropdown-divider"></div>
                                                    <TwitterShareButton class="dropdown-item" url={`https://askookie.netlify.app/thread/${feeds.postID}`}><TwitterIcon class="pr-2 pl-2" size={50} round={true} />Twitter</TwitterShareButton>
                                                    <div class="dropdown-divider"></div>
                                                    <EmailShareButton class="dropdown-item" url={`https://askookie.netlify.app/thread/${feeds.postID}`}><EmailIcon class="pr-2 pl-2" size={50} round={true} />Email</EmailShareButton>
                                                    <div class="dropdown-divider"></div>
                                                    <TelegramShareButton class="dropdown-item" url={`https://askookie.netlify.app/thread/${feeds.postID}`}><TelegramIcon class="pr-2 pl-2" size={50} round={true} />Telegram</TelegramShareButton>
                                                    <div class="dropdown-divider"></div>
                                                    <LineShareButton class="dropdown-item" url={`https://askookie.netlify.app/thread/${feeds.postID}`}><LineIcon class="pr-2 pl-2" size={50} round={true} />Line</LineShareButton>
                                                </div>
                                            </div>
                                            <button class="btn btn-icon pl-3 save" title="Save thread"><i class="fa fa-bookmark-o" /></button>
                                            <button class="btn btn-icon float-right report" title="Report"><i class="fa fa-exclamation-circle" /></button>
                                            <button class="btn btn-icon dislike float-right" title="Dislike"><i class="fa fa-thumbs-o-down pr-1" /> 2</button>
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
                                {shuffledPosts && shuffledPosts.filter(feeds => feeds.answer == '').slice(0, 6).map((feeds, index) => (
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


                {/* modal for comments */}
                <div id="commentsModal" class="modal fade" role="dialog">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header greyBg">
                                <h4 class="modal-title">Comments (10)</h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body text-left">
                                <p class="ml-3 mr-3">Comments Here</p>
                                <hr class="mt-0 mb-4" />
                                <p class="ml-3 mr-3">Comments Here</p>
                                <hr class="mt-0 mb-4" />
                                <p class="ml-3 mr-3">Comments Here</p>
                                <hr class="mt-0 mb-4" />
                                <p class="ml-3 mr-3">Comments Here</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}