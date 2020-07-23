import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import NavigationRouter2 from './Navigation'
import { animateScroll as scroll } from "react-scroll";
import jwt_decode from 'jwt-decode';
import Linkify from 'react-linkify';
import axios from 'axios';
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


export class Exchange_Noc extends Component {
    constructor() {
        super();
        this.state = {
            feeds: [],
            name: '',
            unanswered: [],
            answerID: "",
            commentsAns: "",
            commentsPost: "",
            user: "",
            postID: "",
            commentID: "",
            commentEdit: "",
        };
    }
    componentDidMount() {
        if (localStorage.usertoken) {
            const token = localStorage.usertoken;
            const decoded = jwt_decode(token);
            this.setState({ user: decoded.result.username });

        }
        trackPromise(
            fetch('http://localhost:5000/feeds/exchange_noc')
                .then(res => res.json())
                .then(res => {
                    this.setState({ feeds: res.data });
                    if (localStorage.usertoken) {
                        const token = localStorage.usertoken;
                        const decoded = jwt_decode(token);
                        this.setState({ name: decoded.result.username });
                    }
                    this.checkHasLike();
                    this.checkHasSave();
                    this.checkHasFollow();
                    console.log('Data fetched', this.state.feeds);
                }));
        trackPromise(
            fetch('http://localhost:5000/unanswered')
                .then(res => res.json())
                .then(res => {
                    this.setState({ unanswered: res.data }, () => console.log('Unanswered fetched', res.data));
                }));
    };

    async checkHasLike() {
        for (var i = 0; i < this.state.feeds.length; i++) {
            if (this.state.feeds[i].answerID == null) {
                var hasLikedTemp = await this.getHasLikedPost(this.state.feeds[i].postID)
            } else {
                var hasLikedTemp = await this.getHasLikedAns(this.state.feeds[i].answerID)
            }
            this.state.feeds[i].hasLiked = hasLikedTemp
        }
        this.setState({ feeds: this.state.feeds })
    }

    getHasLikedPost(id) {
        return axios.get('http://localhost:5000/hasLiked/post/' + `${id}` + "/" + `${this.state.name}`
        ).then(res => {
            return res.data.data[0].hasLiked;
        }
        ).catch(err => console.log(err))
    }

    getHasLikedAns(id) {
        return axios.get('http://localhost:5000/hasLiked/answer/' + `${id}` + "/" + `${this.state.name}`
        ).then(res => {
            return res.data.data[0].hasLikedAns;
        }
        ).catch(err => console.log(err))
    }

    async checkHasSave() {
        for (var i = 0; i < this.state.feeds.length; i++) {
            var hasSaveTemp = await this.getHasSave(this.state.feeds[i].postID)

            this.state.feeds[i].hasSave = hasSaveTemp
        }
        this.setState({ feeds: this.state.feeds })
    }

    getHasSave(id) {
        return axios.get('http://localhost:5000/hasSave/post/' + `${id}` + "/" + `${this.state.name}`
        ).then(res => {
            return res.data.data[0].hasSave;
        }
        ).catch(err => console.log(err))
    }

    async checkHasFollow() {
        for (var i = 0; i < this.state.feeds.length; i++) {
            var hasFollowTemp = await this.getHasFollow(this.state.feeds[i].postID)

            this.state.feeds[i].hasFollow = hasFollowTemp
        }
        this.setState({ feeds: this.state.feeds })
    }

    getHasFollow(id) {
        return axios.get('http://localhost:5000/hasFollow/post/' + `${id}` + "/" + `${this.state.name}`
        ).then(res => {
            return res.data.data[0].hasFollow;
        }
        ).catch(err => console.log(err))
    }

    componentDecorator = (href, text, key) => (
        <a href={href} key={key} target="_blank" rel="noopener noreferrer">
            {text}
        </a>
    );

    scrollToTop = () => {
        scroll.scrollToTop();
    };

