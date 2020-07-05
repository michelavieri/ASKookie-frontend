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
            answer: "",
            answerer: "",
            user: "", //current user
            user_post: "" //user who post a certain question
        };

        this.getUserPost = this.getUserPost.bind(this);
    }
    componentDidMount() {
        trackPromise(
            fetch('https://whispering-hamlet-08619.herokuapp.com/home')
                .then(res => res.json())
                .then(res => {
                    this.setState({ feeds: res.data });
                    console.log('Data fetched', res);
                    if (localStorage.usertoken) {
                        this.getUserPost();
                    }
                }));
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
            .post('https://whispering-hamlet-08619.herokuapp.com/answer', data)
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
            .delete('https://whispering-hamlet-08619.herokuapp.com/delete/' + id_del) //delete post with id id_del
            .then(res => {
                console.log(res);
                this.props.history.push(`/`); //redirect to home
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
            .get('https://whispering-hamlet-08619.herokuapp.com/user/' + postId) //search user who post the question
            .then(res => {
                //console.log(res.data.data.asker);
                this.setState({ user_post: res.data.data.asker }); //set user_post 
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

        return (
            <div className="container-fluid margin-top">
                <NavigationRouter2 />
                <div class="row content">
                    <div class="col-sm-9 text-left">
                        {this.state.feeds && this.state.feeds.filter(feeds => feeds.postID == urlArray[urlArray.length - 1]).map((feeds, index) => (
                            <div>
                                <div class="card border border-secondary">
                                    <div class="card-body pb-0">
                                        <ul class="list-group">
                                            <li>
                                                <div class="sub-text">
                                                    <h8>@ {`${feeds.postID}`}</h8>
                                                    {/* &middot; Posted on 17/01/2020 */}
                                                    {feeds.type == "post" &&
                                                        <div>Posted by {feeds.answerer}</div>
                                                    }
                                                </div>
                                            </li>
                                            <li>

                                                <p class="font-weight-bold lead" to="">{feeds.post}</p>
                                            </li>
                                            <li>
                                                <hr class="mt-0 mb-4 pb-0 mb-0" />
                                            </li>
                                            {feeds.type == "post" &&
                                                <li>
                                                    <div class="col-sm-9">
                                                        <p class="whiteSpace">{feeds.answer}</p>
                                                    </div>
                                                </li>
                                            }

                                            {localStorage.usertoken &&
                                                <li class="feeds-footer pb-3">
                                                    <button class="btn btn-icon like pr-1 pl-2" title="Like"><i class="fa fa-thumbs-o-up pr-1" /> 256</button>
                                                    {feeds.type == "post" &&
                                                        <button class="btn btn-icon pl-3 pr-1 comment" title="View comments" type="button" data-toggle="modal" data-target="#commentsModal"><i class="fa fa-comment-o pr-1" />1</button>
                                                    }
                                                    <div class="btn-group dropright">
                                                        <button class="btn btn-icon pl-3 pr-1 share" title="Share" id="shareDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-share" /></button>
                                                        <div class="dropdown-menu dropdown-menu-left pb-2" aria-labelledby="shareDropdown">
                                                            <p class="dropdown-item greyBg font-weight-bold pb-2 mb-0" to="#"><i class="fa fa-share pr-2" />Share Thread</p>
                                                            <div class="dropdown-divider mt-0"></div>
                                                            <button class="dropdown-item pl-3" onClick={() => { navigator.clipboard.writeText(`https://askookie.netlify.app/thread/${feeds.postID}`) }}
                                                            ><i class="fa fa-files-o pr-3 fa-lg ml-0" />Copy Link</button>
                                                            <div class="dropdown-divider"></div>
                                                            <WhatsappShareButton class="dropdown-item" url={`https://askookie.netlify.app/thread/${feeds.postID}`} title={feeds.post}><WhatsappIcon class="pr-2 pl-2" size={50} round={true} />Whatsapp</WhatsappShareButton>
                                                            <div class="dropdown-divider"></div>
                                                            <TwitterShareButton class="dropdown-item" url={`https://askookie.netlify.app/thread/${feeds.postID}`} title={feeds.post}><TwitterIcon class="pr-2 pl-2" size={50} round={true} />Twitter</TwitterShareButton>
                                                            <div class="dropdown-divider"></div>
                                                            <FacebookShareButton class="dropdown-item" url={`https://askookie.netlify.app/thread/${feeds.postID}`} quote={feeds.post} hashtag="#ASKookie"><FacebookIcon class="pr-2 pl-2" size={50} round={true} />Facebook</FacebookShareButton>
                                                            <div class="dropdown-divider"></div>
                                                            <EmailShareButton class="dropdown-item" url={`https://askookie.netlify.app/thread/${feeds.postID}`} subject="Check this thread in ASKookie!" body={feeds.post}><EmailIcon class="pr-2 pl-2" size={50} round={true} />Email</EmailShareButton>
                                                            <div class="dropdown-divider"></div>
                                                            <TelegramShareButton class="dropdown-item" url={`https://askookie.netlify.app/thread/${feeds.postID}`} title={feeds.post}><TelegramIcon class="pr-2 pl-2" size={50} round={true} />Telegram</TelegramShareButton>
                                                            <div class="dropdown-divider"></div>
                                                            <LineShareButton class="dropdown-item" url={`https://askookie.netlify.app/thread/${feeds.postID}`} title={feeds.post}><LineIcon class="pr-2 pl-2" size={50} round={true} />Line</LineShareButton>
                                                        </div>
                                                    </div>
                                                    <button class="btn btn-icon pl-3 save" title="Save thread"><i class="fa fa-bookmark-o" /></button>
                                                    <button class="btn btn-icon float-right report" title="Report"><i class="fa fa-exclamation-circle" /></button>
                                                    <button class="btn btn-icon dislike float-right" title="Dislike"><i class="fa fa-thumbs-o-down pr-1" /> 2</button>
                                                </li>
                                            }

                                            {!localStorage.usertoken &&
                                                <li class="feeds-footer pb-3">
                                                    <button class="btn btn-icon like pr-1 pl-2 disabled" title="Likes"><i class="fa fa-thumbs-o-up pr-1" /> 256</button>
                                                    {feeds.type == "post" &&
                                                        <button class="btn btn-icon pl-3 pr-1 comment" title="View comments" type="button" data-toggle="modal" data-target="#commentsModal"><i class="fa fa-comment-o pr-1" />1</button>
                                                    }
                                                    <div class="btn-group dropright">
                                                        <button class="btn btn-icon pl-3 pr-1 share" title="Share" id="shareDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-share" /></button>
                                                        <div class="dropdown-menu dropdown-menu-left pb-2" aria-labelledby="shareDropdown">
                                                            <p class="dropdown-item greyBg font-weight-bold pb-2 mb-0" to="#"><i class="fa fa-share pr-2" />Share Thread</p>
                                                            <div class="dropdown-divider mt-0"></div>
                                                            <button class="dropdown-item pl-3" onClick={() => { navigator.clipboard.writeText(`https://askookie.netlify.app/thread/${feeds.postID}`) }}
                                                            ><i class="fa fa-files-o pr-3 fa-lg ml-0" />Copy Link</button>
                                                            <div class="dropdown-divider"></div>
                                                            <WhatsappShareButton class="dropdown-item" url={`https://askookie.netlify.app/thread/${feeds.postID}`} title={feeds.post}><WhatsappIcon class="pr-2 pl-2" size={50} round={true} />Whatsapp</WhatsappShareButton>
                                                            <div class="dropdown-divider"></div>
                                                            <TwitterShareButton class="dropdown-item" url={`https://askookie.netlify.app/thread/${feeds.postID}`} title={feeds.post}><TwitterIcon class="pr-2 pl-2" size={50} round={true} />Twitter</TwitterShareButton>
                                                            <div class="dropdown-divider"></div>
                                                            <FacebookShareButton class="dropdown-item" url={`https://askookie.netlify.app/thread/${feeds.postID}`} quote={feeds.post} hashtag="#ASKookie"><FacebookIcon class="pr-2 pl-2" size={50} round={true} />Facebook</FacebookShareButton>
                                                            <div class="dropdown-divider"></div>
                                                            <EmailShareButton class="dropdown-item" url={`https://askookie.netlify.app/thread/${feeds.postID}`} subject="Check this thread in ASKookie!" body={feeds.post}><EmailIcon class="pr-2 pl-2" size={50} round={true} />Email</EmailShareButton>
                                                            <div class="dropdown-divider"></div>
                                                            <TelegramShareButton class="dropdown-item" url={`https://askookie.netlify.app/thread/${feeds.postID}`} title={feeds.post}><TelegramIcon class="pr-2 pl-2" size={50} round={true} />Telegram</TelegramShareButton>
                                                            <div class="dropdown-divider"></div>
                                                            <LineShareButton class="dropdown-item" url={`https://askookie.netlify.app/thread/${feeds.postID}`} title={feeds.post}><LineIcon class="pr-2 pl-2" size={50} round={true} />Line</LineShareButton>
                                                        </div>
                                                    </div>
                                                    <button class="btn btn-icon dislike float-right disabled" title="Dislikes"><i class="fa fa-thumbs-o-down pr-1" /> 2</button>
                                                </li>
                                            }


                                            {feeds.type != "post" &&

                                                <li>
                                                    {localStorage.usertoken &&
                                                        <form className="post pb-4" onSubmit={this.handleSubmit}>
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
                                                <button class="btn btn-outline-danger" style={{ width: 100 }} onClick={this.handleDelete}><i class="fa fa-trash mr-2" />Delete</button>
                                            }
                                        </ul>
                                    </div>
                                </div>

                                {feeds.type != "post" &&
                                    <div>
                                        <h2> <b>Answers: </b></h2>
                                        < Linkify >
                                            {feeds.answer != "" &&
                                                <div class="card mb-3">
                                                    <div class="card-body mr-4 pb-0">
                                                        <ul>
                                                            <li>
                                                                <div class="sub-text">
                                                                    Posted by {feeds.answerer}
                                                                    <div class="pl-0">
                                                                        Answered on 17/01/2020
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <p class="whiteSpace">{feeds.answer}</p>
                                                            </li>
                                                            {localStorage.usertoken &&
                                                                <li class="feeds-footer">
                                                                    <button class="btn btn-icon like pr-1 pl-0" title="Like"><i class="fa fa-thumbs-o-up pr-1" /> 25</button>
                                                                    <button class="btn btn-icon pl-3 pr-1 comment" title="View comments" type="button" data-toggle="modal" data-target="#commentsModal"><i class="fa fa-comment-o pr-1" />1</button>
                                                                    <button class="btn btn-icon float-right report" title="Report"><i class="fa fa-exclamation-circle" /></button>
                                                                    <button class="btn btn-icon dislike float-right" title="Dislike"><i class="fa fa-thumbs-o-down pr-1" /> 0</button>
                                                                </li>
                                                            }
                                                            {!localStorage.usertoken &&
                                                                <li class="feeds-footer">
                                                                    <button class="btn btn-icon like pr-1 pl-0 disabled" title="Likes"><i class="fa fa-thumbs-o-up pr-1" /> 25</button>
                                                                    <button class="btn btn-icon pl-3 pr-1 comment" title="Comments" type="button" data-toggle="modal" data-target="#commentsModal"><i class="fa fa-comment-o pr-1" />1</button>
                                                                    <button class="btn btn-icon dislike float-right disabled" title="Dislikes"><i class="fa fa-thumbs-o-down pr-1" /> 0</button>
                                                                </li>
                                                            }
                                                        </ul>
                                                    </div>
                                                </div>
                                            }
                                            {feeds.answer == "" &&
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
                        ))}
                    </div>
                    {/* unanswered Questions */}
                    <div class="col-sm-2">
                        <div class="card d-none d-xl-block text-left" style={{ width: '18rem' }}>
                            <div class="card-header">
                                Unanswered Questions
                            </div>
                            <ul class="list-group list-group-flush">
                                {this.state.feeds && this.state.feeds.filter(feeds => feeds.answer == "").slice(0, 6).map((feeds, index) => (
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

                    {/* modal for comments */}
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
                                            <form>
                                                <TextareaAutosize
                                                    class="col-sm-10 comment-input p-2 pl-4 pr-4"
                                                    placeholder="Add a comment..."
                                                    maxRows="5"
                                                    minRows="1"
                                                    required
                                                ></TextareaAutosize>
                                                <button type="submit" class="btn btn-comment align-top ml-2">Add Comment</button>
                                            </form>
                                        </div>

                                    </div>

                                    <hr class="mt-0 mb-4" />

                                    <div class="row content">
                                        <div class="col-xl-1 col-md-2 col-sm-2 col-xs-2">
                                            <img src={profilePicture} alt="" width="55" class="rounded-circle pl-2 pr-2" />
                                        </div>
                                        <div class="col-xl-11 col-md-10 col-sm-10 col-xs-10">
                                            <p class="font-weight-bold pb-0 mb-0">Michela Vieri</p>
                                            <p class="sub-text pt-0 mt-0">Answered on 15/07/2020</p>
                                        </div>
                                        <p class="mr-3 ml-4 whiteSpace">I think this post is a very good answer thus i would like to try here if i have a very very very long paragraph what will it look like</p>
                                    </div>
                                    <li class="feeds-footer">
                                        <button class="btn btn-icon like pr-1 pl-2" title="Like"><i class="fa fa-thumbs-o-up pr-1" /> 2</button>
                                        <button class="btn btn-icon float-right report" title="Report"><i class="fa fa-exclamation-circle" /></button>
                                        <button class="btn btn-icon dislike float-right" title="Dislike"><i class="fa fa-thumbs-o-down pr-1" /> 1</button>
                                    </li>
                                    <hr class="mt-0 mb-4" />
                                    <div class="row content">
                                        <div class="col-xl-1 col-md-2 col-sm-2 col-xs-2">
                                            <img src={profilePicture} alt="" width="55" class="rounded-circle pl-2 pr-2" />
                                        </div>
                                        <div class="col-xl-11 col-md-10 col-sm-10 col-xs-10">
                                            <p class="font-weight-bold pb-0 mb-0">Michela Vieri</p>
                                            <p class="sub-text pt-0 mt-0">Answered on 15/07/2020</p>
                                        </div>
                                        <p class="mr-3 ml-4 whiteSpace">I think this post is a very good answer thus i would like to try here if i have a very very very long paragraph what will it look like</p>
                                    </div>
                                    <li class="feeds-footer">
                                        <button class="btn btn-icon like pr-1 pl-2" title="Like"><i class="fa fa-thumbs-o-up pr-1" /> 2</button>
                                        <button class="btn btn-icon float-right report" title="Report"><i class="fa fa-exclamation-circle" /></button>
                                        <button class="btn btn-icon dislike float-right" title="Dislike"><i class="fa fa-thumbs-o-down pr-1" /> 1</button>
                                    </li>
                                    <hr class="mt-0 mb-4" />
                                    <div class="row content">
                                        <div class="col-xl-1 col-md-2 col-sm-2 col-xs-2">
                                            <img src={profilePicture} alt="" width="55" class="rounded-circle pl-2 pr-2" />
                                        </div>
                                        <div class="col-xl-11 col-md-10 col-sm-10 col-xs-10">
                                            <p class="font-weight-bold pb-0 mb-0">Michela Vieri</p>
                                            <p class="sub-text pt-0 mt-0">Answered on 15/07/2020</p>
                                        </div>
                                        <p class="mr-3 ml-4 whiteSpace">I think this post is a very good answer thus i would like to try here if i have a very very very long paragraph what will it look like</p>
                                    </div>
                                    <li class="feeds-footer">
                                        <button class="btn btn-icon like pr-1 pl-2" title="Like"><i class="fa fa-thumbs-o-up pr-1" /> 2</button>
                                        <button class="btn btn-icon float-right report" title="Report"><i class="fa fa-exclamation-circle" /></button>
                                        <button class="btn btn-icon dislike float-right" title="Dislike"><i class="fa fa-thumbs-o-down pr-1" /> 1</button>
                                    </li>
                                    <hr class="mt-0 mb-4" />
                                    <div class="row content">
                                        <div class="col-xl-1 col-md-2 col-sm-2 col-xs-2">
                                            <img src={profilePicture} alt="" width="55" class="rounded-circle pl-2 pr-2" />
                                        </div>
                                        <div class="col-xl-11 col-md-10 col-sm-10 col-xs-10">
                                            <p class="font-weight-bold pb-0 mb-0">Michela Vieri</p>
                                            <p class="sub-text pt-0 mt-0">Answered on 15/07/2020</p>
                                        </div>
                                        <p class="mr-3 ml-4 whiteSpace">I think this post is a very good answer thus i would like to try here if i have a very very very long paragraph what will it look like</p>
                                    </div>
                                    <li class="feeds-footer">
                                        <button class="btn btn-icon like pr-1 pl-2" title="Like"><i class="fa fa-thumbs-o-up pr-1" /> 2</button>
                                        <button class="btn btn-icon float-right report" title="Report"><i class="fa fa-exclamation-circle" /></button>
                                        <button class="btn btn-icon dislike float-right" title="Dislike"><i class="fa fa-thumbs-o-down pr-1" /> 1</button>
                                    </li>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* end of modal comments */}
                </div >
            </div>
        )
    }
}