import React, { Component } from 'react';
import { NavLink, Link, withRouter } from 'react-router-dom';
import { animateScroll as scroll } from "react-scroll";
import logo from '../logo.png';
import profilePicture from '../default_pp.png';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Image } from "cloudinary-react";
import { trackPromise } from 'react-promise-tracker';

class Navigation extends Component {
    logOut(e) {
        e.preventDefault();
        localStorage.removeItem('usertoken');
        this.props.history.push(``);
        window.location.reload(false);
    }
    constructor() {
        super();
        this.state = {
            feeds_nav: [],
            query: "",
            filteredData: [],
            question: "",
            title: "",
            category: "",
            asker: "",
            answerer: "",
            type: "",
            answer: "",
            anonymous: false,
            time: "",
            post_content: "",
            report: "",
            isOpen: false,
            value: undefined,
            notifications: [],
            name: "",
            image: "",
        };

        this.onPostChange = this.onPostChange.bind(this);
        this.onQuestionChange = this.onQuestionChange.bind(this);
        this.onCategoryChange = this.onCategoryChange.bind(this);
        this.onTitleChange = this.onTitleChange.bind(this);
        this.handleSubmitAsk = this.handleSubmitAsk.bind(this);
        this.handleSubmitPost = this.handleSubmitPost.bind(this);
    }

    componentDidMount() {
        if (localStorage.usertoken) {
            const token = localStorage.usertoken;
            const decoded = jwt_decode(token);
            var type;
            if (decoded.result.member_type == 1) {
                type = "Administrator"
            } else if (decoded.result.member_type == 2) {
                type = "NUS Member"
            } else if (decoded.result.member_type == 3) {
                type = "Non-NUS Member"
            }
            this.setState({
                member_type: type,
                name: decoded.result.username
            })

            fetch('https://whispering-hamlet-08619.herokuapp.com/notification/' + `${decoded.result.username}`)
                .then(res => res.json())
                .then(res => {
                    this.setState({ notifications: res.data });
                });
            trackPromise(
                fetch('https://whispering-hamlet-08619.herokuapp.com/profile/' + `${decoded.result.username}`)
                    .then(res => res.json())
                    .then(res => {
                        this.setState({ image: res.data[0].publicID });
                    }))
        }
    }

    mostRecent = () => {
        let i = this.state.notifications.length - 1;
        var array = this.state.notifications.slice();
        var j = 0;
        for (; i > j; i--) {
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
            j++;
        }
        return array;
    }

    onPostChange = e => {
        const token = localStorage.usertoken;
        const decoded = jwt_decode(token);
        this.setState({
            post_content: e.target.value,
            asker: decoded.result.username,
        });
    };

    onQuestionChange = e => {
        const token = localStorage.usertoken;
        const decoded = jwt_decode(token);
        this.setState({
            question: e.target.value,
            asker: decoded.result.username,
        });
    };

    onTitleChange = e => {
        const token = localStorage.usertoken;
        const decoded = jwt_decode(token);
        this.setState({
            title: e.target.value,
            answerer: decoded.result.username
        });
    };

    onCategoryChange = e => {
        this.setState({
            category: e.target.value,
        });
    };

    handleSubmitAsk = e => {
        e.preventDefault();

        const data = {
            question: this.state.question,
            category: this.state.category,
            asker: this.state.asker,
            type_post: 1,
            anonymous: true,
            post_content: this.state.post_content,
            title: "",
            time: new Date().toLocaleDateString(),
        };

        axios
            .post('https://whispering-hamlet-08619.herokuapp.com/ask', data)
            .then(res => {
                this.props.history.push(`/thread/${res.data.data.insertId}`);
                window.location.reload(false);
            })
            .catch(err => console.log(err));
    };

    handleSubmitPost = e => {
        e.preventDefault();
        const data = {
            title: this.state.title,
            category: this.state.category,
            asker: this.state.asker,
            type_post: 2,
            post_content: this.state.post_content,
            anonymous: this.state.anonymous,
            time: new Date().toLocaleDateString(),

        };
        console.log(data);
        axios
            .post('https://whispering-hamlet-08619.herokuapp.com/ask', data)
            .then(res => {
                this.props.history.push(`/thread/${res.data.data.insertId}`);
                window.location.reload(false);
            })
            .catch(err => console.log(err));
    };

    onChangeReport = e => {
        this.setState({
            report: e.target.value,
        })
    }