    getAnswers(postID) {
        axios.get('http://localhost:5000/answers/' + postID)
            .then(res => {
                if (res == null) {
                    return null;
                }
            })
            // this.setState({ answers: res.data.data });
            // console.log("dataaaaa", res.data.data)
            .catch(err => console.log(err));
    }

    shuffleArray = () => {
        if (this.state.feeds) {
            let i = this.state.feeds.length - 1;
            var array = this.state.feeds.slice();
            for (; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                const temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        } else {
            return this.state.feeds;
        }
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

    setCommentID(id) {
        this.setState({
            commentID: id,
        })
    }

    setComment(com) {
        this.setState({
            commentEdit: com,
        })
    }

    setCommentAndID(id, ans) {
        this.setCommentID(id);
        this.setComment(ans);
    }

    onCommentChange = e => {
        const token = localStorage.usertoken;
        const decoded = jwt_decode(token);
        this.setState({
            comment: e.target.value,
            username: decoded.result.username
        })
    }

    handleLike = (liked, id) => {
        var index;
        for (var i = 0; i < this.state.feeds.length; i++) {
            if (this.state.feeds[i].postID === id) {
                index = i;
                break;
            }
        }

        var likeCount = this.state.feeds[index].like_count;
        if (!liked) {
            likeCount = likeCount + 1;
            this.state.feeds[index].like_count = likeCount;
            this.state.feeds[index].hasLiked = 1;

            this.setState({
                feeds: this.state.feeds,
            })
            const data = {
                postID: id,
                username: this.state.name,
            };
            axios
                .post('http://localhost:5000/like/post', data)
                .then(
                    res => {
                        console.log(res);
                    })
                .catch(err => console.log(err));
        } else {
            likeCount = likeCount - 1;
            this.state.feeds[index].like_count = likeCount;
            this.state.feeds[index].hasLiked = null;

            this.setState({
                feeds: this.state.feeds,
            })
            const data = {
                postID: id,
                username: this.state.name,
            };
            axios
                .post('http://localhost:5000/unlike/post', data)
                .then(
                    res => {
                        console.log(res);
                    })
                .catch(err => console.log(err));

        }
    }

    handleLikeAns = (liked, id, postid) => {
        var index;
        for (var i = 0; i < this.state.feeds.length; i++) {
            if (this.state.feeds[i].answerID === id) {
                index = i;
                break;
            }
        }

        var likeCount = this.state.feeds[index].like_count2;
        if (!liked) {
            likeCount = likeCount + 1;
            this.state.feeds[index].like_count2 = likeCount;
            this.state.feeds[index].hasLiked = 1;

            this.setState({
                feeds: this.state.feeds,
            })
            const data = {
                postID: postid,
                username: this.state.name,
                answerID: id,
            };
            axios
                .post('http://localhost:5000/like/answer', data)
                .then(
                    res => {
                        console.log(res);
                    })
                .catch(err => console.log(err));
        } else {
            likeCount = likeCount - 1;
            this.state.feeds[index].like_count2 = likeCount;
            this.state.feeds[index].hasLiked = null;

            this.setState({
                feeds: this.state.feeds,
            })
            const data = {
                postID: postid,
                username: this.state.name,
                answerID: id,
            };
            axios
                .post('http://localhost:5000/unlike/answer', data)
                .then(
                    res => {
                        console.log(res);
                    })
                .catch(err => console.log(err));

        }
    }

    onCommentEditChange = e => {
        this.setState({
            commentEdit: e.target.value,
        });
    };

    saveThread(id) {
        const data = {
            username: this.state.name,
            postID: id,
        };
        var index;
        for (var i = 0; i < this.state.feeds.length; i++) {
            if (this.state.feeds[i].postID === id) {
                index = i;
                break;
            }
        }
        if (!this.state.feeds[index].hasSave) {
            console.log("saved!");
            this.state.feeds[index].hasSave = 1;

            this.setState({
                feeds: this.state.feeds,
            })
            axios.post('http://localhost:5000/save', data)
                .then(
                    res => {
                        console.log(res);
                    })
                .catch(err => console.log(err));
        } else {
            console.log("unsaved!")
            this.state.feeds[index].hasSave = null;

            this.setState({
                feeds: this.state.feeds,
            })
            axios
                .post('http://localhost:5000/unsave', data)
                .then(
                    res => {
                        console.log(res);
                    })
                .catch(err => console.log(err));
        }
    };

    followThread(id) {
        const data = {
            username: this.state.name,
            postID: id,
        };
        var index;
        for (var i = 0; i < this.state.feeds.length; i++) {
            if (this.state.feeds[i].postID === id) {
                index = i;
                break;
            }
        }
        if (!this.state.feeds[index].hasFollow) {
            console.log("followed!");
            this.state.feeds[index].hasFollow = 1;

            this.setState({
                feeds: this.state.feeds,
            })
            axios.post('http://localhost:5000/follow', data)
                .then(
                    res => {
                        console.log(res);
                    })
                .catch(err => console.log(err));
        } else {
            console.log("unfollowed!")
            this.state.feeds[index].hasFollow = null;

            this.setState({
                feeds: this.state.feeds,
            })
            axios
                .post('http://localhost:5000/unfollow', data)
                .then(
                    res => {
                        console.log(res);
                    })
                .catch(err => console.log(err));
        }
    };

    handleEditComment = e => {
        e.preventDefault();
        const data = {
            content: this.state.commentEdit,
            commentID: this.state.commentID,
        };

        axios
            .post('http://localhost:5000/edit/comment', data)
            .then(
                res => {
                    console.log(res);
                    window.location.reload(false);
                })
            .catch(err => console.log(err));
    }

    handleDeleteComment = e => { //deleting answer
        const id_del = this.state.commentID;

        e.preventDefault();

        console.log("iddel", id_del);

        axios
            .delete('http://localhost:5000/delete/comment/' + id_del) //delete answer with id id_del
            .then(res => {
                console.log(res);
                window.location.reload(false);
                console.log("Comment deleted");
            })
            .catch(err => console.log(err));
    };

    handleSubmitCommentPost = e => {
        e.preventDefault();

        const data = {
            comment: this.state.comment,
            username: this.state.username,
            time: new Date().toLocaleDateString(),
            postID: this.state.postID,
            anonymous: false,
            answerID: null,
        };
        axios
            .post('http://localhost:5000/comment/post', data)
            .then(
                res => {
                    console.log(res);
                    this.props.history.push(`/thread/` + this.state.postID);
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
            postID: this.state.postID,
        };

        axios
            .post('http://localhost:5000/comment/answer', data)
            .then(
                res => {
                    console.log(res);
                    this.props.history.push(`/thread/` + this.state.postID);
                    window.location.reload(false);
                })
            .catch(err => console.log(err));
    };

    getCommentsAns(id, postid) {
        console.log("answerid", id);
        this.setState({
            answerID: id,
        })
        trackPromise(
            fetch('http://localhost:5000/comments/answer/' + id)
                .then(res => res.json())
                .then(res => {
                    this.setState({
                        commentsAns: res.data,
                        postID: postid,
                    });
                    console.log('Comments Answer fetched', res.data);
                }))
    }

    getCommentsPost = (id) => {
        trackPromise(
            fetch('http://localhost:5000/comments/post/' + id)
                .then(res => res.json())
                .then(res => {
                    this.setState({
                        commentsPost: res.data,
                        postID: id,
                    });
                    console.log('Comments Post fetched', res.data);
                }))
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
                                        <NavLink class="listku font-weight-bold" to="/exchange_noc"><li>Exchange/NOC</li></NavLink>
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
                            <div class="card-header orange-color">
                                <b>Category: Exchange/NOC</b>
                            </div>
                        </div>
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
                        {mostRecentPosts && mostRecentPosts.map(feeds => (
                            <div class="card mb-3">
                                <div class="card-body pb-1">
                                    <ul class="list-group">
                                        <li>
                                            {feeds.type_post == "1" && feeds.anonymous2 == "1" &&
                                                <div class="sub-text">
                                                    <NavLink target="_blank" class="sub-link" to={`/thread/${feeds.postID}`}><h8> @{feeds.postID} </h8></NavLink>
                                                &middot; Posted by {feeds.answerer} on {`${feeds.time2}`}
                                                </div>
                                            }
                                            {feeds.type_post == "1" && feeds.anonymous2 == "0" &&
                                                <div class="sub-text">
                                                    <NavLink target="_blank" class="sub-link" to={`/thread/${feeds.postID}`}><h8> @{feeds.postID} </h8></NavLink>
                                                &middot; Posted by an anonymous user on {`${feeds.time2}`}
                                                </div>
                                            }
                                            {feeds.type_post == "2" &&
                                                <div class="sub-text">
                                                    <NavLink target="_blank" class="sub-link" to={`/thread/${feeds.postID}`}><h8> @{feeds.postID} </h8></NavLink>
                                                &middot; Posted by {feeds.asker} on {`${feeds.time}`}
                                                </div>
                                            }
                                        </li>
                                        <li>
                                            <NavLink target="_blank" class="btn-category unanswered font-weight-bold lead" to={`thread/${feeds.postID}`}>{feeds.question}{feeds.title}</NavLink>
                                        </li>
                                        <li>
                                            <Linkify componentDecorator={this.componentDecorator}>
                                                <div class="show-more" data-type="text" data-number="80">
                                                    <p class="whiteSpace">{feeds.post_content}{feeds.answer}</p>
                                                </div>
                                            </Linkify>
                                        </li>
                                        {localStorage.usertoken &&
                                            <li class="feeds-footer">
                                                {feeds.hasLiked == "1" && feeds.type_post == "1" &&
                                                    <button class="btn btn-icon like pr-1 pl-0 red" title="Unlike" onClick={() => this.handleLikeAns(feeds.hasLiked, feeds.answerID, feeds.postID)} ><i class="fa fa-thumbs-o-up pr-1" /> {feeds.like_count2}</button>
                                                }
                                                {!feeds.hasLiked && feeds.type_post == "1" &&
                                                    <button class="btn btn-icon like pr-1 pl-0" title="Like" onClick={() => this.handleLikeAns(feeds.hasLiked, feeds.answerID, feeds.postID)} ><i class="fa fa-thumbs-o-up pr-1" /> {feeds.like_count2}</button>
                                                }
                                                {feeds.type_post == "1" &&
                                                    <button class="btn btn-icon pl-3 pr-1 comment" title="View comments" type="button" data-toggle="modal" data-target="#commentsModal" onClick={() => this.getCommentsAns(feeds.answerID, feeds.postID)}><i class="fa fa-comment-o pr-1" />{feeds.comment_count2}</button>
                                                }
                                                {feeds.hasLiked == "1" && feeds.type_post == "2" &&
                                                    <button class="btn btn-icon like pr-1 pl-0 red" title="Unlike"><i class="fa fa-thumbs-o-up pr-1" onClick={() => this.handleLike(feeds.hasLiked, feeds.postID)} /> {feeds.like_count}</button>
                                                }
                                                {!feeds.hasLiked && feeds.type_post == "2" &&
                                                    <button class="btn btn-icon like pr-1 pl-0" title="Like"><i class="fa fa-thumbs-o-up pr-1" onClick={() => this.handleLike(feeds.hasLiked, feeds.postID)} /> {feeds.like_count}</button>
                                                }
                                                {feeds.type_post == "2" &&
                                                    <button class="btn btn-icon pl-3 pr-1 comment" title="View comments" type="button" data-toggle="modal" data-target="#commentsPostModal" onClick={() => this.getCommentsPost(feeds.postID)}><i class="fa fa-comment-o pr-1" />{feeds.comment_count}</button>
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
                                                {!feeds.hasSave &&
                                                    <button class="btn btn-icon pl-3 save" type="button" title="Save thread" onClick={() => this.saveThread(feeds.postID)}><i class="fa fa-bookmark-o" /></button>
                                                }
                                                {feeds.hasSave == "1" &&
                                                    <button class="btn btn-icon pl-3 save blue" type="button" title="Unsave thread" onClick={() => this.saveThread(feeds.postID)}><i class="fa fa-bookmark" /></button>
                                                }
                                                {!feeds.hasFollow &&
                                                    <button class="btn btn-icon pl-2 save" type="button" title="Follow thread" onClick={() => this.followThread(feeds.postID)}><i class="fa fa-user-plus" /></button>
                                                }
                                                {feeds.hasFollow == "1" &&
                                                    <button class="btn btn-icon pl-2 save blue" type="button" title="Unfollow thread" onClick={() => this.followThread(feeds.postID)}><i class="fa fa-user-plus" /></button>
                                                }
                                            </li>
                                        }
                                        {!localStorage.usertoken &&
                                            <li class="feeds-footer">
                                                {feeds.type_post == "1" &&
                                                    <button class="btn btn-icon like pr-1 pl-0 disabled" title="Likes"><i class="fa fa-thumbs-o-up pr-1" /> {feeds.like_count2}</button>
                                                }
                                                {feeds.type_post == "1" &&
                                                    <button class="btn btn-icon pl-3 pr-1 comment" title="View comments" type="button" data-toggle="modal" data-target="#commentsModal" onClick={() => this.getCommentsAns(feeds.answerID)}><i class="fa fa-comment-o pr-1" />{feeds.comment_count2}</button>
                                                }
                                                {feeds.type_post == "2" &&
                                                    <button class="btn btn-icon like pr-1 pl-0 disabled" title="Likes"><i class="fa fa-thumbs-o-up pr-1" /> {feeds.like_count}</button>
                                                }
                                                {feeds.type_post == "2" &&
                                                    <button class="btn btn-icon pl-3 pr-1 comment" title="View comments" type="button" data-toggle="modal" data-target="#commentsPostModal" onClick={() => this.getCommentsPost(feeds.postID)}><i class="fa fa-comment-o pr-1" />{feeds.comment_count}</button>
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
                                            </li>
                                        }

                                    </ul>
                                </div>
                            </div>
                        ))}
                        {/* end of feeds */}
                    </div>

                    {/* unanswered questions */}
                    < div class="col-sm-2" >
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
                    {/* end of unanswered questions */}
                </div>


                {/* modal for comments ans */}
                <div id="commentsModal" class="modal fade" role="dialog">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header blueBg">
                                <h4 class="modal-title text-white">Comments</h4>
                                <button type="button" class="close pr-4" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body text-left pt-0">
                                {localStorage.usertoken &&
                                    <div class="row content mb-0 greyBg pt-4 pb-3">
                                        <div class="col-xl-1 col-md-2 col-sm-2 col-xs-2 pt-3">
                                            <img src={profilePicture} alt="" width="55" class="rounded-circle pl-2 pr-2" />
                                        </div>
                                        <div class="col-xl-11 col-md-10 col-sm-10 col-xs-10">
                                            <p class="font-italic pb-1 mb-0 pl-2">Commenting as {this.state.user}</p>
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
                                }
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
                                        {localStorage.usertoken && this.state.name == `${comment.username}` &&
                                            <ul class="feeds-footer mb-5 mt-0">
                                                {/* <button class="btn btn-icon like pr-1 pl-2" title="Like"><i class="fa fa-thumbs-o-up pr-1" /> 2</button> */}
                                                {/* <button class="btn btn-icon float-right report" title="Report" type="button" data-toggle="modal" data-target="#reportModal"><i class="fa fa-exclamation-circle" /></button> */}
                                                {/* <button class="btn btn-icon dislike float-right" title="Dislike"><i class="fa fa-thumbs-o-down pr-1" /> 1</button> */}
                                                <li>
                                                    <button class="btn btn-icon float-right" type="button" data-toggle="modal" title="Delete Comment" data-target="#deleteCommentModal" onClick={() => this.setCommentID(`${comment.commentID}`)}><i class="fa fa-trash like" /></button>
                                                    <button class="btn btn-icon float-right" title="Edit Comment" data-toggle="modal" data-target="#editCommentModal" onClick={() => this.setCommentAndID(`${comment.commentID}`, `${comment.comment}`)}><i class="fa fa-pencil comment" /></button>
                                                </li>
                                            </ul>
                                        }
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
                                <h4 class="modal-title text-white">Comments</h4>
                                <button type="button" class="close pr-4" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body text-left pt-0">
                                {localStorage.usertoken &&
                                    <div class="row content mb-0 greyBg pt-4 pb-3">
                                        <div class="col-xl-1 col-md-2 col-sm-2 col-xs-2 pt-3">
                                            <img src={profilePicture} alt="" width="55" class="rounded-circle pl-2 pr-2" />
                                        </div>
                                        <div class="col-xl-11 col-md-10 col-sm-10 col-xs-10">
                                            <p class="font-italic pb-1 mb-0 pl-2">Commenting as {this.state.user}</p>
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
                                }
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
                                        {localStorage.usertoken && this.state.name == `${comment.username}` &&
                                            <ul class="feeds-footer mb-5 mt-0">
                                                {/* <button class="btn btn-icon like pr-1 pl-2" title="Like"><i class="fa fa-thumbs-o-up pr-1" /> 2</button> */}
                                                {/* <button class="btn btn-icon float-right report" title="Report" type="button" data-toggle="modal" data-target="#reportModal"><i class="fa fa-exclamation-circle" /></button> */}
                                                {/* <button class="btn btn-icon dislike float-right" title="Dislike"><i class="fa fa-thumbs-o-down pr-1" /> 1</button> */}
                                                <li>
                                                    <button class="btn btn-icon float-right" type="button" data-toggle="modal" title="Delete Comment" data-target="#deleteCommentModal" onClick={() => this.setCommentID(`${comment.commentID}`)}><i class="fa fa-trash like" /></button>
                                                    <button class="btn btn-icon float-right" title="Edit Comment" data-toggle="modal" data-target="#editCommentModal" onClick={() => this.setCommentAndID(`${comment.commentID}`, `${comment.comment}`)}><i class="fa fa-pencil comment" /></button>
                                                </li>
                                            </ul>
                                        }
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
                {/* start of delete comment modal */}
                <div id="deleteCommentModal" class="modal fade" role="dialog">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4>Delete Comment</h4>
                                <button type="button" class="close pr-4" data-dismiss="modal">&times;</button>
                            </div >
                            <div class="modal-body text-left pt-3 pb-3">
                                Are you sure you want to delete your comment?
                                    <div class="row content ml-1 mr-1 pt-5 d-flex justify-content-center">
                                    <button class="btn btn-default col-sm-5 btn-outline-danger mr-2" onClick={this.handleDeleteComment}>Delete</button>
                                    <button type="button" class="btn btn-default col-sm-5 btn-outline-secondary" data-dismiss="modal">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* end of delete comment modal */}

                {/* start of edit comment modal */}
                <div id="editCommentModal" class="modal fade" role="dialog">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4>Edit My Comment</h4>
                                <button type="button" class="close pr-4" data-dismiss="modal">&times;</button>
                            </div >
                            <form onSubmit={this.handleEditComment}>
                                <ul class="row content">
                                    <li class="col-sm-9 mt-3">
                                        <TextareaAutosize
                                            class="col-sm-10 comment-input p-2 pl-4 pr-4"
                                            class="form-control"
                                            value={this.state.commentEdit}
                                            onChange={this.onCommentEditChange}
                                            required
                                        />
                                    </li>
                                    <li class="col-sm-2 mt-3">
                                        <button type="submit" class="btn btn-orange">Edit Comment</button>
                                    </li>
                                </ul>
                            </form>
                        </div>
                    </div>
                </div>
                {/* end of edit comment modal */}
            </div >
        )
    }
}