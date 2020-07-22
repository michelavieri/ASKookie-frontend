import React, { Component } from 'react';
import { NavLink, Link, withRouter } from 'react-router-dom';
import { animateScroll as scroll } from "react-scroll";
import logo from '../logo.png';
import profilePicture from '../default_pp.png';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

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
            value: undefined
        };

        this.onPostChange = this.onPostChange.bind(this);
        this.onQuestionChange = this.onQuestionChange.bind(this);
        this.onCategoryChange = this.onCategoryChange.bind(this);
        this.onTitleChange = this.onTitleChange.bind(this);
        this.handleSubmitAsk = this.handleSubmitAsk.bind(this);
        this.handleSubmitPost = this.handleSubmitPost.bind(this);
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

        console.log("post", this.state.post_content);
        const data = {
            question: this.state.question,
            category: this.state.category,
            asker: this.state.asker,
            type_post: 1,
            anonymous: true,
            post_content: this.state.post_content,
            title: this.state.title,
            time: new Date().toLocaleDateString(),
        };
        console.log(data);

        axios
            .post('http://localhost:5000/ask', data)
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
            .post('http://localhost:5000/ask', data)
            .then(res => {
                console.log(res);
                console.log(this.props);
                this.props.history.push(`/thread/${res.data.data.insertId}`);
                window.location.reload(false);
            })
            .catch(err => console.log(err));
    };

    onChangeReport = e => {
        this.setState({
            report: e.target.value,
        })
        console.log(this.state.report)
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
        console.log(data);
        axios
            .post('http://localhost:5000/report', data)
            .then(res => {
                console.log(res);
                console.log(this.props);
                window.location.reload(false);
            })
            .catch(err => {
                console.log(err);
            });
    };


    // componentDidMount() {
    //     trackPromise(
    //         fetch('http://localhost:5000/home')
    //             .then(res => res.json())
    //             .then(res => this.setState({ feeds: res.data }, () => console.log('Data fetched', res)))
    //     )
    // }

    // handleInputChange = (event, value, reason) => {
    //     console.log("value", value, event, reason);
    //     if (reason === 'select-option') {
    //         this.props.history.push(`/thread/${value.postID}`);
    //         window.location.reload(false);
    //     }
    // };

    handleInputChange = e => {
        this.setState({
            query: e.target.value
        });
        console.log("query", this.state.query)
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

    render() {
        const { isOpen, value } = this.state;
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
                                <NavLink class="nav-link px-lg-5" to="/" exact activeStyle={{
                                    color: 'white',
                                    borderBottom: '3px solid #4D60A5',
                                }}><i class="fa fa-fw fa-home fa-lg d-none d-xl-inline"></i> Home <span class="sr-only">(current)</span></NavLink>
                            </li>
                            <li class="nav-item">
                                <NavLink class="nav-link px-lg-5" to="/answer"
                                    activeStyle={{
                                        color: 'white',
                                        borderBottom: '3px solid #4D60A5',
                                    }}>
                                    <i class="fa fa-fw fa-pencil-square-o mx-lg-1 fa-lg d-none d-xl-inline"></i>Answer</NavLink>
                            </li>

                        </ul>

                        <div style={{ width: 300 }} class="form-inline">
                            <input type="text" id="searchSelect"
                                onChange={this.handleInputChange}
                                placeholder="Search..."
                                autoComplete="off"
                                class="form-control"
                                style={{ width: 250 }}
                                required
                            />
                            {this.state.query != "" &&
                                <Link to={`/search/${this.state.query}`}><button class="btn"><i class="fa fa-search mb-2 blue"></i></button></Link>
                            }
                        </div>




                        {/* <div style={{ width: 300 }}>
                            <Autocomplete
                                // freeSolo
                                disableClearable
                                id="searchSelect"
                                onChange={this.handleInputChange}
                                options={this.state.filteredData}
                                getOptionLabel={(data) => {
                                    if (typeof data === "string") {
                                        return data;
                                    }
                                    return data.question || data.title;
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
                            {console.log("filteredd", this.state.filteredData)}
                        </div> */}

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
                                        <NavLink class="dropdown-item content-dropdown" to="/profile" >
                                            My Saved Threads
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
                {
                    localStorage.usertoken &&
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
                                                        value={this.state.question}
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
                                                    <option value="1">Faculties</option>
                                                    <option value="2">Accomodation</option>
                                                    <option value="3">Student Life</option>
                                                    <option value="4">Job/Internship</option>
                                                    <option value="5">Exchange Program/NOC</option>
                                                    <option value="6">Others</option>
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
                                                        value={this.state.title}
                                                        onChange={this.onTitleChange}
                                                        aria-describedby="titleHere"
                                                        placeholder="Give a Meaningful Title to Your Post..."
                                                        required
                                                    />
                                                    <label for="inputQuestion" class="col-sm-2 col-form-label font-weight-bold">Your Post</label>
                                                    <textarea
                                                        rows="5"
                                                        class="form-control col-sm-9 mt-3"
                                                        value={this.state.post_contents}
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
                                                    <option value="1">Faculties</option>
                                                    <option value="2">Accommodation</option>
                                                    <option value="3">Student Life</option>
                                                    <option value="4">Job/Internship</option>
                                                    <option value="5">Exchange Program/NOC</option>
                                                    <option value="6">Others</option>
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
                {
                    !localStorage.usertoken &&
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
                                <form onSubmit={this.handleSubmitReport}>
                                    <div class="custom-control custom-radio">
                                        <input type="radio" id="customRadio1" name="customRadio" class="custom-control-input" value="Spam" onClick={this.onChangeReport} required />
                                        <label class="custom-control-label" for="customRadio1" >Spam</label>
                                    </div>
                                    <div class="custom-control custom-radio pt-2">
                                        <input type="radio" id="customRadio2" name="customRadio" class="custom-control-input" value="Harrassment" onClick={this.onChangeReport} />
                                        <label class="custom-control-label" for="customRadio2" >Harrassment</label>
                                    </div>
                                    <div class="custom-control custom-radio pt-2">
                                        <input type="radio" id="customRadio3" name="customRadio" class="custom-control-input" value="Joke_Troll" onClick={this.onChangeReport} />
                                        <label class="custom-control-label" for="customRadio3" >Joke/Troll</label>
                                    </div>
                                    <div class="custom-control custom-radio pt-2">
                                        <input type="radio" id="customRadio4" name="customRadio" class="custom-control-input" value="Poorly_Written" onClick={this.onChangeReport} />
                                        <label class="custom-control-label" for="customRadio4">Poorly Written</label>
                                    </div>
                                    <div class="custom-control custom-radio pt-2">
                                        <input type="radio" id="customRadio5" name="customRadio" class="custom-control-input" value="Plagiarism" onClick={this.onChangeReport} />
                                        <label class="custom-control-label" for="customRadio5">Plagiarism</label>
                                    </div>
                                    <div class="custom-control custom-radio pt-2">
                                        <input type="radio" id="customRadio6" name="customRadio" class="custom-control-input" value="Doesnt_Answer" onClick={this.onChangeReport} />
                                        <label class="custom-control-label" for="customRadio6">Doesn't Answer the Question</label>
                                    </div>
                                    <div class="custom-control custom-radio pt-2">
                                        <input type="radio" id="customRadio7" name="customRadio" class="custom-control-input" value="Disturbing_Content" onClick={this.onChangeReport} />
                                        <label class="custom-control-label" for="customRadio7">Disturbing Content</label>
                                    </div>
                                    <div class="custom-control custom-radio pt-2">
                                        <input type="radio" id="customRadio8" name="customRadio" class="custom-control-input" value="False_Info" onClick={this.onChangeReport} />
                                        <label class="custom-control-label" for="customRadio8">Spreading False Information/Inaccurate</label>
                                    </div>
                                    <div class="custom-control custom-radio pt-2">
                                        <input type="radio" id="customRadio9" name="customRadio" class="custom-control-input" value="Spread_Hate" onClick={this.onChangeReport} />
                                        <label class="custom-control-label" for="customRadio9">Spreading Hate</label>
                                    </div>
                                    <div class="custom-control custom-radio pb-2 pt-2">
                                        <input type="radio" id="customRadio10" name="customRadio" class="custom-control-input" value="Adult_Content" onClick={this.onChangeReport} />
                                        <label class="custom-control-label" for="customRadio10">Adult Content</label>
                                    </div>

                                    <div class="modal-footer mb-0 pb-0">
                                        <button type="button" class="btn btn-default far-right" data-dismiss="modal">Cancel</button>
                                        <button type="submit" class="btn btn-orange my-2 my-sm-0 ml-2">Submit</button>
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