    handleSubmitReport = e => {
        e.preventDefault();
        const { id } = this.props.match.params;
        const token = localStorage.usertoken;
        const decoded = jwt_decode(token);

        const data = {
            postID: id,
            username: decoded.result.username,
            type: this.state.report,
        };
        axios
            .post('https://whispering-hamlet-08619.herokuapp.com/report', data)
            .then(res => {
                window.location.reload(false);
            })
            .catch(err => {
                console.log(err);
            });
    };

    handleInputChange = e => {
        this.setState({
            query: e.target.value
        });
    }

    getUsername() {
        const token = localStorage.usertoken
        if (token) {
            const decoded = jwt_decode(token);
            return (
                <b> {decoded.result.username} </b>
            );
        }
    };

    refreshPage() {
        window.location.reload(false);
    };


    scrollToTop = () => {
        scroll.scrollToTop();
    };

    readNotif = (id) => {
        axios
            .post('https://whispering-hamlet-08619.herokuapp.com/read/' + `${id}`)
            .then(
                res => {
                    var array = [...this.state.notifications]; // make a separate copy of the array
                    var index;
                    for (var i = 0; i < array.length; i++) {
                        if (array[i].notificationID == id) {
                            index = i;
                            break;
                        }
                    }
                    array.splice(index, 1);
                    this.setState({ notifications: array });

                })
            .catch(err => console.log(err));
    }

    render() {
        const { isOpen, value } = this.state;
        var mostRecentNotif = this.mostRecent();
        return (
            <div className="container-fluid">
                <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-yellow">
                    <NavLink className="navbar-brand smooth-scroll" onClick={() => this.scrollToTop()} to="/">
                        <img src={logo} className="img-fluid" alt="" />
                    </NavLink>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="fa fa-bars"></i>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarText">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <NavLink className="nav-link px-lg-5" to="/" exact activeStyle={{
                                    color: 'white',
                                    borderBottom: '3px solid #4D60A5',
                                }}><i className="fa fa-fw fa-home fa-lg d-none d-xl-inline"></i> Home <span className="sr-only">(current)</span></NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link px-lg-5" to="/answer"
                                    activeStyle={{
                                        color: 'white',
                                        borderBottom: '3px solid #4D60A5',
                                    }}>
                                    <i className="fa fa-fw fa-pencil-square-o mx-lg-1 fa-lg d-none d-xl-inline"></i>Answer</NavLink>
                            </li>

                        </ul>

                        <div style={{ width: 300 }} className="form-inline">
                            <input type="text" id="searchSelect"
                                onChange={this.handleInputChange}
                                placeholder="Search..."
                                autoComplete="off"
                                className="form-control"
                                style={{ width: 250 }}
                                required
                            />
                            {this.state.query != "" &&
                                <a href={`/search/${this.state.query}`}><button className="btn"><i className="fa fa-search mb-2 blue"></i></button></a>
                            }
                        </div>

                        {/* modal button */}
                        <button className="btn btn-orange my-2 my-sm-0 ml-3" type="button" data-toggle="modal" data-target="#askModal">Ask / Post</button>


