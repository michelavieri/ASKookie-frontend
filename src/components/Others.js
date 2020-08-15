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
import { Image } from "cloudinary-react";
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


export class Others extends Component {
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
            member_type: "",
            profile: "",
        };
    }
    componentDidMount() {
        if (localStorage.usertoken) {
            const token = localStorage.usertoken;
            const decoded = jwt_decode(token);
            this.setState({
                user: decoded.result.username,
                member_type: decoded.result.member_type
            });
            trackPromise(
                fetch('https://whispering-hamlet-08619.herokuapp.com/profile/' + `${decoded.result.username}`)
                    .then(res => res.json())
                    .then(res => {
                        this.setState({ profile: res.data[0].publicID });
                    }))
        }
        trackPromise(
            fetch('https://whispering-hamlet-08619.herokuapp.com/feeds/others')
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
                }));
        trackPromise(
            fetch('https://whispering-hamlet-08619.herokuapp.com/unanswered')
                .then(res => res.json())
                .then(res => {
                    this.setState({ unanswered: res.data });
                    this.shuffleArray();
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
        return axios.get('https://whispering-hamlet-08619.herokuapp.com/hasLiked/post/' + `${id}` + "/" + `${this.state.name}`
        ).then(res => {
            return res.data.data[0].hasLiked;
        }
        ).catch(err => console.log(err))
    }

    getHasLikedAns(id) {
        return axios.get('https://whispering-hamlet-08619.herokuapp.com/hasLiked/answer/' + `${id}` + "/" + `${this.state.name}`
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
        return axios.get('https://whispering-hamlet-08619.herokuapp.com/hasSave/post/' + `${id}` + "/" + `${this.state.name}`
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
        return axios.get('https://whispering-hamlet-08619.herokuapp.com/hasFollow/post/' + `${id}` + "/" + `${this.state.name}`
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
        axios.get('https://whispering-hamlet-08619.herokuapp.com/answers/' + postID)
            .then(res => {
                if (res == null) {
                    return null;
                }
            })
            .catch(err => console.log(err));
    }

    async shuffleArray() {
        if (this.state.unanswered) {
            let i = this.state.unanswered.length - 1;
            var array = this.state.unanswered.slice();
            for (; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                const temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            await this.setState({
                unanswered: array
            })
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
                .post('https://whispering-hamlet-08619.herokuapp.com/like/post', data)
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
                .post('https://whispering-hamlet-08619.herokuapp.com/unlike/post', data)
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
                .post('https://whispering-hamlet-08619.herokuapp.com/like/answer', data)
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
                .post('https://whispering-hamlet-08619.herokuapp.com/unlike/answer', data)
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
            this.state.feeds[index].hasSave = 1;

            this.setState({
                feeds: this.state.feeds,
            })
            axios.post('https://whispering-hamlet-08619.herokuapp.com/save', data)
                .then(
                    res => {
                        console.log(res);
                    })
                .catch(err => console.log(err));
        } else {
            this.state.feeds[index].hasSave = null;

            this.setState({
                feeds: this.state.feeds,
            })
            axios
                .post('https://whispering-hamlet-08619.herokuapp.com/unsave', data)
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
            this.state.feeds[index].hasFollow = 1;

            this.setState({
                feeds: this.state.feeds,
            })
            axios.post('https://whispering-hamlet-08619.herokuapp.com/follow', data)
                .then(
                    res => {
                        console.log(res);
                    })
                .catch(err => console.log(err));
        } else {
            this.state.feeds[index].hasFollow = null;

            this.setState({
                feeds: this.state.feeds,
            })
            axios
                .post('https://whispering-hamlet-08619.herokuapp.com/unfollow', data)
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
            .post('https://whispering-hamlet-08619.herokuapp.com/edit/comment', data)
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

        axios
            .delete('https://whispering-hamlet-08619.herokuapp.com/delete/comment/' + id_del) //delete answer with id id_del
            .then(res => {
                console.log(res);
                window.location.reload(false);
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
            .post('https://whispering-hamlet-08619.herokuapp.com/comment/post', data)
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
            .post('https://whispering-hamlet-08619.herokuapp.com/comment/answer', data)
            .then(
                res => {
                    console.log(res);
                    this.props.history.push(`/thread/` + this.state.postID);
                    window.location.reload(false);
                })
            .catch(err => console.log(err));
    };

    getCommentsAns(id, postid) {
        this.setState({
            answerID: id,
        })
        trackPromise(
            fetch('https://whispering-hamlet-08619.herokuapp.com/comments/answer/' + id)
                .then(res => res.json())
                .then(res => {
                    this.setState({
                        commentsAns: res.data,
                        postID: postid,
                    });
                }))
    }

    getCommentsPost = (id) => {
        trackPromise(
            fetch('https://whispering-hamlet-08619.herokuapp.com/comments/post/' + id)
                .then(res => res.json())
                .then(res => {
                    this.setState({
                        commentsPost: res.data,
                        postID: id,
                    });
                }))
    }


    render() {
        var shuffledPosts = this.state.unanswered;
        var mostRecentPosts = this.mostRecent();
        return (
            <div className="container-fluid text-center margin-top">
                <NavigationRouter2 />
                <button className="bottom-right-fixed btn bg-yellow btn-lg refresh-button rounded-edge d-none d-xl-block" onClick={() => this.scrollToTop()} id="myBtn" title="Scroll to top"><i className="fa fa-chevron-up"></i></button>
                <div className="row content">
                    <div className="col-sm-2 mr-4">
                        <div className="position-fixed">
                            <div className="card d-none d-xl-block text-left" style={{ width: '11rem' }}>
                                <div className="card-header">
                                    Categories
                                </div>
                                <div className="card-body">
                                    <ul className="list-group list-group-flush large-space">
                                        <NavLink className="listku card-link" to="/faculties"><li>Faculties</li></NavLink>
                                        <NavLink className="listku" to="/accommodation"><li>Accommodation</li></NavLink>
                                        <NavLink className="listku" to="/student_life"><li>Student Life</li></NavLink>
                                        <NavLink className="listku" to="/job_intern"><li>Job/Internship</li></NavLink>
                                        <NavLink className="listku" to="/exchange_noc"><li>Exchange/NOC</li></NavLink>
                                        <NavLink className="listku font-weight-bold" to="/others"><li>Others</li></NavLink>
                                    </ul>
                                </div>
                                <div className="card-footer">
                                    <NavLink className="text-dark small" to="/about_us">About us</NavLink>
                                    <br />
                                    <a className="text-dark small" href="mailto:askookieforum@gmail.com">Email us</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-7 col-sm-push-10 text-left">
                        <div className="card mb-3">
                            <div className="card-header orange-color">
                                <b>Category: Others</b>
                            </div>
                        </div>
                        <div className="card mb-3">
                            <div className="card-body">
                                {this.state.name != '' && <h7 className="card-title" style={{ opacity: '50%' }}>{this.state.name},</h7>}
                                {this.state.name == '' && <h7 className="card-title" style={{ opacity: '50%' }}>Hi,</h7>}
                                <br />
                                <button className="questionButton" style={{ opacity: '50%' }} type="button" data-toggle="modal" data-target="#askModal">
                                    <p className="text-decoration-none stretched-link text-dark pb-0" >What is your Question?</p></button>
                            </div>
                        </div>

                        {/* feeds */}
                        {mostRecentPosts && mostRecentPosts.map(feeds => (
                            <div className="card mb-3">
                                <div className="card-body pb-1">
                                    <ul className="list-group">
                                        <li>
                                            {feeds.type_post == "1" && feeds.anonymous2 == "1" &&
                                                <div className="sub-text">
                                                    <NavLink target="_blank" className="sub-link" to={`/thread/${feeds.postID}`}><h8> @{feeds.postID} </h8></NavLink>
                                                &middot; Answered by {feeds.answerer} on {`${feeds.time2}`}
                                                </div>
                                            }
                                            {feeds.type_post == "1" && feeds.anonymous2 == "0" &&
                                                <div className="sub-text">
                                                    <NavLink target="_blank" className="sub-link" to={`/thread/${feeds.postID}`}><h8> @{feeds.postID} </h8></NavLink>
                                                &middot; Answered by an anonymous user on {`${feeds.time2}`}
                                                </div>
                                            }
                                            {feeds.type_post == "2" &&
                                                <div className="sub-text">
                                                    <NavLink target="_blank" className="sub-link" to={`/thread/${feeds.postID}`}><h8> @{feeds.postID} </h8></NavLink>
                                                &middot; Posted by {feeds.asker} on {`${feeds.time}`}
                                                </div>
                                            }
                                        </li>
                                        <li>
                                            <NavLink target="_blank" className="btn-category unanswered font-weight-bold lead" to={`thread/${feeds.postID}`}>{feeds.question}{feeds.title}</NavLink>
                                        </li>
                                        <li>
                                            <Linkify componentDecorator={this.componentDecorator}>
                                                <div className="show-more" data-type="text" data-number="80">
                                                    <p className="whiteSpace">{feeds.post_content}{feeds.answer}</p>
                                                    <Image cloudName="askookie" publicId={feeds.publicID} className="img-feeds pl-2 pr-5 pb-2" crop="scale" />
                                                </div>
                                            </Linkify>
                                        </li>
                                        {localStorage.usertoken &&
                                            <li className="feeds-footer">
                                                {feeds.hasLiked == "1" && feeds.type_post == "1" &&
                                                    <button className="btn btn-icon like pr-1 pl-0 red" title="Unlike" onClick={() => this.handleLikeAns(feeds.hasLiked, feeds.answerID, feeds.postID)} ><i className="fa fa-thumbs-o-up pr-1" /> {feeds.like_count2}</button>
                                                }
                                                {!feeds.hasLiked && feeds.type_post == "1" &&
                                                    <button className="btn btn-icon like pr-1 pl-0" title="Like" onClick={() => this.handleLikeAns(feeds.hasLiked, feeds.answerID, feeds.postID)} ><i className="fa fa-thumbs-o-up pr-1" /> {feeds.like_count2}</button>
                                                }
                                                {feeds.type_post == "1" &&
                                                    <button className="btn btn-icon pl-3 pr-1 comment" title="View comments" type="button" data-toggle="modal" data-target="#commentsModal" onClick={() => this.getCommentsAns(feeds.answerID, feeds.postID)}><i className="fa fa-comment-o pr-1" />{feeds.comment_count2}</button>
                                                }
                                                {feeds.hasLiked == "1" && feeds.type_post == "2" &&
                                                    <button className="btn btn-icon like pr-1 pl-0 red" title="Unlike"><i className="fa fa-thumbs-o-up pr-1" onClick={() => this.handleLike(feeds.hasLiked, feeds.postID)} /> {feeds.like_count}</button>
                                                }
                                                {!feeds.hasLiked && feeds.type_post == "2" &&
                                                    <button className="btn btn-icon like pr-1 pl-0" title="Like"><i className="fa fa-thumbs-o-up pr-1" onClick={() => this.handleLike(feeds.hasLiked, feeds.postID)} /> {feeds.like_count}</button>
                                                }
                                                {feeds.type_post == "2" &&
                                                    <button className="btn btn-icon pl-3 pr-1 comment" title="View comments" type="button" data-toggle="modal" data-target="#commentsPostModal" onClick={() => this.getCommentsPost(feeds.postID)}><i className="fa fa-comment-o pr-1" />{feeds.comment_count}</button>
                                                }
                                                <div className="btn-group dropright">
                                                    <button className="btn btn-icon pl-3 pr-1 share" title="Share" id="shareDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="fa fa-share" /></button>
                                                    <div className="dropdown-menu dropdown-menu-left pb-2" aria-labelledby="shareDropdown">
                                                        <p className="dropdown-item greyBg font-weight-bold pb-2 mb-0" to="#"><i className="fa fa-share pr-2" />Share Thread</p>
                                                        <div className="dropdown-divider mt-0"></div>
                                                        <button className="dropdown-item pl-3" onClick={() => { navigator.clipboard.writeText(`https://askookie.netlify.app/thread/${feeds.postID}`) }}
                                                        ><i className="fa fa-files-o pr-3 fa-lg ml-0" />Copy Link</button>
                                                        <div className="dropdown-divider"></div>
                                                        <WhatsappShareButton className="dropdown-item" url={`https://askookie.netlify.app/thread/${feeds.postID}`} title={feeds.post}><WhatsappIcon className="pr-2 pl-2" size={50} round={true} />Whatsapp</WhatsappShareButton>
                                                        <div className="dropdown-divider"></div>
                                                        <TwitterShareButton className="dropdown-item" url={`https://askookie.netlify.app/thread/${feeds.postID}`} title={feeds.post}><TwitterIcon className="pr-2 pl-2" size={50} round={true} />Twitter</TwitterShareButton>
                                                        <div className="dropdown-divider"></div>
                                                        <FacebookShareButton className="dropdown-item" url={`https://askookie.netlify.app/thread/${feeds.postID}`} quote={feeds.post} hashtag="#ASKookie"><FacebookIcon className="pr-2 pl-2" size={50} round={true} />Facebook</FacebookShareButton>
                                                        <div className="dropdown-divider"></div>
                                                        <EmailShareButton className="dropdown-item" url={`https://askookie.netlify.app/thread/${feeds.postID}`} subject="Check this thread in ASKookie!" body={feeds.post}><EmailIcon className="pr-2 pl-2" size={50} round={true} />Email</EmailShareButton>
                                                        <div className="dropdown-divider"></div>
                                                        <TelegramShareButton className="dropdown-item" url={`https://askookie.netlify.app/thread/${feeds.postID}`} title={feeds.post}><TelegramIcon className="pr-2 pl-2" size={50} round={true} />Telegram</TelegramShareButton>
                                                        <div className="dropdown-divider"></div>
                                                        <LineShareButton className="dropdown-item" url={`https://askookie.netlify.app/thread/${feeds.postID}`} title={feeds.post}><LineIcon className="pr-2 pl-2" size={50} round={true} />Line</LineShareButton>
                                                    </div>
                                                </div>
                                                {!feeds.hasSave &&
                                                    <button className="btn btn-icon pl-3 save" type="button" title="Save thread" onClick={() => this.saveThread(feeds.postID)}><i className="fa fa-bookmark-o" /></button>
                                                }
                                                {feeds.hasSave == "1" &&
                                                    <button className="btn btn-icon pl-3 save blue" type="button" title="Unsave thread" onClick={() => this.saveThread(feeds.postID)}><i className="fa fa-bookmark" /></button>
                                                }
                                                {!feeds.hasFollow &&
                                                    <button className="btn btn-icon pl-2 save" type="button" title="Follow thread" onClick={() => this.followThread(feeds.postID)}><i className="fa fa-user-plus" /></button>
                                                }
                                                {feeds.hasFollow == "1" &&
                                                    <button className="btn btn-icon pl-2 save blue" type="button" title="Unfollow thread" onClick={() => this.followThread(feeds.postID)}><i className="fa fa-user-plus" /></button>
                                                }
                                            </li>
                                        }
                                        {!localStorage.usertoken &&
                                            <li className="feeds-footer">
                                                {feeds.type_post == "1" &&
                                                    <button className="btn btn-icon like pr-1 pl-0 disabled" title="Likes"><i className="fa fa-thumbs-o-up pr-1" /> {feeds.like_count2}</button>
                                                }
                                                {feeds.type_post == "1" &&
                                                    <button className="btn btn-icon pl-3 pr-1 comment" title="View comments" type="button" data-toggle="modal" data-target="#commentsModal" onClick={() => this.getCommentsAns(feeds.answerID)}><i className="fa fa-comment-o pr-1" />{feeds.comment_count2}</button>
                                                }
                                                {feeds.type_post == "2" &&
                                                    <button className="btn btn-icon like pr-1 pl-0 disabled" title="Likes"><i className="fa fa-thumbs-o-up pr-1" /> {feeds.like_count}</button>
                                                }
                                                {feeds.type_post == "2" &&
                                                    <button className="btn btn-icon pl-3 pr-1 comment" title="View comments" type="button" data-toggle="modal" data-target="#commentsPostModal" onClick={() => this.getCommentsPost(feeds.postID)}><i className="fa fa-comment-o pr-1" />{feeds.comment_count}</button>
                                                }
                                                <div className="btn-group dropright">
                                                    <button className="btn btn-icon pl-3 pr-1 share" title="Share" id="shareDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="fa fa-share" /></button>
                                                    <div className="dropdown-menu dropdown-menu-left pb-2" aria-labelledby="shareDropdown">
                                                        <p className="dropdown-item greyBg font-weight-bold pb-2 mb-0" to="#"><i className="fa fa-share pr-2" />Share Thread</p>
                                                        <div className="dropdown-divider mt-0"></div>
                                                        <button className="dropdown-item pl-3" onClick={() => { navigator.clipboard.writeText(`https://askookie.netlify.app/thread/${feeds.postID}`) }}
                                                        ><i className="fa fa-files-o pr-3 fa-lg ml-0" />Copy Link</button>
                                                        <div className="dropdown-divider"></div>
                                                        <WhatsappShareButton className="dropdown-item" url={`https://askookie.netlify.app/thread/${feeds.postID}`} title={feeds.post}><WhatsappIcon className="pr-2 pl-2" size={50} round={true} />Whatsapp</WhatsappShareButton>
                                                        <div className="dropdown-divider"></div>
                                                        <TwitterShareButton className="dropdown-item" url={`https://askookie.netlify.app/thread/${feeds.postID}`} title={feeds.post}><TwitterIcon className="pr-2 pl-2" size={50} round={true} />Twitter</TwitterShareButton>
                                                        <div className="dropdown-divider"></div>
                                                        <FacebookShareButton className="dropdown-item" url={`https://askookie.netlify.app/thread/${feeds.postID}`} quote={feeds.post} hashtag="#ASKookie"><FacebookIcon className="pr-2 pl-2" size={50} round={true} />Facebook</FacebookShareButton>
                                                        <div className="dropdown-divider"></div>
                                                        <EmailShareButton className="dropdown-item" url={`https://askookie.netlify.app/thread/${feeds.postID}`} subject="Check this thread in ASKookie!" body={feeds.post}><EmailIcon className="pr-2 pl-2" size={50} round={true} />Email</EmailShareButton>
                                                        <div className="dropdown-divider"></div>
                                                        <TelegramShareButton className="dropdown-item" url={`https://askookie.netlify.app/thread/${feeds.postID}`} title={feeds.post}><TelegramIcon className="pr-2 pl-2" size={50} round={true} />Telegram</TelegramShareButton>
                                                        <div className="dropdown-divider"></div>
                                                        <LineShareButton className="dropdown-item" url={`https://askookie.netlify.app/thread/${feeds.postID}`} title={feeds.post}><LineIcon className="pr-2 pl-2" size={50} round={true} />Line</LineShareButton>
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
                    < div className="col-sm-2" >
                        <div className="card d-none d-xl-block text-left" style={{ width: '13rem' }}>
                            <div className="card-header">
                                Unanswered Questions
                            </div>
                            <ul className="list-group list-group-flush">
                                {shuffledPosts && shuffledPosts.slice(0, 5).map((feeds, index) => (
                                    <NavLink className="btn-category" to={`/thread/${feeds.postID}`}><li className="list-group-item unanswered"><p className="mr-4 mb-0">{feeds.question}</p> <i className="fa fa-fw fa-pencil bottom-right icon"></i></li></NavLink>
                                ))}
                            </ul>
                            <div className="card-footer overflow-auto">
                                <button className="btn refresh-button pull-right">
                                    {/* <i className="fa fa-fw fa-refresh mx-lg-1 fa-lg" />
                                    Refresh */}
                                    <NavLink className="listku" to="/answer">See More</NavLink>
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* end of unanswered questions */}
                </div>


                {/* modal for comments ans */}
                <div id="commentsModal" className="modal fade" role="dialog">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header blueBg">
                                <h4 className="modal-title text-white">Comments</h4>
                                <button type="button" className="close pr-4" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body text-left pt-0">
                                {localStorage.usertoken &&
                                    <div className="row content mb-0 greyBg pt-4 pb-3">
                                        <div className="col-xl-1 col-md-2 col-sm-2 col-xs-2 pt-3">
                                            {this.state.profile == null &&
                                                <img src={profilePicture} alt="" width="55" className="rounded-circle pl-2 pr-2" />
                                            }
                                            {this.state.profile != null &&
                                                <Image cloudName="askookie" className="rounded-circle" publicId={this.state.profile} width="55" crop="scale" />
                                            }
                                        </div>
                                        <div className="col-xl-11 col-md-10 col-sm-10 col-xs-10">
                                            <p className="font-italic pb-1 mb-0 pl-2">Commenting as {this.state.user}</p>
                                            <form onSubmit={this.handleSubmitCommentAns}>
                                                <TextareaAutosize
                                                    className="col-sm-10 comment-input p-2 pl-4 pr-4"
                                                    placeholder="Add a comment..."
                                                    value={this.state.comment}
                                                    onChange={this.onCommentChange}
                                                    maxRows="5"
                                                    minRows="1"
                                                    required
                                                ></TextareaAutosize>
                                                <button type="submit" className="btn btn-comment align-top ml-2">Add Comment</button>
                                            </form>
                                        </div>
                                    </div>
                                }
                                <hr className="mt-0 mb-4" />

                                {this.state.commentsAns && this.state.commentsAns.map(comment =>
                                    <div>
                                        <div className="row content">
                                            <div className="col-sm-12 ml-2">
                                                <p className="font-weight-bold pb-0 mb-0">{comment.username}</p>
                                                <p className="sub-text pt-0 mt-0">Commented on {comment.time}</p>
                                            </div>
                                            <p className="mr-3 ml-4 whiteSpace">{comment.comment}</p>
                                        </div>
                                        {localStorage.usertoken && (this.state.member_type == 1 || this.state.name == `${comment.username}`) &&
                                            <ul className="feeds-footer mb-5 mt-0">
                                                {/* <button className="btn btn-icon like pr-1 pl-2" title="Like"><i className="fa fa-thumbs-o-up pr-1" /> 2</button> */}
                                                {/* <button className="btn btn-icon float-right report" title="Report" type="button" data-toggle="modal" data-target="#reportModal"><i className="fa fa-exclamation-circle" /></button> */}
                                                {/* <button className="btn btn-icon dislike float-right" title="Dislike"><i className="fa fa-thumbs-o-down pr-1" /> 1</button> */}
                                                <li>
                                                    <button className="btn btn-icon float-right" type="button" data-toggle="modal" title="Delete Comment" data-target="#deleteCommentModal" onClick={() => this.setCommentID(`${comment.commentID}`)}><i className="fa fa-trash like" /></button>
                                                    <button className="btn btn-icon float-right" title="Edit Comment" data-toggle="modal" data-target="#editCommentModal" onClick={() => this.setCommentAndID(`${comment.commentID}`, `${comment.comment}`)}><i className="fa fa-pencil comment" /></button>
                                                </li>
                                            </ul>
                                        }
                                        <hr className="mt-0 mb-4" />
                                    </div>
                                )}

                                {this.state.commentsAns.length == "0" &&
                                    <div className="muted-text mt-3 pl-3 pb-3">
                                        No comments yet!
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {/* end of modal comments */}

                {/* modal for comments post */}
                <div id="commentsPostModal" className="modal fade" role="dialog">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header blueBg">
                                <h4 className="modal-title text-white">Comments</h4>
                                <button type="button" className="close pr-4" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body text-left pt-0">
                                {localStorage.usertoken &&
                                    <div className="row content mb-0 greyBg pt-4 pb-3">
                                        <div className="col-xl-1 col-md-2 col-sm-2 col-xs-2 pt-3">
                                            {this.state.profile == null &&
                                                <img src={profilePicture} alt="" width="55" className="rounded-circle pl-2 pr-2" />
                                            }
                                            {this.state.profile != null &&
                                                <Image cloudName="askookie" className="rounded-circle" publicId={this.state.profile} width="55" crop="scale" />
                                            }
                                        </div>
                                        <div className="col-xl-11 col-md-10 col-sm-10 col-xs-10">
                                            <p className="font-italic pb-1 mb-0 pl-2">Commenting as {this.state.user}</p>
                                            <form onSubmit={this.handleSubmitCommentPost}>
                                                <TextareaAutosize
                                                    className="col-sm-10 comment-input p-2 pl-4 pr-4"
                                                    placeholder="Add a comment..."
                                                    value={this.state.comment}
                                                    onChange={this.onCommentChange}
                                                    maxRows="5"
                                                    minRows="1"
                                                    required
                                                ></TextareaAutosize>
                                                <button type="submit" className="btn btn-comment align-top ml-2">Add Comment</button>
                                            </form>
                                        </div>
                                    </div>
                                }
                                <hr className="mt-0 mb-4" />

                                {this.state.commentsPost && this.state.commentsPost.map(comment =>
                                    <div>
                                        <div className="row content">
                                            <div className="col-sm-12 ml-2">
                                                <p className="font-weight-bold pb-0 mb-0">{comment.username}</p>
                                                <p className="sub-text pt-0 mt-0">Commented on {comment.time}</p>
                                            </div>
                                            <p className="mr-3 ml-4 whiteSpace">{comment.comment}</p>
                                        </div>
                                        {localStorage.usertoken && (this.state.member_type == 1 || this.state.name == `${comment.username}`) &&
                                            <ul className="feeds-footer mb-5 mt-0">
                                                {/* <button className="btn btn-icon like pr-1 pl-2" title="Like"><i className="fa fa-thumbs-o-up pr-1" /> 2</button> */}
                                                {/* <button className="btn btn-icon float-right report" title="Report" type="button" data-toggle="modal" data-target="#reportModal"><i className="fa fa-exclamation-circle" /></button> */}
                                                {/* <button className="btn btn-icon dislike float-right" title="Dislike"><i className="fa fa-thumbs-o-down pr-1" /> 1</button> */}
                                                <li>
                                                    <button className="btn btn-icon float-right" type="button" data-toggle="modal" title="Delete Comment" data-target="#deleteCommentModal" onClick={() => this.setCommentID(`${comment.commentID}`)}><i className="fa fa-trash like" /></button>
                                                    <button className="btn btn-icon float-right" title="Edit Comment" data-toggle="modal" data-target="#editCommentModal" onClick={() => this.setCommentAndID(`${comment.commentID}`, `${comment.comment}`)}><i className="fa fa-pencil comment" /></button>
                                                </li>
                                            </ul>
                                        }
                                        <hr className="mt-0 mb-4" />
                                    </div>
                                )}
                                {this.state.commentsPost.length == "0" &&
                                    <div className="muted-text mt-3 pl-3 pb-3">
                                        No comments yet!
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {/* end of modal comments */}
                {/* start of delete comment modal */}
                <div id="deleteCommentModal" className="modal fade" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4>Delete Comment</h4>
                                <button type="button" className="close pr-4" data-dismiss="modal">&times;</button>
                            </div >
                            <div className="modal-body text-left pt-3 pb-3">
                                Are you sure you want to delete your comment?
                                    <div className="row content ml-1 mr-1 pt-5 d-flex justify-content-center">
                                    <button className="btn btn-default col-sm-5 btn-outline-danger mr-2" onClick={this.handleDeleteComment}>Delete</button>
                                    <button type="button" className="btn btn-default col-sm-5 btn-outline-secondary" data-dismiss="modal">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* end of delete comment modal */}

                {/* start of edit comment modal */}
                <div id="editCommentModal" className="modal fade" role="dialog">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4>Edit My Comment</h4>
                                <button type="button" className="close pr-4" data-dismiss="modal">&times;</button>
                            </div >
                            <form onSubmit={this.handleEditComment}>
                                <ul className="row content">
                                    <li className="col-sm-9 mt-3">
                                        <TextareaAutosize
                                            className="col-sm-10 comment-input p-2 pl-4 pr-4"
                                            className="form-control"
                                            value={this.state.commentEdit}
                                            onChange={this.onCommentEditChange}
                                            required
                                        />
                                    </li>
                                    <li className="col-sm-2 mt-3">
                                        <button type="submit" className="btn btn-orange">Edit Comment</button>
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