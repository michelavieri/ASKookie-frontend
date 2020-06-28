import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import NavigationRouter2 from './Navigation'
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Linkify from 'react-linkify';

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
        fetch('https://whispering-hamlet-08619.herokuapp.com/home')
            .then(res => res.json())
            .then(res => 
                this.setState(
                    { feeds: res.data }, 
                    () => console.log('Data fetched', res),
                    this.getUserPost(),
                    console.log("userpost" + this.state.user_post),
                    ))
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
        const { id_del } = this.props.match.params.id; //get id from parameter

        e.preventDefault();

        const data_del = { postID: id_del };

        axios
            .delete('https://whispering-hamlet-08619.herokuapp.com/delete', data_del) //delete post with id id_del
            .then(res => {
                console.log(res);
                this.props.history.push(`/home`); //redirect to home
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
        console.log("thisisthe USERNAME", this.state.user);
        console.log("postID", postId);
         axios
             .get('https://whispering-hamlet-08619.herokuapp.com/user/' + postId) //search user who post the question
             .then(res => {
                 //console.log(res.data.data.asker);
                 this.setState({ user_post: res.data.data.asker }); //set user_post 
                 console.log(this.state.user_post);
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
                                <div class="card mb-3 border border-secondary">
                                    <div class="card-body">
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
                                                <hr class="mt-0 mb-4" />
                                            </li>
                                            {feeds.type == "post" &&
                                                    <li>
                                                        <div class="col-sm-9">
                                                            <p class="whiteSpace">{feeds.answer}</p>
                                                        </div>
                                                    </li>
                                            }

                                            {feeds.answer == "" &&
                                                <li>
                                                    {localStorage.usertoken &&
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


                                                            {/* <div class="form-check row pull-left ml-3">
                                                <input class="form-check-input" type="checkbox" value="" id="anonymousCheck" />
                                                <label class="form-check-label" for="anonymousCheck">
                                                    Appear Anonymous to others
                                                </label>
                                            </div> */}
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
                                             {this.state.user == this.state.user_post &&
                                                <button class="btn btn-outline-danger pull-right" onClick={this.handleDelete}><i class = "fa fa-trash mr-2" />Delete</button>
                                            } 
                                        </ul>
                                    </div>
                                </div>

                                {feeds.type != "post" &&
                                    <div>
                                        <h2> <b>Answer: </b></h2>
                                        < Linkify >
                                            {feeds.answer != "" &&
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
                                                                <p class="whiteSpace">{feeds.answer}</p>
                                                            </li>
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

                </div >
            </div>
        )
    }
}