                        <ul className="navbar-nav">
                            <li className="nav-item dropdown nav-icon">
                                <NavLink className="nav-link icon" to="#" id="notifDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {this.state.notifications.length == 0 &&
                                        <i className="fa fa-fw fa-bell fa-lg mt-2"></i>
                                    }
                                    {this.state.notifications.length != 0 &&
                                        <i className="fa fa-fw fa-bell fa-lg mt-2">
                                            <span className="fa fa-circle"></span>
                                        </i>
                                    }
                                </NavLink>
                                <div className="dropdown-menu notif dropdown-menu-right" style={{ maxHeight: 280 }} aria-labelledby="notifDropdown">
                                    {mostRecentNotif && mostRecentNotif.map(notifications =>
                                        <div>
                                            <a onClick={() => this.readNotif(`${notifications.notificationID}`)} className="dropdown-item mt-2" href={`/thread/${notifications.postID}`}>
                                                {notifications.type == 1 &&
                                                    <div>
                                                        Someone has answered a question from thread @{notifications.postID} : <i>"{notifications.question}"</i>
                                                    </div>
                                                }
                                                {notifications.type == 2 &&
                                                    <div>
                                                        Someone has commented on post @{notifications.postID} : <i>"{notifications.title}"</i>
                                                    </div>
                                                }
                                                {notifications.type == 3 &&
                                                    <div className="font-weight-bold">
                                                        Someone has answered your question @{notifications.postID} : <i>"{notifications.question}"</i>
                                                    </div>
                                                }
                                                {notifications.type == 4 &&
                                                    <div>
                                                        Someone has liked your post @{notifications.postID}
                                                    </div>
                                                }
                                                {notifications.type == 5 &&
                                                    <div>
                                                        Someone has liked your answer on thread @{notifications.postID} : <i>"{notifications.question}"</i>
                                                    </div>
                                                }
                                                {notifications.type == 6 &&
                                                    <div>
                                                        Someone has liked your comment on thread @{notifications.postID} : <i>"{notifications.question}{notifications.title}"</i>
                                                    </div>
                                                }
                                                {notifications.type == 7 &&
                                                    <div>
                                                        Someone has commented on your post @{notifications.postID} : <i>"{notifications.title}"</i>
                                                    </div>
                                                }
                                                {notifications.type == 8 &&
                                                    <div>
                                                        Someone has commented on your answer at thread @{notifications.postID} : <i>"{notifications.question}"</i>
                                                    </div>
                                                }
                                            </a>
                                            <button className="btn red" onClick={() => this.readNotif(`${notifications.notificationID}`)} style={{ fontSize: 12 }}>DISMISS</button>
                                            <div className="dropdown-divider"></div>
                                        </div>
                                    )}
                                    {this.state.notifications.length == 0 &&
                                    <div className="dropdown-item mt-2 mb-2 muted-text disabled">
                                        No Notifications for now!
                                    </div>
                                    }

                                </div>
                            </li>
                            {localStorage.usertoken &&
                                <li className="nav-item dropdown nav-icon">
                                    <NavLink className="nav-link icon" to="#" id="notifDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        {this.state.image == null &&
                                            <img src={profilePicture} alt="" width="38" className="rounded-circle" />
                                        }
                                        {this.state.image != null &&
                                            <Image cloudName="askookie" className="rounded-circle" publicId={this.state.image} width="38" crop="scale" />
                                        }
                                    </NavLink>
                                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="notifDropdown">
                                        <NavLink className="dropdown-item" to="/profile" >
                                            Signed in as <br /> {this.getUsername()}

                                            {/* <div className="dropdown-divider"></div> */}
                                            <p className="red"><b><i>{this.state.member_type}</i></b></p>
                                        </NavLink>
                                        <div className="dropdown-divider"></div>
                                        <NavLink className="dropdown-item content-dropdown" to="/profile" >
                                            My Saved Threads
                                        </NavLink>
                                        <NavLink className="dropdown-item content-dropdown" to="/profile" >
                                            My Followed Threads
                                        </NavLink>
                                        <NavLink className="dropdown-item content-dropdown" to="/profile" >
                                            My Posts/Questions
                                        </NavLink>
                                        <div className="dropdown-divider"></div>
                                        <a className="dropdown-item content-dropdown" href="mailto:askookieforum@gmail.com">Help</a>
                                        <NavLink className="dropdown-item mb-2 content-dropdown" to={``} onClick={this.logOut.bind(this)}>Logout</NavLink>
                                    </div>
                                </li>
                            }
                            {!localStorage.usertoken &&
                                <li className="mr-3 btn-group">
                                    <button className="btn btn-navbar ml-2 mr-2"><NavLink className="link-navbar" to="/signinform">Sign in</NavLink></button>
                                    <button className="btn btn-outline-dark d-xl-inline d-none d-sm-inline"><NavLink className="link-register" to="/register">Register</NavLink></button>
                                </li>
                            }
                        </ul>
                    </div>
                </nav>
                {/* modal ask  */}
                {localStorage.usertoken &&
                    <div id="askModal" className="modal fade" role="dialog">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header pinkBg pb-0">
                                    <div className="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                                        <a className="nav-link tab-link active" id="nav-ask-tab" data-toggle="tab" href="#nav-ask" role="tab" aria-controls="nav-ask" aria-selected="true">Ask a Question</a>
                                        <a className="nav-link tab-link" id="nav-post-tab" data-toggle="tab" href="#nav-post" role="tab" aria-controls="nav-post" aria-selected="false">Make a New Post</a>

                                    </div>
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                </div>

                                <div className="tab-content py-3 px-3 px-sm-0" id="nav-tabContent">
                                    <div className="tab-pane fade show active ml-5 text-left mr-5" id="nav-ask" role="tabpanel" aria-labelledby="nav-ask-tab">
                                        <form className="ask" onSubmit={this.handleSubmitAsk}>
                                            <div className="form-row mb-3">
                                                <div className="form-row mb-3">
                                                    <label for="inputQuestion" className="col-sm-2 col-form-label font-weight-bold">Your Question</label>
                                                    <textarea
                                                        rows="2"
                                                        className="form-control col-sm-9"
                                                        value={this.state.question}
                                                        onChange={this.onQuestionChange}
                                                        aria-describedby="questionHere"
                                                        placeholder="Start your question with 'What', 'Why', 'How', etc. "
                                                        required
                                                    />
                                                    <small id="questionTips" className="form-text text-muted col-sm-11">
                                                        Make sure your question has not been asked already and keep your question short.
                                                        </small>
                                                </div>

                                                <label for="inputQuestion" className="col-sm-2 col-form-label font-weight-bold">Category</label>
                                                <select
                                                    onChange={this.onCategoryChange}
                                                    value={this.state.category}
                                                    className="form-control col-sm-9"
                                                    required>
                                                    <option value="">Choose one...</option>
                                                    <option value="1">Faculties</option>
                                                    <option value="2">Accommodation</option>
                                                    <option value="3">Student Life</option>
                                                    <option value="4">Job/Internship</option>
                                                    <option value="5">Exchange Program/NOC</option>
                                                    <option value="6">Others</option>
                                                </select>
                                                <small id="questionWarning" className="form-text text-muted col-sm-11">
                                                    Your question will be posted anonymously but any inapporpriate content will be filtered.
                                                    </small>
                                            </div>
                                            <div className="modal-footer mb-0 pb-0">
                                                <button type="button" className="btn btn-default far-right" data-dismiss="modal">Cancel</button>
                                                <button type="submit" className="btn btn-orange my-2 my-sm-0 ml-2">Add Question</button>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="tab-pane fade ml-5 mr-5" id="nav-post" role="tabpanel" aria-labelledby="nav-post-tab">
                                        <form className="post" onSubmit={this.handleSubmitPost}>
                                            <div className="form-row align-items-left mb-3 text-left">
                                                <div className="form-row align-items-left mb-3">
                                                    <label for="inputQuestion" className="col-sm-2 col-form-label font-weight-bold">Post Title</label>
                                                    <input
                                                        className="form-control col-sm-9 font-weight-bold"
                                                        value={this.state.title}
                                                        onChange={this.onTitleChange}
                                                        aria-describedby="titleHere"
                                                        placeholder="Give a Meaningful Title to Your Post..."
                                                        required
                                                    />
                                                    <label for="inputQuestion" className="col-sm-2 col-form-label font-weight-bold">Your Post</label>
                                                    <textarea
                                                        rows="5"
                                                        className="form-control col-sm-9 mt-3"
                                                        value={this.state.post_contents}
                                                        onChange={this.onPostChange}
                                                        aria-describedby="postHere"
                                                        placeholder="Write your post here..."
                                                        required
                                                    />
                                                    <small id="passwordHelpBlock" className="form-text text-muted col-sm-11">
                                                        Try to keep your post clear and short to engage readers to read your message.
                                                        </small>
                                                </div>

                                                <label for="inputQuestion" className="col-sm-2 col-form-label font-weight-bold">Category</label>
                                                <select
                                                    onChange={this.onCategoryChange}
                                                    value={this.state.category}
                                                    className="form-control col-sm-9"
                                                    required>
                                                    <option value="">Choose one...</option>
                                                    <option value="1">Faculties</option>
                                                    <option value="2">Accommodation</option>
                                                    <option value="3">Student Life</option>
                                                    <option value="4">Job/Internship</option>
                                                    <option value="5">Exchange Program/NOC</option>
                                                    <option value="6">Others</option>
                                                </select>
                                                <small id="postWarning" className="form-text text-muted col-sm-11">
                                                    Your post will not be anonymous and any inapporpriate content will be filtered by us.
                                                    </small>
                                            </div>
                                            <div className="modal-footer mb-0 pb-0">
                                                <button type="button" className="btn btn-default far-right" data-dismiss="modal">Cancel</button>
                                                <button type="submit" className="btn btn-orange my-2 my-sm-0 ml-2">Add Post</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {!localStorage.usertoken &&
                    <div id="askModal" className="modal fade" role="dialog">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header pinkBg">
                                    <h4 className="modal-title text-white">Please Sign In to Ask a Question</h4>
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div className="modal-body text-left">
                                    <p className="font-weight-bold ml-3 mr-3">Only Registered Users are allowed to post or answer a question.</p>
                                    <div className="alert alert-danger mt-5 ml-2 mr-2" role="alert">
                                        <span className="fa fa-exclamation-triangle mr-2" />
                                        Please sign in to ask a question
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {/* modal for report */}
                <div id="reportModal" className="modal fade" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Report <i className="fa fa-exclamation-circle pl-2" /></h4>
                                <button type="button" className="close pr-4" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body text-left pt-2">
                                <form onSubmit={this.handleSubmitReport}>
                                    <div className="custom-control custom-radio">
                                        <input type="radio" id="customRadio1" name="customRadio" className="custom-control-input" value="Spam" onClick={this.onChangeReport} required />
                                        <label className="custom-control-label" for="customRadio1" >Spam</label>
                                    </div>
                                    <div className="custom-control custom-radio pt-2">
                                        <input type="radio" id="customRadio2" name="customRadio" className="custom-control-input" value="Harrassment" onClick={this.onChangeReport} />
                                        <label className="custom-control-label" for="customRadio2" >Harrassment</label>
                                    </div>
                                    <div className="custom-control custom-radio pt-2">
                                        <input type="radio" id="customRadio3" name="customRadio" className="custom-control-input" value="Joke_Troll" onClick={this.onChangeReport} />
                                        <label className="custom-control-label" for="customRadio3" >Joke/Troll</label>
                                    </div>
                                    <div className="custom-control custom-radio pt-2">
                                        <input type="radio" id="customRadio4" name="customRadio" className="custom-control-input" value="Poorly_Written" onClick={this.onChangeReport} />
                                        <label className="custom-control-label" for="customRadio4">Poorly Written</label>
                                    </div>
                                    <div className="custom-control custom-radio pt-2">
                                        <input type="radio" id="customRadio5" name="customRadio" className="custom-control-input" value="Plagiarism" onClick={this.onChangeReport} />
                                        <label className="custom-control-label" for="customRadio5">Plagiarism</label>
                                    </div>
                                    <div className="custom-control custom-radio pt-2">
                                        <input type="radio" id="customRadio6" name="customRadio" className="custom-control-input" value="Doesnt_Answer" onClick={this.onChangeReport} />
                                        <label className="custom-control-label" for="customRadio6">Doesn't Answer the Question</label>
                                    </div>
                                    <div className="custom-control custom-radio pt-2">
                                        <input type="radio" id="customRadio7" name="customRadio" className="custom-control-input" value="Disturbing_Content" onClick={this.onChangeReport} />
                                        <label className="custom-control-label" for="customRadio7">Disturbing Content</label>
                                    </div>
                                    <div className="custom-control custom-radio pt-2">
                                        <input type="radio" id="customRadio8" name="customRadio" className="custom-control-input" value="False_Info" onClick={this.onChangeReport} />
                                        <label className="custom-control-label" for="customRadio8">Spreading False Information/Inaccurate</label>
                                    </div>
                                    <div className="custom-control custom-radio pt-2">
                                        <input type="radio" id="customRadio9" name="customRadio" className="custom-control-input" value="Spread_Hate" onClick={this.onChangeReport} />
                                        <label className="custom-control-label" for="customRadio9">Spreading Hate</label>
                                    </div>
                                    <div className="custom-control custom-radio pb-2 pt-2">
                                        <input type="radio" id="customRadio10" name="customRadio" className="custom-control-input" value="Adult_Content" onClick={this.onChangeReport} />
                                        <label className="custom-control-label" for="customRadio10">Adult Content</label>
                                    </div>

                                    <div className="modal-footer mb-0 pb-0">
                                        <button type="button" className="btn btn-default far-right" data-dismiss="modal">Cancel</button>
                                        <button type="submit" className="btn btn-orange my-2 my-sm-0 ml-2">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {/* end of report modal */}
            </div >
        )
    }
}

const NavigationRouter = withRouter(Navigation);
export default NavigationRouter;