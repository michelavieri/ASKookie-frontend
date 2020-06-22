import React, { Component } from 'react';
import { NavLink, Link, withRouter } from 'react-router-dom';
import { animateScroll as scroll } from "react-scroll";
import logo from '../logo.png';
import axios from 'axios';
import jwt_decode from 'jwt-decode';


import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/AutoComplete';

class Navigation extends Component {
    logOut (e) {
        e.preventDefault();
        localStorage.removeItem('usertoken');
        this.props.history.push(``);
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
        };

        this.onPostChange = this.onPostChange.bind(this);
        this.onCategoryChange = this.onCategoryChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    onPostChange = e => {
        this.setState({
            post: e.target.value
        });
    };

    onCategoryChange = e => {
        const token = localStorage.usertoken;
        const decoded = jwt_decode(token);
        this.setState({
            category: e.target.value,
            asker: decoded.result.username
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        const data = {
            post: this.state.post,
            category: this.state.category,
            asker: this.state.asker
        };
        axios
            .post('/ask', data)
            .then(res => {
                console.log(res);
                console.log(this.props);
                this.props.history.push(``);
            })
            .catch(err => console.log(err));
    };

    componentDidMount() {
        fetch('/home')
            .then(res => res.json())
            .then(res => this.setState({ feeds: res.data }, () => console.log('Data fetched', res)))
    }

    handleInputChange = (event, value, reason) => {
        const query = event.target.value;
        console.log(event, value, reason);

        if (reason === 'select-option') {
            
        }

        // this.setState(prevState => {
        //     var filteredData = [];
        //     if (query !== "") {
        //         filteredData = prevState.feeds.filter(element => {
        //             return element.post.toLowerCase().includes(query.toLowerCase());
        //         });
        //     }
        //     return {
        //         query,
        //         filteredData
        //     };
        // });
    };

    // clearQuery = e => {
    //     this.setState(prevState => {
    //         return {
    //             filteredData: [],
    //         };
    //     });
    // }



    getData = () => {
        fetch('/home')
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


    scrollToTop = () => {
        scroll.scrollToTop();
    };

    render() {
        const { post, category } = this.state;
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
                                <Link class="nav-link px-lg-5" to="/"><i class="fa fa-fw fa-home fa-lg"></i> Home <span class="sr-only">(current)</span></Link>
                            </li>
                            <li class="nav-item">
                                <Link class="nav-link px-lg-5" to="/answer">
                                    <i class="fa fa-fw fa-pencil-square-o mx-lg-1 fa-lg"></i>Answer</Link>
                            </li>

                        </ul>


                        <div style={{ width: 300 }}>
                            <Autocomplete
                                freeSolo
                                disableClearable
                                autoSelect={true}
                                id="searchSelect"
                                onChange={this.handleInputChange}
                                // value = {value}
                                // value={this.state.query}
                                // options={this.state.filteredData && this.state.filteredData.map(
                                //     feeds =>
                                //         <li class="dropdown-item" >
                                //             <NavLink class="suggestion-link" to={`/thread/${feeds.postID}`} >{feeds.post}</NavLink>
                                //         </li>
                                // )}
                                options={this.state.feeds}
                                getOptionLabel={(data) => {
                                    if (typeof data === "string") {
                                        return data;
                                    }
                                    return data.post;
                                }}

                                renderInput={params => (

                                    <TextField
                                        {...params}
                                        label="Type In Content"
                                        id="searchBar"
                                        value=''
                                        autoSelect={true}
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                        InputProps={{ ...params.InputProps, type: 'search' }}
                                    />
                                )}
                            />
                        </div>


                        {/* FORM BERFUNGSI INI */}
                        {/* <form class="form-inline my-2 my-lg-0 ml-auto">
                            <div class="form-group has-search autocomplete">
                                <span class="fa fa-search form-control-feedback  d-none d-xl-block"></span>

                                <input
                                    id="searchBar"
                                    type="search"
                                    class="form-control"
                                    placeholder="Search"
                                    value={this.state.query}
                                    onChange={this.handleInputChange}
                                    autocomplete="off"
                                    onBlur={this.clearQuery}
                                /> */}
                        {/* <button class="btn" onclick={this.closeBox} data-toggle="collapse"></button> */}

                        {/* <div class="suggestion-box" id="suggestion" >
                                    {this.state.filteredData.slice(0, 5).map(feeds =>
                                        <li class="dropdown-item" >
                                            <NavLink class="suggestion-link" to={`/thread/${feeds.postID}`} >{feeds.post}</NavLink>
                                        </li>
                                    )}
                                </div>
                            </div>
                        </form> */}



                        {/* modal button */}
                        <button class="btn btn-orange my-2 my-sm-0" type="button" data-toggle="modal" data-target="#askModal">Add Question</button>


                        <ul class="navbar-nav">
                            {/* <li class="nav-item dropdown nav-icon">
                                <NavLink class="nav-link icon" to="#" id="notifDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa fa-fw fa-bell fa-lg mt-2"></i></NavLink>
                                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="notifDropdown">
                                    <NavLink class="dropdown-item" to="#">Someone answered your question!</NavLink>
                                    <div class="dropdown-divider"></div>
                                    <NavLink class="dropdown-item" to="#">Your followed thread posted something new!</NavLink>
                                    <div class="dropdown-divider"></div>
                                    <NavLink class="dropdown-item" to="#">Someone commented on your answer!</NavLink>
                                </div>
                            </li> */}

                            <li class="nav-item dropdown nav-icon">
                                <NavLink class="nav-link icon" to="#" id="notifDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <img src="https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/fox.jpg" width="40" class="rounded-circle" /></NavLink>
                                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="notifDropdown">
                                    {/* <NavLink class="dropdown-item" to="#">Followed Categories/Threads</NavLink>
                                    <NavLink class="dropdown-item" to="#">Your Asked/Answered Questions</NavLink>
                                    <NavLink class="dropdown-item" to="#">Saved Posts</NavLink>
                                    <NavLink class="dropdown-item" to="#">Liked Posts</NavLink>
                                    <div class="dropdown-divider"></div> */}
                                    <a class="dropdown-item" href="mailto:askookie@gmail.com">Help</a>
                                    <NavLink class="dropdown-item" to={``} onClick={this.logOut.bind(this)}>Logout</NavLink>
                                </div>
                            </li>
                        </ul>
                    </div>
                </nav>
                {/* modal ask  */}
                <div id="askModal" class="modal fade" role="dialog">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <form className="post" onSubmit={this.handleSubmit}>
                                <div class="modal-header pinkBg">
                                    <h4 class="modal-title text-white">Ask a Question!</h4>
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div class="modal-body">

                                    <div class="form-row align-items-left mb-3">
                                        <label for="inputQuestion" class="col-sm-2 col-form-label font-weight-bold">Your Question</label>
                                        <textarea
                                            rows="2"
                                            class="form-control col-sm-9"
                                            value={this.state.post}
                                            onChange={this.onPostChange}
                                            aria-describedby="questionHere"
                                            placeholder="Start your question with 'What', 'Why', 'How', etc. "
                                            required
                                        />
                                        <small id="passwordHelpBlock" class="form-text text-muted col-sm-11">
                                            Make sure your question has not been asked already and keep your question short.
                                    </small>
                                    </div>
                                    <div class="form-row align-items-left mb-3">
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
                                        <small id="passwordHelpBlock" class="form-text text-muted col-sm-11">
                                            Your question will be posted anonymously but any inapporpriate content will be filtered.
                                    </small>
                                    </div>

                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-default far-right" data-dismiss="modal">Cancel</button>
                                    <button type="submit" class="btn btn-orange my-2 my-sm-0 ml-2" data-dismiss="modal">Add Question</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

const NavigationRouter = withRouter(Navigation);
export default NavigationRouter;