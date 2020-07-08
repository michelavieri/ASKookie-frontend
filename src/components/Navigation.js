import React, { Component } from 'react';
import { NavLink, Link, withRouter } from 'react-router-dom';
import { animateScroll as scroll } from "react-scroll";
import logo from '../logo.png';
import profilePicture from '../default_pp.png';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { trackPromise } from 'react-promise-tracker';


import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

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
            feeds: [],
            query: "",
            filteredData: [],
            post: "",
            category: "",
            asker: "",
            answerer: "",
            type: "",
            answer: "",
        };

        this.onPostChange = this.onPostChange.bind(this);
        this.onCategoryChange = this.onCategoryChange.bind(this);
        this.onTitleChange = this.onTitleChange.bind(this);
        this.handleSubmitAsk = this.handleSubmitAsk.bind(this);
        this.handleSubmitPost = this.handleSubmitPost.bind(this);
    }

    onPostChange = e => {
        const token = localStorage.usertoken;
        const decoded = jwt_decode(token);
        this.setState({
            answer: e.target.value,
            asker: decoded.result.username,
        });
    };

    onQuestionChange = e => {
        const token = localStorage.usertoken;
        const decoded = jwt_decode(token);
        this.setState({
            post: e.target.value,
            asker: decoded.result.username,
        });
    };

    onTitleChange = e => {
        const token = localStorage.usertoken;
        const decoded = jwt_decode(token);
        this.setState({
            post: e.target.value,
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
            post: this.state.post,
            category: this.state.category,
            asker: this.state.asker,
            type: "question",
            answerer: this.state.answerer,
            answer: this.state.answer


        };
        console.log(data);

        axios
            .post('https://localhost:5000/ask', data)
            .then(res => {
                console.log(res);
                console.log(this.props);
                this.props.history.push(`/thread/${res.data.data.insertId}`);
                window.location.reload(false);
            })
            .catch(err => console.log(err));
    };

    handleSubmitPost = e => {
        e.preventDefault();
        const data = {
            post: this.state.post,
            category: this.state.category,
            asker: this.state.asker,
            type: "post",
            answerer: this.state.answerer,
            answer: this.state.answer


        };
        console.log(data);
        axios
            .post('https://localhost:5000/ask', data)
            .then(res => {
                console.log(res);
                console.log(this.props);
                this.props.history.push(`/thread/${res.data.data.insertId}`);
                window.location.reload(false);
            })
            .catch(err => console.log(err));
    };

    componentDidMount() {
        trackPromise(
            fetch('https://localhost:5000/home')
                .then(res => res.json())
                .then(res => this.setState({ feeds: res.data }, () => console.log('Data fetched', res)))
        )
    }

    handleInputChange = (event, value, reason) => {
        if (reason === 'select-option') {
            this.props.history.push(`/thread/${value.postID}`);
            window.location.reload(false);
        }
    };

    getData = () => {
        fetch('https://localhost:5000/home')
            .then(response => response.json())
            .then(feeds => {
                const { query } = this.state;
                const filteredData = feeds.filter(element => {
                    return element.post.toLowerCase().includes(query.toLowerCase());
                });

                this.setState({
                    feeds,
                    filteredData
                });
            });
    };

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

    render() {
        return (
            <div class="container-fluid">
                <nav class="navbar fixed-top navbar-expand-lg navbar-light bg-yellow">
                    <NavLink class="navbar-brand smooth-scroll" onClick={() => this.scrollToTop()} to="/">
                        <img src={logo} class="img-fluid" alt="" />
                    </NavLink>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                        <i class="fa fa-bars"></i>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarText">
                        <ul class="navbar-nav mr-auto">
                            <li class="nav-item">
                                <Link class="nav-link px-lg-5" to="/"><i class="fa fa-fw fa-home fa-lg d-none d-xl-inline"></i> Home <span class="sr-only">(current)</span></Link>
                            </li>
                            <li class="nav-item">
                                <Link class="nav-link px-lg-5" to="/answer">
                                    <i class="fa fa-fw fa-pencil-square-o mx-lg-1 fa-lg d-none d-xl-inline"></i>Answer</Link>
                            </li>

                        </ul>


                        <div style={{ width: 300 }}>
                            <Autocomplete
                                // freeSolo
                                disableClearable
                                id="searchSelect"
                                onChange={this.handleInputChange}
                                options={this.state.feeds}
                                getOptionLabel={(data) => {
                                    if (typeof data === "string") {
                                        return data;
                                    }
                                    return data.post;
                                }}
                                noOptionsText={'No Posts Match the Keyword'}

                                renderInput={params => (
                                    <div class="pt-0 pb-2">
                                        <TextField
                                            {...params}
                                            label="Search"
                                            id="searchBar"
                                            size="small"
                                            // value=''
                                            // autoSelect={true}
                                            margin="normal"
                                            variant="outlined"
                                            fullWidth
                                            InputProps={{ ...params.InputProps, type: 'search' }}
                                        />
                                    </div>
                                )}
                            />

                        </div>

                        {/* modal button */}
                        <button class="btn btn-orange my-2 my-sm-0 ml-3" type="button" data-toggle="modal" data-target="#askModal">Ask / Post</button>


                        <ul class="navbar-nav">
                            <li class="nav-item dropdown nav-icon">
                                <NavLink class="nav-link icon" to="#" id="notifDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa fa-fw fa-bell fa-lg mt-2"></i></NavLink>
                                <div class="dropdown-menu notif dropdown-menu-right" aria-labelledby="notifDropdown">
                                    <NavLink class="dropdown-item" to="#">Someone answered your question in @1311!</NavLink>
                                    <div class="dropdown-divider"></div>
                                    <NavLink class="dropdown-item" to="#">Your followed thread @2200 posted something new!</NavLink>
                                    <div class="dropdown-divider"></div>
                                    <NavLink class="dropdown-item" to="#">Someone commented on your answer in @1412!</NavLink>
                                </div>
                            </li>
                            {localStorage.usertoken &&
                                <li class="nav-item dropdown nav-icon">
                                    <NavLink class="nav-link icon" to="#" id="notifDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <img src={profilePicture} alt="" width="38" class="rounded-circle" /></NavLink>
                                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="notifDropdown">
                                        <NavLink class="dropdown-item" to="/profile" >
                                            Signed in as <br /> {this.getUsername()}
                                        </NavLink>
                                        <div class="dropdown-divider"></div>
                                        <a class="dropdown-item content-dropdown" href="mailto:askookieforum@gmail.com">Help</a>
                                        <NavLink class="dropdown-item mb-2 content-dropdown" to={``} onClick={this.logOut.bind(this)}>Logout</NavLink>
                                    </div>
                                </li>
                            }
                            {!localStorage.usertoken &&
                                <li class="mr-3 btn-group">
                                    <button class="btn btn-navbar ml-2 mr-2"><NavLink class="link-navbar" to="/signinform">Sign in</NavLink></button>
                                    <button class="btn btn-outline-dark d-xl-inline d-none d-sm-inline"><NavLink class="link-register" to="/register">Register</NavLink></button>
                                </li>
                            }
                        </ul>
                    </div>
                </nav>
                {/* modal ask  */}
                {localStorage.usertoken &&
                    <div id="askModal" class="modal fade" role="dialog">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header pinkBg pb-0">
                                    <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                                        <a class="nav-link tab-link active" id="nav-ask-tab" data-toggle="tab" href="#nav-ask" role="tab" aria-controls="nav-ask" aria-selected="true">Ask a Question</a>
                                        <a class="nav-link tab-link" id="nav-post-tab" data-toggle="tab" href="#nav-post" role="tab" aria-controls="nav-post" aria-selected="false">Make a New Post</a>

                                    </div>
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                </div>

                                <div class="tab-content py-3 px-3 px-sm-0" id="nav-tabContent">
                                    <div class="tab-pane fade show active ml-5 text-left mr-5" id="nav-ask" role="tabpanel" aria-labelledby="nav-ask-tab">
                                        <form className="ask" onSubmit={this.handleSubmitAsk}>
                                            <div class="form-row mb-3">
                                                <div class="form-row mb-3">
                                                    <label for="inputQuestion" class="col-sm-2 col-form-label font-weight-bold">Your Question</label>
                                                    <textarea
                                                        rows="2"
                                                        class="form-control col-sm-9"
                                                        value={this.state.post}
                                                        onChange={this.onQuestionChange}
                                                        aria-describedby="questionHere"
                                                        placeholder="Start your question with 'What', 'Why', 'How', etc. "
                                                        required
                                                    />
                                                    <small id="questionTips" class="form-text text-muted col-sm-11">
                                                        Make sure your question has not been asked already and keep your question short.
                                                        </small>
                                                </div>

                                                <label for="inputQuestion" class="col-sm-2 col-form-label font-weight-bold">Category</label>
                                                <select
                                                    onChange={this.onCategoryChange}
                                                    value={this.state.category}
                                                    class="form-control col-sm-9"
                                                    required>
                                                    <option value="" selected>Choose one...</option>
                                                    <option value="faculties">Faculties</option>
                                                    <option value="accommodation">Accomodation</option>
                                                    <option value="student_life">Student Life</option>
                                                    <option value="job_intern">Job/Internship</option>
                                                    <option value="exchange_noc">Exchange Program/NOC</option>
                                                    <option value="others">Others</option>
                                                </select>
                                                <small id="questionWarning" class="form-text text-muted col-sm-11">
                                                    Your question will be posted anonymously but any inapporpriate content will be filtered.
                                                    </small>
                                            </div>
                                            <div class="modal-footer mb-0 pb-0">
                                                <button type="button" class="btn btn-default far-right" data-dismiss="modal">Cancel</button>
                                                <button type="submit" class="btn btn-orange my-2 my-sm-0 ml-2">Add Question</button>
                                            </div>
                                        </form>
                                    </div>
                                    <div class="tab-pane fade ml-5 mr-5" id="nav-post" role="tabpanel" aria-labelledby="nav-post-tab">
                                        <form className="post" onSubmit={this.handleSubmitPost}>
                                            <div class="form-row align-items-left mb-3 text-left">
                                                <div class="form-row align-items-left mb-3">
                                                    <label for="inputQuestion" class="col-sm-2 col-form-label font-weight-bold">Post Title</label>
                                                    <input
                                                        class="form-control col-sm-9 font-weight-bold"
                                                        value={this.state.post}
                                                        onChange={this.onTitleChange}
                                                        aria-describedby="titleHere"
                                                        placeholder="Give a Meaningful Title to Your Post..."
                                                        required
                                                    />
                                                    <label for="inputQuestion" class="col-sm-2 col-form-label font-weight-bold">Your Post</label>
                                                    <textarea
                                                        rows="5"
                                                        class="form-control col-sm-9 mt-3"
                                                        value={this.state.answer}
                                                        onChange={this.onPostChange}
                                                        aria-describedby="postHere"
                                                        placeholder="Write your post here..."
                                                        required
                                                    />
                                                    <small id="passwordHelpBlock" class="form-text text-muted col-sm-11">
                                                        Try to keep your post clear and short to engage readers to read your message.
                                                        </small>
                                                </div>

                                                <label for="inputQuestion" class="col-sm-2 col-form-label font-weight-bold">Category</label>
                                                <select
                                                    onChange={this.onCategoryChange}
                                                    value={this.state.category}
                                                    class="form-control col-sm-9"
                                                    required>
                                                    <option value="" selected>Choose one...</option>
                                                    <option value="faculties">Faculties</option>
                                                    <option value="accommodation">Accomodation</option>
                                                    <option value="student_life">Student Life</option>
                                                    <option value="job_intern">Job/Internship</option>
                                                    <option value="exchange_noc">Exchange Program/NOC</option>
                                                    <option value="others">Others</option>
                                                </select>
                                                <small id="postWarning" class="form-text text-muted col-sm-11">
                                                    Your post will not be anonymous and any inapporpriate content will be filtered by us.
                                                    </small>
                                            </div>
                                            <div class="modal-footer mb-0 pb-0">
                                                <button type="button" class="btn btn-default far-right" data-dismiss="modal">Cancel</button>
                                                <button type="submit" class="btn btn-orange my-2 my-sm-0 ml-2">Add Post</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {!localStorage.usertoken &&
                    <div id="askModal" class="modal fade" role="dialog">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header pinkBg">
                                    <h4 class="modal-title text-white">Please Sign In to Ask a Question</h4>
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div class="modal-body text-left">
                                    <p class="font-weight-bold ml-3 mr-3">Only Registered Users are allowed to post or answer a question.</p>
                                    <div className="alert alert-danger mt-5 ml-2 mr-2" role="alert">
                                        <span class="fa fa-exclamation-triangle mr-2" />
                                        Please sign in to ask a question
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {/* modal for report */}
                <div id="reportModal" class="modal fade" role="dialog">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">Report <i class="fa fa-exclamation-circle pl-2" /></h4>
                                <button type="button" class="close pr-4" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body text-left pt-2">
                                <form>
                                    <div class="custom-control custom-radio">
                                        <input type="radio" id="customRadio1" name="customRadio" class="custom-control-input" required />
                                        <label class="custom-control-label" for="customRadio1">Spam</label>
                                    </div>
                                    <div class="custom-control custom-radio pt-2">
                                        <input type="radio" id="customRadio2" name="customRadio" class="custom-control-input" />
                                        <label class="custom-control-label" for="customRadio2">Harrassment</label>
                                    </div>
                                    <div class="custom-control custom-radio pt-2">
                                        <input type="radio" id="customRadio3" name="customRadio" class="custom-control-input" />
                                        <label class="custom-control-label" for="customRadio3">Joke/Troll</label>
                                    </div>
                                    <div class="custom-control custom-radio pt-2">
                                        <input type="radio" id="customRadio4" name="customRadio" class="custom-control-input" />
                                        <label class="custom-control-label" for="customRadio4">Poorly Written</label>
                                    </div>
                                    <div class="custom-control custom-radio pt-2">
                                        <input type="radio" id="customRadio5" name="customRadio" class="custom-control-input" />
                                        <label class="custom-control-label" for="customRadio5">Plagiarism</label>
                                    </div>
                                    <div class="custom-control custom-radio pt-2">
                                        <input type="radio" id="customRadio6" name="customRadio" class="custom-control-input" />
                                        <label class="custom-control-label" for="customRadio6">Doesn't Answer the Question</label>
                                    </div>
                                    <div class="custom-control custom-radio pt-2">
                                        <input type="radio" id="customRadio7" name="customRadio" class="custom-control-input" />
                                        <label class="custom-control-label" for="customRadio7">Disturbing Content</label>
                                    </div>
                                    <div class="custom-control custom-radio pt-2">
                                        <input type="radio" id="customRadio8" name="customRadio" class="custom-control-input" />
                                        <label class="custom-control-label" for="customRadio8">Spreading False Information/Inaccurate</label>
                                    </div>
                                    <div class="custom-control custom-radio pt-2">
                                        <input type="radio" id="customRadio9" name="customRadio" class="custom-control-input" />
                                        <label class="custom-control-label" for="customRadio9">Spreading Hate</label>
                                    </div>
                                    <div class="custom-control custom-radio pb-2 pt-2">
                                        <input type="radio" id="customRadio10" name="customRadio" class="custom-control-input" />
                                        <label class="custom-control-label" for="customRadio10">Adult Content</label>
                                    </div>

                                    <div class="modal-footer mb-0 pb-0">
                                        <button type="button" class="btn btn-default far-right" data-dismiss="modal">Cancel</button>
                                        <button type="button" class="btn btn-orange my-2 my-sm-0 ml-2">Submit</button>
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