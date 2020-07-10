import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import NavigationRouter2 from './Navigation'
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Linkify from 'react-linkify';
import { trackPromise } from 'react-promise-tracker';
import profilePicture from '../default_pp.png';
import TextareaAutosize from 'react-textarea-autosize';
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

export class Thread extends Component {
    constructor() {
        super();
        this.state = {
            feeds: [],
            answers: [],
            answerer: "",
            user: "", //current user
            user_post: "", //user who post a certain question
            time: "",
            commentPostCount: [],
            commentAnsCount: "",
            answerID: "",
            commentsAns: [],
            commentsPost: [],
            comment: "",
            // title: "",
            // post_content: "",
            // anonymous: false,
            // asker: "",
            // question: "",
            // type: ""
        };

        this.getUserPost = this.getUserPost.bind(this);
        this.getPost = this.getPost.bind(this);
    }
    componentDidMount() {
        this.getPost();
        if (localStorage.usertoken) {
            this.getUserPost();
        }
        trackPromise(
            fetch('http://localhost:5000/answer/' + `${this.props.match.params.id}`)
                .then(res => res.json())
                .then(res => {
                    this.setState({ answers: res.data });
                    console.log('Answers fetched', res.data);
                }))
        trackPromise(
            fetch('http://localhost:5000/comments/count/post/' + `${this.props.match.params.id}`)
                .then(res => res.json())
                .then(res => {
                    this.setState({ commentPostCount: res.data[0] });
                    console.log('Count comments Post fetched', res.data[0]);
                }))
        trackPromise(
            fetch('http://localhost:5000/unanswered')
                .then(res => res.json())
                .then(res => {
                    this.setState({ unanswered: res.data }, () => console.log('Unanswered fetched', res.data));
                }))

    }

    getCommentsAns(id) {
        console.log("answerid", id);
        this.setState({
            answerID: id,
        })
        trackPromise(
            fetch('http://localhost:5000/comments/answer/' + id)
                .then(res => res.json())
                .then(res => {
                    this.setState({ commentsAns: res.data });
                    console.log('Comments Answer fetched', res.data);
                }))
    }

    getCommentsPost = () => {
        const { id } = this.props.match.params;
        trackPromise(
            fetch('http://localhost:5000/comments/post/' + id)
                .then(res => res.json())
                .then(res => {
                    this.setState({ commentsPost: res.data });
                    console.log('Comments Post fetched', res.data);
                }))
    }

    onAnswerChange = e => {
        const token = localStorage.usertoken;
        const decoded = jwt_decode(token);

        this.setState({
            answer: e.target.value,
            answerer: decoded.result.username
        });
    };

    onCommentChange = e => {
        const token = localStorage.usertoken;
        const decoded = jwt_decode(token);
        this.setState({
            comment: e.target.value,
            username: decoded.result.username
        })
    }

    handleSubmitPost = e => {
        const { id } = this.props.match.params;

        e.preventDefault();

        const data = {
            postID2: id,
            answer: this.state.answer,
            answerer: this.state.answerer,
            time: new Date().toLocaleDateString(),
        };
        axios
            .post('http://localhost:5000/answer', data)
            .then(
                res => {
                    console.log(res);
                    window.location.reload(false);
                })
            .catch(err => console.log(err));
    };

    handleSubmitCommentPost = e => {
        e.preventDefault();
        const { id } = this.props.match.params;

        const data = {
            comment: this.state.comment,
            username: this.state.username,
            time: new Date().toLocaleDateString(),
            postID: id,
            anonymous: false,
            answerID: null,
        };
        axios
            .post('http://localhost:5000/comment/post', data)
            .then(
                res => {
                    console.log(res);
                    window.location.reload(false);
                })
            .catch(err => console.log(err));
    };

    handleSubmitCommentAns = e => {
        e.preventDefault();

        const data = {
            comment: this.state.comment,
            username: this.state.username,
            time: new Date().toLocaleDateString(),
            answerID: this.state.answerID,
            anonymous: false,
            postID: null,
        };
        axios
            .post('http://localhost:5000/comment/answer', data)
            .then(
                res => {
                    console.log(res);
                    window.location.reload(false);
                })
            .catch(err => console.log(err));
    };

    handleDelete = e => { //deleting post
        const id_del = this.props.match.params.id; //get id from parameter

        e.preventDefault();

        console.log("iddel", id_del);

        axios
            .delete('http://localhost:5000/delete/' + id_del) //delete post with id id_del
            .then(res => {
                console.log(res);
                this.props.history.push(`/`); //redirect to home
                window.location.reload(false);
                console.log("Post deleted");
            })
            .catch(err => console.log(err));
    };

    getUserPost = () => { //get the user who post the question/post
        const postId = this.props.match.params.id; //get post id
        const token = localStorage.usertoken;
        const decoded = jwt_decode(token); //get current cuser

        this.setState({ user: decoded.result.username }); //set current user
        axios
            .get('http://localhost:5000/user/' + postId) //search user who post the question
            .then(res => {
                this.setState({ user_post: res.data.data.asker }); //set user_post 
            })
            .catch(err => console.log(err));
    };

    getPost = () => {
        const postId = this.props.match.params.id; //get post id
        axios.get('http://localhost:5000/thread/' + postId)
            .then(res => {
                this.setState({ feeds: res.data.data });
                // console.log("dataaaaa", res.data.data)
            })
            .catch(err => console.log(err));
    }

    refreshPage() {
        window.location.reload(false);
    }


    render() {
        var urlArray = [];
        var myURL = window.location.href;
        urlArray = myURL.split('/');
        // var feedsArr = [];
        // feedsArr = Object.values(this.state.feeds);

        return (
            <div className="container-fluid margin-top">
                <NavigationRouter2 />
                <div class="row content">
                    {/* {console.log("answerslength:", this.state.answers.length)} */}
                    <div class="col-sm-9 text-left">
                        {/* {feedsArr && feedsArr.map((feeds, index) => ( */}
                        <div>
                            <div class="card border border-secondary">
                                <div class="card-body pb-0">
                                    <ul class="list-group">
                                        <li>
                                            <div class="sub-text">
                                                <h8 class="pr-1">@ {`${this.state.feeds.postID}`}</h8>
                                                    &middot; Posted on {`${this.state.feeds.time}`}
                                                {this.state.feeds.type == "2" &&
                                                    <div>Posted by {this.state.feeds.asker}</div>
                                                }
                                            </div>
                                        </li>
                                        <li>

                                            <p class="font-weight-bold lead" to="">{this.state.feeds.question}{this.state.feeds.title}</p>
                                        </li>
                                        <li>
                                            <hr class="mt-0 mb-4 pb-0 mb-0" />
                                        </li>
                                        {this.state.feeds.type == "2" &&
                                            <li>
                                                <div class="col-sm-9">
                                                    <p class="whiteSpace">{this.state.feeds.post_content}</p>
                                                </div>
                                            </li>
                                        }

                                        {localStorage.usertoken &&
                                            <li class="feeds-footer pb-3">
                                                <button class="btn btn-icon like pr-1 pl-2" title="Like"><i class="fa fa-thumbs-o-up pr-1" /> 256</button>
                                                {this.state.feeds.type == "2" &&
                                                    <button class="btn btn-icon pl-3 pr-1 comment" title="View comments" type="button" data-toggle="modal" data-target="#commentsPostModal"><i class="fa fa-comment-o pr-1" onClick={this.getCommentsPost} />{this.state.commentPostCount.count}</button>
                                                }
                                                <div class="btn-group dropright">
                                                    <button class="btn btn-icon pl-3 pr-1 share" title="Share" id="shareDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-share" /></button>
                                                    <div class="dropdown-menu dropdown-menu-left pb-2" aria-labelledby="shareDropdown">
                                                        <p class="dropdown-item greyBg font-weight-bold pb-2 mb-0" to="#"><i class="fa fa-share pr-2" />Share Thread</p>
                                                        <div class="dropdown-divider mt-0"></div>
                                                        <button class="dropdown-item pl-3" onClick={() => { navigator.clipboard.writeText(`https://askookie.netlify.app/thread/${this.state.feeds.postID}`) }}
                                                        ><i class="fa fa-files-o pr-3 fa-lg ml-0" />Copy Link</button>
                                                        <div class="dropdown-divider"></div>
                                                        <WhatsappShareButton class="dropdown-item" url={`https://askookie.netlify.app/thread/${this.state.feeds.postID}`} title={this.state.feeds.post}><WhatsappIcon class="pr-2 pl-2" size={50} round={true} />Whatsapp</WhatsappShareButton>
                                                        <div class="dropdown-divider"></div>
                                                        <TwitterShareButton class="dropdown-item" url={`https://askookie.netlify.app/thread/${this.state.feeds.postID}`} title={this.state.feeds.post}><TwitterIcon class="pr-2 pl-2" size={50} round={true} />Twitter</TwitterShareButton>
                                                        <div class="dropdown-divider"></div>
                                                        <FacebookShareButton class="dropdown-item" url={`https://askookie.netlify.app/thread/${this.state.feeds.postID}`} quote={this.state.feeds.post} hashtag="#ASKookie"><FacebookIcon class="pr-2 pl-2" size={50} round={true} />Facebook</FacebookShareButton>
                                                        <div class="dropdown-divider"></div>
                                                        <EmailShareButton class="dropdown-item" url={`https://askookie.netlify.app/thread/${this.state.feeds.postID}`} subject="Check this thread in ASKookie!" body={this.state.feeds.post}><EmailIcon class="pr-2 pl-2" size={50} round={true} />Email</EmailShareButton>
                                                        <div class="dropdown-divider"></div>
                                                        <TelegramShareButton class="dropdown-item" url={`https://askookie.netlify.app/thread/${this.state.feeds.postID}`} title={this.state.feeds.post}><TelegramIcon class="pr-2 pl-2" size={50} round={true} />Telegram</TelegramShareButton>
                                                        <div class="dropdown-divider"></div>
                                                        <LineShareButton class="dropdown-item" url={`https://askookie.netlify.app/thread/${this.state.feeds.postID}`} title={this.state.feeds.post}><LineIcon class="pr-2 pl-2" size={50} round={true} />Line</LineShareButton>
                                                    </div>
                                                </div>
                                                <button class="btn btn-icon pl-3 save" title="Save thread"><i class="fa fa-bookmark-o" /></button>
                                                <button class="btn btn-icon float-right report" title="Report" type="button" data-toggle="modal" data-target="#reportModal"><i class="fa fa-exclamation-circle" /></button>
                                                <button class="btn btn-icon dislike float-right" title="Dislike"><i class="fa fa-thumbs-o-down pr-1" /> 2</button>
                                            </li>
                                        }

                                        {!localStorage.usertoken &&
                                            <li class="feeds-footer pb-3">
                                                <button class="btn btn-icon like pr-1 pl-2 disabled" title="Likes"><i class="fa fa-thumbs-o-up pr-1" /> 256</button>
                                                {this.state.feeds.type == "2" &&
                                                    <button class="btn btn-icon pl-3 pr-1 comment" title="View comments" type="button" data-toggle="modal" data-target="#commentsPostModal"><i class="fa fa-comment-o pr-1" onClick={this.getCommentsPost} />{this.state.commentPostCount.count}</button>
                                                }
                                                <div class="btn-group dropright">
                                                    <button class="btn btn-icon pl-3 pr-1 share" title="Share" id="shareDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-share" /></button>
                                                    <div class="dropdown-menu dropdown-menu-left pb-2" aria-labelledby="shareDropdown">
                                                        <p class="dropdown-item greyBg font-weight-bold pb-2 mb-0" to="#"><i class="fa fa-share pr-2" />Share Thread</p>
                                                        <div class="dropdown-divider mt-0"></div>
                                                        <button class="dropdown-item pl-3" onClick={() => { navigator.clipboard.writeText(`https://askookie.netlify.app/thread/${this.state.feeds.postID}`) }}
                                                        ><i class="fa fa-files-o pr-3 fa-lg ml-0" />Copy Link</button>
                                                        <div class="dropdown-divider"></div>
                                                        <WhatsappShareButton class="dropdown-item" url={`https://askookie.netlify.app/thread/${this.state.feeds.postID}`} title={this.state.feeds.post}><WhatsappIcon class="pr-2 pl-2" size={50} round={true} />Whatsapp</WhatsappShareButton>
                                                        <div class="dropdown-divider"></div>
                                                        <TwitterShareButton class="dropdown-item" url={`https://askookie.netlify.app/thread/${this.state.feeds.postID}`} title={this.state.feeds.post}><TwitterIcon class="pr-2 pl-2" size={50} round={true} />Twitter</TwitterShareButton>
                                                        <div class="dropdown-divider"></div>
                                                        <FacebookShareButton class="dropdown-item" url={`https://askookie.netlify.app/thread/${this.state.feeds.postID}`} quote={this.state.feeds.post} hashtag="#ASKookie"><FacebookIcon class="pr-2 pl-2" size={50} round={true} />Facebook</FacebookShareButton>
                                                        <div class="dropdown-divider"></div>
                                                        <EmailShareButton class="dropdown-item" url={`https://askookie.netlify.app/thread/${this.state.feeds.postID}`} subject="Check this thread in ASKookie!" body={this.state.feeds.post}><EmailIcon class="pr-2 pl-2" size={50} round={true} />Email</EmailShareButton>
                                                        <div class="dropdown-divider"></div>
                                                        <TelegramShareButton class="dropdown-item" url={`https://askookie.netlify.app/thread/${this.state.feeds.postID}`} title={this.state.feeds.post}><TelegramIcon class="pr-2 pl-2" size={50} round={true} />Telegram</TelegramShareButton>
                                                        <div class="dropdown-divider"></div>
                                                        <LineShareButton class="dropdown-item" url={`https://askookie.netlify.app/thread/${this.state.feeds.postID}`} title={this.state.feeds.post}><LineIcon class="pr-2 pl-2" size={50} round={true} />Line</LineShareButton>
                                                    </div>
                                                </div>
                                                <button class="btn btn-icon dislike float-right disabled" title="Dislikes"><i class="fa fa-thumbs-o-down pr-1" /> 2</button>
                                            </li>
                                        }


                                        {this.state.feeds.type != "2" &&

                                            <li>
                                                {localStorage.usertoken &&
                                                    <form className="post pb-4" onSubmit={this.handleSubmitPost}>
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


                                                        <div class="form-check row pull-left ml-3">
                                                            <input class="form-check-input" type="checkbox" value="" id="anonymousCheck" />
                                                            <label class="form-check-label" for="anonymousCheck">
                                                                Appear Anonymous to others
                                                </label>
                                                        </div>
                                                        <br />
                                                        <button type="submit" class="btn btn-outline-success my-2 my-sm-0 ml-2 bottom-right">
                                                            Answer
                                                </button>
                                                    </form>
                                                }

                                                {!localStorage.usertoken &&
                                                    <form>
                                                        <div class="form-row align-items-left mb-3 ml-3">
                                                            <textarea
                                                                disabled
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
                                                        <div className="alert alert-danger" role="alert">
                                                            <span class="fa fa-exclamation-triangle mr-2" />
                                                        Please <NavLink class="underline-link alert-danger" to="/signinform">sign in</NavLink> to answer this question
                                                    </div>
                                                    </form>
                                                }
                                            </li>
                                        }

                                        {localStorage.usertoken && this.state.user == this.state.user_post &&
                                            <div>
                                                {/* {console.log("tettt", this.state.user, this.state.user_post)} */}
                                                <button class="btn btn-outline-secondary mb-2" style={{ width: 100 }}><i class="fa fa-pencil mr-2" />Edit</button>
                                                <button class="btn btn-outline-danger mb-2 ml-2" style={{ width: 100 }} type="button" data-toggle="modal" data-target="#deleteModal"><i class="fa fa-trash mr-2" />Delete</button>
                                            </div>
                                        }
                                    </ul>
                                </div>
                            </div>

                            {this.state.feeds.type != "2" &&
                                <div>
                                    <h2 class="pt-5 pb-2"> <b>Answers: </b></h2>
                                    < Linkify >
                                        {this.state.answers && this.state.answers.map((answers) =>
                                            <div>
                                                <div class="card mb-3">
                                                    <div class="card-body mr-4 pb-0">
                                                        <ul>
                                                            <li>
                                                                <div class="sub-text">
                                                                    Posted by {answers.answerer}
                                                                    <div class="pl-0">
                                                                        Answered on {answers.time}
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <p class="whiteSpace">{answers.answer}</p>
                                                            </li>
                                                            {localStorage.usertoken &&
                                                                <li class="feeds-footer">
                                                                    <button class="btn btn-icon like pr-1 pl-0" title="Like"><i class="fa fa-thumbs-o-up pr-1" /> 25</button>
                                                                    <button class="btn btn-icon pl-3 pr-1 comment" title="View comments" type="button" data-toggle="modal" data-target="#commentsModal" onClick={() => this.getCommentsAns(`${answers.answerID}`)}><i class="fa fa-comment-o pr-1" />1</button>
                                                                    {/* <button class="btn btn-icon float-right report" title="Report" type="button" data-toggle="modal" data-target="#reportModal"><i class="fa fa-exclamation-circle" /></button> */}
                                                                    <button class="btn btn-icon dislike float-right" title="Dislike"><i class="fa fa-thumbs-o-down" /> 0</button>
                                                                </li>
                                                            }
                                                            {!localStorage.usertoken &&
                                                                <li class="feeds-footer">
                                                                    <button class="btn btn-icon like pr-1 pl-0 disabled" title="Likes"><i class="fa fa-thumbs-o-up pr-1" /> 25</button>
                                                                    <button class="btn btn-icon pl-3 pr-1 comment" title="Comments" type="button" data-toggle="modal" data-target="#commentsModal" onClick={() => this.getCommentsAns(`${answers.answerID}`)}><i class="fa fa-comment-o pr-1" />1</button>
                                                                    <button class="btn btn-icon dislike float-right disabled" title="Dislikes"><i class="fa fa-thumbs-o-down" /> 0</button>
                                                                </li>
                                                            }
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {!this.state.answers || this.state.answers.length == "0" &&
                                            <div class="card mb-3">
                                                <div class="card-body mr-4">
                                                    <ul>
                                                        <li>
                                                            <div class="muted-text mt-3">
                                                                No answer yet for this question! Your contribution would be appreciated!
                                                                </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        }


                                    </Linkify>
                                </div>
                            }
                            {/* end of answer */}
                        </div>
                        {/* ))} */}
                    </div>
                    {/* unanswered Questions */}
                    <div class="col-sm-2">
                        <div class="card d-none d-xl-block text-left" style={{ width: '13rem' }}>
                            <div class="card-header">
                                Unanswered Questions
                            </div>
                            <ul class="list-group list-group-flush">
                                {this.state.unanswered && this.state.unanswered.slice(0, 6).map((feeds, index) => (
                                    <NavLink class="btn-category" to={`/thread/${feeds.postID}`}><li class="list-group-item unanswered"><p class="mr-4 mb-0">{feeds.question}</p> <i class="fa fa-fw fa-pencil bottom-right icon"></i></li></NavLink>
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
                    {/* end of unanswered Questions */}

                    {/* modal for comments ans */}
                    <div id="commentsModal" class="modal fade" role="dialog">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header blueBg">
                                    <h4 class="modal-title text-white">Comments (4)</h4>
                                    <button type="button" class="close pr-4" data-dismiss="modal">&times;</button>
                                </div>
                                <div class="modal-body text-left pt-0">
                                    <div class="row content mb-0 greyBg pt-4 pb-3">
                                        <div class="col-xl-1 col-md-2 col-sm-2 col-xs-2 pt-3">
                                            <img src={profilePicture} alt="" width="55" class="rounded-circle pl-2 pr-2" />
                                        </div>
                                        <div class="col-xl-11 col-md-10 col-sm-10 col-xs-10">
                                            <p class="font-italic pb-1 mb-0 pl-2">Commenting as Michela Vieri</p>
                                            <form onSubmit={this.handleSubmitCommentAns}>
                                                <TextareaAutosize
                                                    class="col-sm-10 comment-input p-2 pl-4 pr-4"
                                                    placeholder="Add a comment..."
                                                    value={this.state.comment}
                                                    onChange={this.onCommentChange}
                                                    maxRows="5"
                                                    minRows="1"
                                                    required
                                                ></TextareaAutosize>
                                                <button type="submit" class="btn btn-comment align-top ml-2">Add Comment</button>
                                            </form>
                                        </div>

                                    </div>

                                    <hr class="mt-0 mb-4" />

                                    {this.state.commentsAns && this.state.commentsAns.map(comment =>
                                        <div>
                                            <div class="row content">
                                                <div class="col-xl-1 col-md-2 col-sm-2 col-xs-2">
                                                    <img src={profilePicture} alt="" width="55" class="rounded-circle pl-2 pr-2" />
                                                </div>
                                                <div class="col-xl-11 col-md-10 col-sm-10 col-xs-10">
                                                    <p class="font-weight-bold pb-0 mb-0">{comment.username}</p>
                                                    <p class="sub-text pt-0 mt-0">Commented on {comment.time}</p>
                                                </div>
                                                <p class="mr-3 ml-4 whiteSpace">{comment.comment}</p>
                                            </div>
                                            <li class="feeds-footer">
                                                <button class="btn btn-icon like pr-1 pl-2" title="Like"><i class="fa fa-thumbs-o-up pr-1" /> 2</button>
                                                <button class="btn btn-icon float-right report" title="Report" type="button" data-toggle="modal" data-target="#reportModal"><i class="fa fa-exclamation-circle" /></button>
                                                <button class="btn btn-icon dislike float-right" title="Dislike"><i class="fa fa-thumbs-o-down pr-1" /> 1</button>
                                            </li>
                                            <hr class="mt-0 mb-4" />
                                        </div>
                                    )}

                                    {this.state.commentsAns.length == "0" &&
                                        <div class="muted-text mt-3 pl-3 pb-3">
                                            No comments yet!
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* end of modal comments */}

                    {/* modal for comments post */}
                    <div id="commentsPostModal" class="modal fade" role="dialog">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header blueBg">
                                    <h4 class="modal-title text-white">Comments (4)</h4>
                                    <button type="button" class="close pr-4" data-dismiss="modal">&times;</button>
                                </div>
                                <div class="modal-body text-left pt-0">
                                    <div class="row content mb-0 greyBg pt-4 pb-3">
                                        <div class="col-xl-1 col-md-2 col-sm-2 col-xs-2 pt-3">
                                            <img src={profilePicture} alt="" width="55" class="rounded-circle pl-2 pr-2" />
                                        </div>
                                        <div class="col-xl-11 col-md-10 col-sm-10 col-xs-10">
                                            <p class="font-italic pb-1 mb-0 pl-2">Commenting as Michela Vieri</p>
                                            <form onSubmit={this.handleSubmitCommentPost}>
                                                <TextareaAutosize
                                                    class="col-sm-10 comment-input p-2 pl-4 pr-4"
                                                    placeholder="Add a comment..."
                                                    value={this.state.comment}
                                                    onChange={this.onCommentChange}
                                                    maxRows="5"
                                                    minRows="1"
                                                    required
                                                ></TextareaAutosize>
                                                <button type="submit" class="btn btn-comment align-top ml-2">Add Comment</button>
                                            </form>
                                        </div>

                                    </div>

                                    <hr class="mt-0 mb-4" />

                                    {this.state.commentsPost && this.state.commentsPost.map(comment =>
                                        <div>
                                            <div class="row content">
                                                <div class="col-xl-1 col-md-2 col-sm-2 col-xs-2">
                                                    <img src={profilePicture} alt="" width="55" class="rounded-circle pl-2 pr-2" />
                                                </div>
                                                <div class="col-xl-11 col-md-10 col-sm-10 col-xs-10">
                                                    <p class="font-weight-bold pb-0 mb-0">{comment.username}</p>
                                                    <p class="sub-text pt-0 mt-0">Commented on {comment.time}</p>
                                                </div>
                                                <p class="mr-3 ml-4 whiteSpace">{comment.comment}</p>
                                            </div>
                                            <li class="feeds-footer">
                                                <button class="btn btn-icon like pr-1 pl-2" title="Like"><i class="fa fa-thumbs-o-up pr-1" /> 2</button>
                                                <button class="btn btn-icon float-right report" title="Report" type="button" data-toggle="modal" data-target="#reportModal"><i class="fa fa-exclamation-circle" /></button>
                                                <button class="btn btn-icon dislike float-right" title="Dislike"><i class="fa fa-thumbs-o-down pr-1" /> 1</button>
                                            </li>
                                            <hr class="mt-0 mb-4" />
                                        </div>
                                    )}
                                    {this.state.commentsPost.length == "0" &&
                                        <div class="muted-text mt-3 pl-3 pb-3">
                                            No comments yet!
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* end of modal comments */}

                    {/* delete modal */}
                    <div id="deleteModal" class="modal fade" role="dialog">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h4>Delete Post/Question</h4>
                                    <button type="button" class="close pr-4" data-dismiss="modal">&times;</button>
                                </div >
                                <div class="modal-body text-left pt-3 pb-3">
                                    Are you sure you want to delete your post/question?
                                    <div class="row content ml-1 mr-1 pt-5 d-flex justify-content-center">
                                        <button class="btn btn-default col-sm-5 btn-outline-danger mr-2" onClick={this.handleDelete}>Delete</button>
                                        <button type="button" class="btn btn-default col-sm-5 btn-outline-secondary" data-dismiss="modal">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}