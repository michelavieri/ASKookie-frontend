import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import NavigationRouter2 from './Navigation'
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Linkify from 'react-linkify';
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
            answerID: "",
            commentsAns: [],
            commentsAnsCount: "",
            commentsPost: [],
            comment: "",
            answer: "",
            answerEdit: "",
            questionEdit: "",
            postEdit: "",
            commentEdit: "",
            commentID: "",
            anonymous: "1",
            member_type: "",
            fileInput: "",
            previewSource: '',
            selectedFile: '',
            profile: "",
        };

        this.getUserPost = this.getUserPost.bind(this);
        this.handleFileInputChange = this.handleFileInputChange.bind(this);
    }
    async componentDidMount() {
        this.getCommentsPost();
        if (localStorage.usertoken) {
            this.getUserPost();
            const token = localStorage.usertoken;
            const decoded = jwt_decode(token);
            this.setState({
                username: decoded.result.username,
                member_type: decoded.result.member_type,
            });
            trackPromise(
                fetch('https://whispering-hamlet-08619.herokuapp.com/profile/' + `${decoded.result.username}`)
                    .then(res => res.json())
                    .then(res => {
                        this.setState({ profile: res.data[0].publicID });
                    }))

        }
        trackPromise(
            fetch('https://whispering-hamlet-08619.herokuapp.com/comments/count/answer/' + `${this.props.match.params.id}` + "/" + `${this.state.username}`)
                .then(res => res.json())
                .then(res => {
                    this.setState({ answers: res.data });
                    this.checkHasLikeAns();
                }))
        trackPromise(
            fetch('https://whispering-hamlet-08619.herokuapp.com/thread/' + `${this.props.match.params.id}`)
                .then(res => res.json())
                .then(res => {
                    this.setState({ feeds: res.data });
                    this.checkHasLike();
                    this.checkHasSave();
                    this.checkHasFollow();
                }).then(res => {

                }))
        trackPromise(
            fetch('https://whispering-hamlet-08619.herokuapp.com/unanswered')
                .then(res => res.json())
                .then(res => {
                    this.setState({ unanswered: res.data });
                }))

    };

    async checkHasLike() {
        var hasLikedTemp = await this.getHasLikedPost();
        this.state.feeds.hasLiked = hasLikedTemp

        this.setState({ feeds: this.state.feeds })
    }

    getHasLikedPost() {
        return axios.get('https://whispering-hamlet-08619.herokuapp.com/hasLiked/post/' + `${this.props.match.params.id}` + "/" + `${this.state.username}`
        ).then(res => {
            return res.data.data[0].hasLiked;
        }
        ).catch(err => console.log(err))
    }

    async checkHasSave() {
        var hasSaveTemp = await this.getHasSave(this.props.match.params.id)
        this.state.feeds.hasSave = hasSaveTemp

        this.setState({ feeds: this.state.feeds })
    }

    getHasSave(id) {
        return axios.get('https://whispering-hamlet-08619.herokuapp.com/hasSave/post/' + `${id}` + "/" + `${this.state.username}`
        ).then(res => {
            return res.data.data[0].hasSave;
        }
        ).catch(err => console.log(err))
    }

    async checkHasFollow() {
        var hasFollowTemp = await this.getHasFollow(this.props.match.params.id)
        this.state.feeds.hasFollow = hasFollowTemp

        this.setState({ feeds: this.state.feeds })
    }

    getHasFollow(id) {
        return axios.get('https://whispering-hamlet-08619.herokuapp.com/hasFollow/post/' + `${id}` + "/" + `${this.state.username}`
        ).then(res => {
            return res.data.data[0].hasFollow;
        }
        ).catch(err => console.log(err))
    }

    checkHasLikeAns() {
        this.state.answers.map(answer => {
            axios.get('https://whispering-hamlet-08619.herokuapp.com/hasLiked/answer/' + `${answer.answerID}` + "/" + `${this.state.username}`
            ).then(res => {
                answer.hasLikedAns = res.data.data[0].hasLikedAns;
            }
            ).catch(err => console.log(err))
        })
    }

    getCommentsAns(id) {
        this.setState({
            answerID: id,
        })
        trackPromise(
            fetch('https://whispering-hamlet-08619.herokuapp.com/comments/answer/' + id)
                .then(res => res.json())
                .then(res => {
                    this.setState({ commentsAns: res.data });
                }))
    }

    getCommentsPost = () => {
        const { id } = this.props.match.params;
        trackPromise(
            fetch('https://whispering-hamlet-08619.herokuapp.com/comments/post/' + id)
                .then(res => res.json())
                .then(res => {
                    this.setState({ commentsPost: res.data });
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

    onAnswerEditChange = e => {
        this.setState({
            answerEdit: e.target.value,
        });
    };

    onQuestionEditChange = e => {
        this.setState({
            questionEdit: e.target.value,
        });
    };

    setQuestion(quest) {
        this.setState({
            questionEdit: quest,
        })
    }

    setPost(post) {
        this.setState({
            postEdit: post,
        })
    }

    onPostEditChange = e => {
        this.setState({
            postEdit: e.target.value,
        });
    };

    onCommentEditChange = e => {
        this.setState({
            commentEdit: e.target.value,
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

    onAnonChange = e => {
        if (e.target.checked) {
            this.setState({
                anonymous: 0,
            })
        } else {
            this.setState({
                anonymous: 1,
            })
        }
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

    setAnswerID(id) {
        this.setState({
            answerID: id,
        })
    }

    setAnswer(ans) {
        this.setState({
            answerEdit: ans,
        })
    }

    setAnswerAndID(id, ans) {
        this.setAnswerID(id);
        this.setAnswer(ans);
    }

    handleFileInputChange = e => {
        const file = e.target.files[0];
        this.previewFile(file);
    }

    previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            this.setState({ previewSource: reader.result })
        }
    };

    handleSubmitPost = async (e) => {
        const { id } = this.props.match.params;

        e.preventDefault();

        const data = {
            postID2: id,
            answer: this.state.answer,
            image: this.state.previewSource,
            answerer: this.state.answerer,
            time: new Date().toLocaleDateString(),
            anonymous: this.state.anonymous,
        };
        try {
            await fetch('https://whispering-hamlet-08619.herokuapp.com/answer', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-type': 'application/json' },
            });
            this.setState({ fileInput: '' });
            this.setState({ previewSource: '' });
            window.location.reload(false);
        } catch (error) {
            console.error(error);
        }
    };

    handleLike = (liked) => {
        var likeCount = this.state.feeds.like_count;
        if (!liked) {
            likeCount = likeCount + 1;
            this.setState({
                feeds: {
                    anonymous: this.state.feeds.anonymous,
                    asker: this.state.feeds.asker,
                    category: this.state.feeds.category,
                    comment_count: this.state.feeds.comment_count,
                    like_count: likeCount,
                    postID: this.state.feeds.postID,
                    post_content: this.state.feeds.post_content,
                    question: this.state.feeds.question,
                    time: this.state.feeds.time,
                    title: this.state.feeds.title,
                    type_post: this.state.feeds.type_post,
                    hasLiked: 1,
                    hasSave: this.state.feeds.hasSave,
                    hasFollow: this.state.feeds.hasFollow,
                }
            })
            const data = {
                postID: this.props.match.params.id,
                username: this.state.user,
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
            this.setState({
                feeds: {
                    anonymous: this.state.feeds.anonymous,
                    asker: this.state.feeds.asker,
                    category: this.state.feeds.category,
                    comment_count: this.state.feeds.comment_count,
                    like_count: likeCount,
                    postID: this.state.feeds.postID,
                    post_content: this.state.feeds.post_content,
                    question: this.state.feeds.question,
                    time: this.state.feeds.time,
                    title: this.state.feeds.title,
                    type_post: this.state.feeds.type_post,
                    hasLiked: null,
                    hasSave: this.state.feeds.hasSave,
                    hasFollow: this.state.feeds.hasFollow,
                }
            })
            const data = {
                postID: this.props.match.params.id,
                username: this.state.user,
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

    handleLikeAns = (liked, id) => {
        var index;
        for (var i = 0; i < this.state.answers.length; i++) {
            if (this.state.answers[i].answerID === id) {
                index = i;
                break;
            }
        }

        var likeCount = this.state.answers[index].like_count2;
        if (!liked) {
            likeCount = likeCount + 1;
            this.state.answers[index].like_count2 = likeCount;
            this.state.answers[index].hasLikedAns = 1;

            this.setState({
                answers: this.state.answers,
            })
            const data = {
                postID: this.props.match.params.id,
                username: this.state.user,
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
            this.state.answers[index].like_count2 = likeCount;
            this.state.answers[index].hasLikedAns = null;

            this.setState({
                answers: this.state.answers,
            })
            const data = {
                postID: this.props.match.params.id,
                username: this.state.user,
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
            .post('https://whispering-hamlet-08619.herokuapp.com/comment/post', data)
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
            postID: this.props.match.params.id,
        };

        axios
            .post('https://whispering-hamlet-08619.herokuapp.com/comment/answer', data)
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

        axios
            .delete('https://whispering-hamlet-08619.herokuapp.com/delete/post/' + id_del) //delete post with id id_del
            .then(res => {
                console.log(res);
                this.props.history.push(`/`); //redirect to home
                window.location.reload(false);
            })
            .catch(err => console.log(err));
    };

    handleDeleteAnswer = e => { //deleting answer
        const id_del = this.state.answerID;
        const id = this.props.match.params.id;
        e.preventDefault();

        axios
            .delete('https://whispering-hamlet-08619.herokuapp.com/delete/answer/' + id_del) //delete answer with id id_del
            .then(res => {
                console.log(res);
                this.props.history.push(`/thread/` + id);
                window.location.reload(false);
            })
            .catch(err => console.log(err));
    };

    handleEditAnswer = e => {
        e.preventDefault();
        const data = {
            content: this.state.answerEdit,
            answerID: this.state.answerID,
        };

        axios
            .post('https://whispering-hamlet-08619.herokuapp.com/edit/answer', data)
            .then(
                res => {
                    window.location.reload(false);
                })
            .catch(err => console.log(err));
    }

    handleDeleteComment = e => { //deleting comment
        const id_del = this.state.commentID;
        e.preventDefault();

        axios
            .delete('https://whispering-hamlet-08619.herokuapp.com/delete/comment/' + id_del) //delete comment with id id_del
            .then(res => {
                window.location.reload(false);
            })
            .catch(err => console.log(err));
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
                    window.location.reload(false);
                })
            .catch(err => console.log(err));
    }

    handleEditQuestion = e => {
        e.preventDefault();
        const data = {
            question: this.state.questionEdit,
            postID: this.props.match.params.id,
        };

        axios
            .post('https://whispering-hamlet-08619.herokuapp.com/edit/question', data)
            .then(
                res => {
                    window.location.reload(false);
                })
            .catch(err => console.log(err));
    };

    handleEditPost = e => {
        e.preventDefault();
        const data = {
            post_content: this.state.postEdit,
            postID: this.props.match.params.id,
        };

        axios
            .post('https://whispering-hamlet-08619.herokuapp.com/edit/post', data)
            .then(
                res => {
                    window.location.reload(false);
                })
            .catch(err => console.log(err));
    };

    saveThread() {
        const data = {
            username: this.state.username,
            postID: this.props.match.params.id,
        };
        if (!this.state.feeds.hasSave) {
            this.setState({
                feeds: {
                    anonymous: this.state.feeds.anonymous,
                    asker: this.state.feeds.asker,
                    category: this.state.feeds.category,
                    comment_count: this.state.feeds.comment_count,
                    like_count: this.state.feeds.like_count,
                    postID: this.state.feeds.postID,
                    post_content: this.state.feeds.post_content,
                    question: this.state.feeds.question,
                    time: this.state.feeds.time,
                    title: this.state.feeds.title,
                    type_post: this.state.feeds.type_post,
                    hasLiked: this.state.feeds.hasLiked,
                    hasSave: 1,
                    hasFollow: this.state.feeds.hasFollow,
                }
            })
            axios
                .post('https://whispering-hamlet-08619.herokuapp.com/save', data)
                .catch(err => console.log(err));
        } else {
            this.setState({
                feeds: {
                    anonymous: this.state.feeds.anonymous,
                    asker: this.state.feeds.asker,
                    category: this.state.feeds.category,
                    comment_count: this.state.feeds.comment_count,
                    like_count: this.state.feeds.like_count,
                    postID: this.state.feeds.postID,
                    post_content: this.state.feeds.post_content,
                    question: this.state.feeds.question,
                    time: this.state.feeds.time,
                    title: this.state.feeds.title,
                    type_post: this.state.feeds.type_post,
                    hasLiked: this.state.feeds.hasLiked,
                    hasSave: null,
                    hasFollow: this.state.feeds.hasFollow,
                }
            })
            axios
                .post('https://whispering-hamlet-08619.herokuapp.com/unsave', data)
                .catch(err => console.log(err));
        }
    };

    followThread() {
        const data = {
            username: this.state.username,
            postID: this.props.match.params.id,
        };
        if (!this.state.feeds.hasFollow) {
            this.setState({
                feeds: {
                    anonymous: this.state.feeds.anonymous,
                    asker: this.state.feeds.asker,
                    category: this.state.feeds.category,
                    comment_count: this.state.feeds.comment_count,
                    like_count: this.state.feeds.like_count,
                    postID: this.state.feeds.postID,
                    post_content: this.state.feeds.post_content,
                    question: this.state.feeds.question,
                    time: this.state.feeds.time,
                    title: this.state.feeds.title,
                    type_post: this.state.feeds.type_post,
                    hasLiked: this.state.feeds.hasLiked,
                    hasSave: this.state.feeds.hasSave,
                    hasFollow: 1,
                }
            })
            axios
                .post('https://whispering-hamlet-08619.herokuapp.com/follow', data)
                .catch(err => console.log(err));
        } else {
            this.setState({
                feeds: {
                    anonymous: this.state.feeds.anonymous,
                    asker: this.state.feeds.asker,
                    category: this.state.feeds.category,
                    comment_count: this.state.feeds.comment_count,
                    like_count: this.state.feeds.like_count,
                    postID: this.state.feeds.postID,
                    post_content: this.state.feeds.post_content,
                    question: this.state.feeds.question,
                    time: this.state.feeds.time,
                    title: this.state.feeds.title,
                    type_post: this.state.feeds.type_post,
                    hasLiked: this.state.feeds.hasLiked,
                    hasSave: this.state.feeds.hasSave,
                    hasFollow: null,
                }
            })
            axios
                .post('https://whispering-hamlet-08619.herokuapp.com/unfollow', data)
                .catch(err => console.log(err));
        }
    };

    getUserPost = () => { //get the user who post the question/post
        const postId = this.props.match.params.id; //get post id
        const token = localStorage.usertoken;
        const decoded = jwt_decode(token); //get current cuser

        this.setState({ user: decoded.result.username }); //set current user
        axios
            .get('https://whispering-hamlet-08619.herokuapp.com/user/' + postId) //search user who post the question
            .then(res => {
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
        // var feedsArr = [];
        // feedsArr = Object.values(this.state.feeds);

        return (
            <div className="container-fluid margin-top">
                <NavigationRouter2 />
                <div className="row content">
                    <div className="col-sm-9 text-left">
                        <div>
                            <div className="card border border-secondary">
                                <div className="card-body pb-0">
                                    <ul className="list-group">
                                        <li>
                                            <div className="sub-text">
                                                <h8 className="pr-1">@ {`${this.state.feeds.postID}`}</h8>
                                                    &middot; Posted on {`${this.state.feeds.time}`}
                                                {this.state.feeds.type_post == "2" &&
                                                    <div>Posted by {this.state.feeds.asker}</div>
                                                }
                                            </div>
                                        </li>
                                        <li>

                                            <p className="font-weight-bold lead" to="">{this.state.feeds.question}{this.state.feeds.title}</p>
                                        </li>
                                        <li>
                                            <hr className="mt-0 mb-4 pb-0 mb-0" />
                                        </li>
                                        {this.state.feeds.type_post == "2" &&
                                            <li>
                                                <div className="col-sm-9">
                                                    <p className="whiteSpace">{this.state.feeds.post_content}</p>
                                                </div>
                                            </li>
                                        }

                                        {localStorage.usertoken &&
                                            <li className="feeds-footer pb-3">
                                                {this.state.feeds.hasLiked == "1" &&
                                                    <button className="btn btn-icon like pr-1 pl-2 red" title="Like"><i className="fa fa-thumbs-o-up pr-1" onClick={() => this.handleLike(this.state.feeds.hasLiked)} />{this.state.feeds.like_count}</button>
                                                }
                                                {!this.state.feeds.hasLiked &&
                                                    <button className="btn btn-icon like pr-1 pl-2" title="Like"><i className="fa fa-thumbs-o-up pr-1" onClick={() => this.handleLike(this.state.feeds.hasLiked)} />{this.state.feeds.like_count}</button>
                                                }
                                                {this.state.feeds.type_post == "2" &&
                                                    <button className="btn btn-icon pl-3 pr-1 comment" title="View comments" type="button" data-toggle="modal" data-target="#commentsPostModal"><i className="fa fa-comment-o pr-1" />{this.state.feeds.comment_count}</button>
                                                }
                                                <div className="btn-group dropright">
                                                    <button className="btn btn-icon pl-3 pr-1 share" title="Share" id="shareDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="fa fa-share" /></button>
                                                    <div className="dropdown-menu dropdown-menu-left pb-2" aria-labelledby="shareDropdown">
                                                        <p className="dropdown-item greyBg font-weight-bold pb-2 mb-0" to="#"><i className="fa fa-share pr-2" />Share Thread</p>
                                                        <div className="dropdown-divider mt-0"></div>
                                                        <button className="dropdown-item pl-3" onClick={() => { navigator.clipboard.writeText(`https://askookie.netlify.app/thread/${this.state.feeds.postID}`) }}
                                                        ><i className="fa fa-files-o pr-3 fa-lg ml-0" />Copy Link</button>
                                                        <div className="dropdown-divider"></div>
                                                        <WhatsappShareButton className="dropdown-item" url={`https://askookie.netlify.app/thread/${this.state.feeds.postID}`} title={this.state.feeds.post}><WhatsappIcon className="pr-2 pl-2" size={50} round={true} />Whatsapp</WhatsappShareButton>
                                                        <div className="dropdown-divider"></div>
                                                        <TwitterShareButton className="dropdown-item" url={`https://askookie.netlify.app/thread/${this.state.feeds.postID}`} title={this.state.feeds.post}><TwitterIcon className="pr-2 pl-2" size={50} round={true} />Twitter</TwitterShareButton>
                                                        <div className="dropdown-divider"></div>
                                                        <FacebookShareButton className="dropdown-item" url={`https://askookie.netlify.app/thread/${this.state.feeds.postID}`} quote={this.state.feeds.post} hashtag="#ASKookie"><FacebookIcon className="pr-2 pl-2" size={50} round={true} />Facebook</FacebookShareButton>
                                                        <div className="dropdown-divider"></div>
                                                        <EmailShareButton className="dropdown-item" url={`https://askookie.netlify.app/thread/${this.state.feeds.postID}`} subject="Check this thread in ASKookie!" body={this.state.feeds.post}><EmailIcon className="pr-2 pl-2" size={50} round={true} />Email</EmailShareButton>
                                                        <div className="dropdown-divider"></div>
                                                        <TelegramShareButton className="dropdown-item" url={`https://askookie.netlify.app/thread/${this.state.feeds.postID}`} title={this.state.feeds.post}><TelegramIcon className="pr-2 pl-2" size={50} round={true} />Telegram</TelegramShareButton>
                                                        <div className="dropdown-divider"></div>
                                                        <LineShareButton className="dropdown-item" url={`https://askookie.netlify.app/thread/${this.state.feeds.postID}`} title={this.state.feeds.post}><LineIcon className="pr-2 pl-2" size={50} round={true} />Line</LineShareButton>
                                                    </div>
                                                </div>
                                                {!this.state.feeds.hasSave &&
                                                    < button className="btn btn-icon pl-3 save" type="button" title="Save thread" onClick={() => this.saveThread()}><i className="fa fa-bookmark-o" /></button>
                                                }
                                                {this.state.feeds.hasSave == "1" &&
                                                    < button className="btn btn-icon pl-3 save blue" type="button" title="Save thread" onClick={() => this.saveThread()}><i className="fa fa-bookmark" /></button>
                                                }
                                                {!this.state.feeds.hasFollow &&
                                                    <button className="btn btn-icon pl-2 save" type="button" title="Follow thread" onClick={() => this.followThread()}><i className="fa fa-user-plus" /></button>
                                                }
                                                {this.state.feeds.hasFollow == "1" &&
                                                    <button className="btn btn-icon pl-2 save blue" type="button" title="Unfollow thread" onClick={() => this.followThread()}><i className="fa fa-user-plus" /></button>
                                                }
                                                <button className="btn btn-icon float-right report" title="Report" type="button" data-toggle="modal" data-target="#reportModal"><i className="fa fa-exclamation-circle" /></button>
                                                {/* <button className="btn btn-icon dislike float-right" title="Dislike"><i className="fa fa-thumbs-o-down pr-1" /> 2</button> */}
                                            </li>
                                        }

                                        {!localStorage.usertoken &&
                                            <li className="feeds-footer pb-3">
                                                <button className="btn btn-icon like pr-1 pl-2 disabled" title="Likes"><i className="fa fa-thumbs-o-up pr-1" /> {this.state.feeds.like_count}</button>
                                                {this.state.feeds.type_post == "2" &&
                                                    <button className="btn btn-icon pl-3 pr-1 comment" title="View comments" type="button" data-toggle="modal" data-target="#commentsPostModal"><i className="fa fa-comment-o pr-1" />{this.state.feeds.comment_count}</button>
                                                }
                                                <div className="btn-group dropright">
                                                    <button className="btn btn-icon pl-3 pr-1 share" title="Share" id="shareDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="fa fa-share" /></button>
                                                    <div className="dropdown-menu dropdown-menu-left pb-2" aria-labelledby="shareDropdown">
                                                        <p className="dropdown-item greyBg font-weight-bold pb-2 mb-0" to="#"><i className="fa fa-share pr-2" />Share Thread</p>
                                                        <div className="dropdown-divider mt-0"></div>
                                                        <button className="dropdown-item pl-3" onClick={() => { navigator.clipboard.writeText(`https://askookie.netlify.app/thread/${this.state.feeds.postID}`) }}
                                                        ><i className="fa fa-files-o pr-3 fa-lg ml-0" />Copy Link</button>
                                                        <div className="dropdown-divider"></div>
                                                        <WhatsappShareButton className="dropdown-item" url={`https://askookie.netlify.app/thread/${this.state.feeds.postID}`} title={this.state.feeds.post}><WhatsappIcon className="pr-2 pl-2" size={50} round={true} />Whatsapp</WhatsappShareButton>
                                                        <div className="dropdown-divider"></div>
                                                        <TwitterShareButton className="dropdown-item" url={`https://askookie.netlify.app/thread/${this.state.feeds.postID}`} title={this.state.feeds.post}><TwitterIcon className="pr-2 pl-2" size={50} round={true} />Twitter</TwitterShareButton>
                                                        <div className="dropdown-divider"></div>
                                                        <FacebookShareButton className="dropdown-item" url={`https://askookie.netlify.app/thread/${this.state.feeds.postID}`} quote={this.state.feeds.post} hashtag="#ASKookie"><FacebookIcon className="pr-2 pl-2" size={50} round={true} />Facebook</FacebookShareButton>
                                                        <div className="dropdown-divider"></div>
                                                        <EmailShareButton className="dropdown-item" url={`https://askookie.netlify.app/thread/${this.state.feeds.postID}`} subject="Check this thread in ASKookie!" body={this.state.feeds.post}><EmailIcon className="pr-2 pl-2" size={50} round={true} />Email</EmailShareButton>
                                                        <div className="dropdown-divider"></div>
                                                        <TelegramShareButton className="dropdown-item" url={`https://askookie.netlify.app/thread/${this.state.feeds.postID}`} title={this.state.feeds.post}><TelegramIcon className="pr-2 pl-2" size={50} round={true} />Telegram</TelegramShareButton>
                                                        <div className="dropdown-divider"></div>
                                                        <LineShareButton className="dropdown-item" url={`https://askookie.netlify.app/thread/${this.state.feeds.postID}`} title={this.state.feeds.post}><LineIcon className="pr-2 pl-2" size={50} round={true} />Line</LineShareButton>
                                                    </div>
                                                </div>
                                                {/* <button className="btn btn-icon dislike float-right disabled" title="Dislikes"><i className="fa fa-thumbs-o-down pr-1" /> 2</button> */}
                                            </li>
                                        }


                                        {this.state.feeds.type_post != "2" &&

                                            <li>
                                                {localStorage.usertoken && (this.state.member_type == 1 || this.state.member_type == 2) &&
                                                    <form className="post pb-4" onSubmit={this.handleSubmitPost}>
                                                        <div className="form-row align-items-left mb-3 ml-3">
                                                            <textarea
                                                                rows="5"
                                                                className="form-control col-sm-9"
                                                                placeholder="What are your thoughts? "
                                                                value={this.state.answer}
                                                                onChange={this.onAnswerChange}
                                                                required />
                                                            <small className="form-text text-muted col-sm-11">
                                                                Inappropriate or irrelevant answers will be filtered accordingly.
                                                                </small>
                                                        </div>
                                                        <div className="form-row align-items-left row">
                                                            <input type="file" name="image" onChange={this.handleFileInputChange} value={this.state.fileInput}
                                                                className="form-input ml-3 mb-3" />
                                                        </div>
                                                        <div className="form-row align-items-left row">
                                                            {this.state.previewSource && (
                                                                <img src={this.state.previewSource} alt="chosen"
                                                                    style={{ width: '600px' }} className="ml-3 mb-3 mt-3" />
                                                            )}
                                                        </div>
                                                        {/*<NavLink to='/upload'><button className="btn mb-3 btn-icon ml-3 btn-outline-secondary"><i className="fa fa-file-image-o mr-2" />Upload image</button></NavLink>*/}

                                                        <div className="form-check row pull-left ml-3">
                                                            <input className="form-check-input" type="checkbox" defaultChecked={false} onChange={this.onAnonChange} id="anonymousCheck" />
                                                            <label className="form-check-label" for="anonymousCheck">
                                                                Appear Anonymous to others
                                                </label>
                                                        </div>
                                                        <br />
                                                        <button type="submit" className="btn btn-outline-success my-2 my-sm-0 ml-2 bottom-right">
                                                            Answer
                                                </button>
                                                    </form>
                                                }

                                                {localStorage.usertoken && this.state.member_type == 3 &&
                                                    <form>
                                                        <div className="form-row align-items-left mb-3 ml-3">
                                                            <textarea
                                                                disabled
                                                                rows="5"
                                                                className="form-control col-sm-9"
                                                                placeholder="What are your thoughts? "
                                                                value={this.state.answer}
                                                                onChange={this.onAnswerChange}
                                                                required />
                                                            <small className="form-text text-muted col-sm-11">
                                                                Inappropriate or irrelevant answers will be filtered accordingly.
                                                        </small>
                                                        </div>
                                                        <div className="alert alert-danger" role="alert">
                                                            <span className="fa fa-exclamation-triangle mr-2" />
                                                                Sorry your member type (Non-NUS member) is not supported to answer questions here. <br /> Please register with your NUS account to answer.
                                                        </div>
                                                    </form>
                                                }

                                                {!localStorage.usertoken &&
                                                    <form>
                                                        <div className="form-row align-items-left mb-3 ml-3">
                                                            <textarea
                                                                disabled
                                                                rows="5"
                                                                className="form-control col-sm-9"
                                                                placeholder="What are your thoughts? "
                                                                value={this.state.answer}
                                                                onChange={this.onAnswerChange}
                                                                required />
                                                            <small className="form-text text-muted col-sm-11">
                                                                Inappropriate or irrelevant answers will be filtered accordingly.
                                                                </small>
                                                        </div>
                                                        <div className="alert alert-danger" role="alert">
                                                            <span className="fa fa-exclamation-triangle mr-2" />
                                                        Please <NavLink className="underline-link alert-danger" to="/signinform">sign in</NavLink> to answer this question
                                                    </div>
                                                    </form>
                                                }
                                            </li>
                                        }

                                        {localStorage.usertoken && (this.state.member_type == 1 || this.state.user == this.state.user_post) &&
                                            <div>
                                                {this.state.feeds.type_post == "1" &&
                                                    <button className="btn btn-outline-secondary mb-2" style={{ width: 100 }} type="button" data-toggle="modal" data-target="#editQuestionModal" onClick={() => this.setQuestion(`${this.state.feeds.question}`)}><i className="fa fa-pencil mr-2" />Edit</button>
                                                }
                                                {this.state.feeds.type_post == "2" &&
                                                    <button className="btn btn-outline-secondary mb-2" style={{ width: 100 }} type="button" data-toggle="modal" data-target="#editPostModal" onClick={() => this.setPost(`${this.state.feeds.post_content}`)}><i className="fa fa-pencil mr-2" />Edit</button>
                                                }
                                                <button className="btn btn-outline-danger mb-2 ml-2" style={{ width: 100 }} type="button" data-toggle="modal" data-target="#deleteModal"><i className="fa fa-trash mr-2" />Delete</button>
                                            </div>
                                        }
                                    </ul>
                                </div>
                            </div>

                            {this.state.feeds.type_post != "2" &&
                                <div>
                                    <h2 className="pt-5 pb-2"> <b>Answers: </b></h2>
                                    < Linkify >
                                        {this.state.answers && this.state.answers.map((answers) =>
                                            <div>
                                                <div className="card mb-3 card-thread">
                                                    <div className="card-body mr-4 pb-0">
                                                        <ul>
                                                            <li>
                                                                {answers.anonymous2 == "1" &&
                                                                    <div className="sub-text">
                                                                        Posted by {answers.answerer}
                                                                        <div className="pl-0">
                                                                            Answered on {answers.time2}
                                                                        </div>
                                                                    </div>
                                                                }
                                                                {answers.anonymous2 == "0" &&
                                                                    <div className="sub-text">
                                                                        Posted by an anonymous user
                                                                        <div className="pl-0">
                                                                            Answered on {answers.time2}
                                                                        </div>
                                                                    </div>
                                                                }
                                                            </li>
                                                            <li className="row ml-0">
                                                                <p className="whiteSpace">{answers.answer}</p>
                                                            </li>
                                                            <li className="row mb-3 mt-3 ml-0 mr-0">
                                                                <Image cloudName="askookie" className="img-feeds" publicId={answers.publicID} crop="scale" />
                                                            </li>
                                                            {localStorage.usertoken &&
                                                                <li className="feeds-footer">
                                                                    {answers.hasLikedAns == "1" &&
                                                                        <button className="btn btn-icon like pr-1 pl-2 red" title="Like"><i className="fa fa-thumbs-o-up pr-1" onClick={() => this.handleLikeAns(answers.hasLikedAns, answers.answerID)} />{answers.like_count2}</button>
                                                                    }
                                                                    {!answers.hasLikedAns &&
                                                                        <button className="btn btn-icon like pr-1 pl-2" title="Like"><i className="fa fa-thumbs-o-up pr-1" onClick={() => this.handleLikeAns(answers.hasLikedAns, answers.answerID)} />{answers.like_count2}</button>
                                                                    }
                                                                    <button className="btn btn-icon pl-3 pr-1 comment" title="View comments" type="button" data-toggle="modal" data-target="#commentsModal" onClick={() => this.getCommentsAns(`${answers.answerID}`)}><i className="fa fa-comment-o pr-1" />{answers.comment_count2}</button>
                                                                    {/* <button className="btn btn-icon float-right report" title="Report" type="button" data-toggle="modal" data-target="#reportModal"><i className="fa fa-exclamation-circle" /></button> */}
                                                                    {/* <button className="btn btn-icon dislike float-right" title="Dislike"><i className="fa fa-thumbs-o-down" /> 0</button> */}
                                                                </li>
                                                            }
                                                            {!localStorage.usertoken &&
                                                                <li className="feeds-footer">
                                                                    <button className="btn btn-icon like pr-1 pl-0 disabled" title="Likes"><i className="fa fa-thumbs-o-up pr-1" /> {answers.like_count2}</button>
                                                                    <button className="btn btn-icon pl-3 pr-1 comment" title="Comments" type="button" data-toggle="modal" data-target="#commentsModal" onClick={() => this.getCommentsAns(`${answers.answerID}`)}><i className="fa fa-comment-o pr-1" />{answers.comment_count2}</button>
                                                                    {/* <button className="btn btn-icon dislike float-right disabled" title="Dislikes"><i className="fa fa-thumbs-o-down" /> 0</button> */}
                                                                </li>
                                                            }
                                                            {localStorage.usertoken && (this.state.member_type == 1 || this.state.user == `${answers.answerer}`) &&
                                                                <li>
                                                                    <button className="btn btn-icon float-right" type="button" data-toggle="modal" title="Delete Answer" data-target="#deleteAnswerModal" onClick={() => this.setAnswerID(`${answers.answerID}`)}><i className="fa fa-trash like" /></button>
                                                                    <button className="btn btn-icon float-right" title="Edit Answer" data-toggle="modal" data-target="#editAnswerModal" onClick={() => this.setAnswerAndID(`${answers.answerID}`, `${answers.answer}`)}><i className="fa fa-pencil comment" /></button>
                                                                </li>
                                                            }
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {!this.state.answers || this.state.answers.length == "0" &&
                                            <div className="card mb-3">
                                                <div className="card-body mr-4">
                                                    <ul>
                                                        <li>
                                                            <div className="muted-text mt-3">
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
                    </div>
                    {/* unanswered Questions */}
                    <div className="col-sm-2">
                        <div className="card d-none d-xl-block text-left" style={{ width: '13rem' }}>
                            <div className="card-header">
                                Unanswered Questions
                            </div>
                            <ul className="list-group list-group-flush">
                                {this.state.unanswered && this.state.unanswered.slice(0, 6).map((feeds, index) => (
                                    <a className="btn-category" href={`/thread/${feeds.postID}`}><li className="list-group-item unanswered"><p className="mr-4 mb-0">{feeds.question}</p> <i className="fa fa-fw fa-pencil bottom-right icon"></i></li></a>
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
                    {/* end of unanswered Questions */}

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
                                                <p className="font-italic pb-1 mb-0 pl-2">Commenting as {this.state.username}</p>
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
                                            {localStorage.usertoken && (this.state.member_type == 1 || this.state.username == `${comment.username}`) &&
                                                <ul className="feeds-footer mb-5 mt-0">
                                                    {/* <button className="btn btn-icon like pr-1 pl-2" title="Like"><i className="fa fa-thumbs-o-up pr-1" /> {comments.like_count}</button> */}
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
                    {/* end of modal comments ans */}

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
                                                <p className="font-italic pb-1 mb-0 pl-2">Commenting as {this.state.username}</p>
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
                                                <div className="col-xl-12 col-md-12 col-sm-12 col-xs-12 ml-2">
                                                    <p className="font-weight-bold pb-0 mb-0">{comment.username}</p>
                                                    <p className="sub-text pt-0 mt-0">Commented on {comment.time}</p>
                                                </div>
                                                <p className="mr-3 ml-4 whiteSpace">{comment.comment}</p>
                                            </div>
                                            {localStorage.usertoken && (this.state.member_type == 1 || this.state.username == `${comment.username}`) &&
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
                    {/* end of modal comments posts */}

                    {/* delete post/question modal */}
                    <div id="deleteModal" className="modal fade" role="dialog">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h4>Delete Post/Question</h4>
                                    <button type="button" className="close pr-4" data-dismiss="modal">&times;</button>
                                </div >
                                <div className="modal-body text-left pt-3 pb-3">
                                    Are you sure you want to delete your post/question?
                                    <div className="row content ml-1 mr-1 pt-5 d-flex justify-content-center">
                                        <button className="btn btn-default col-sm-5 btn-outline-danger mr-2" onClick={this.handleDelete}>Delete</button>
                                        <button type="button" className="btn btn-default col-sm-5 btn-outline-secondary" data-dismiss="modal">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* end of delete post/question modal */}


                    {/* start of edit answer modal */}
                    <div id="editAnswerModal" className="modal fade" role="dialog">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h4>Edit My Answer</h4>
                                    <button type="button" className="close pr-4" data-dismiss="modal">&times;</button>
                                </div >
                                <form onSubmit={this.handleEditAnswer}>
                                    <ul className="row content">
                                        <li className="col-sm-9 mt-3">
                                            <TextareaAutosize
                                                className="col-sm-10 comment-input p-2 pl-4 pr-4"
                                                className="form-control"
                                                value={this.state.answerEdit}
                                                onChange={this.onAnswerEditChange}
                                                required
                                            />
                                        </li>
                                        <li className="col-sm-2 mt-3">
                                            <button type="submit" className="btn btn-orange">Edit Answer</button>
                                        </li>
                                    </ul>
                                </form>
                            </div>
                        </div>
                    </div>
                    {/* end of edit answer modal */}

                    {/* start of edit question modal */}
                    <div id="editQuestionModal" className="modal fade" role="dialog">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h4>Edit My Question</h4>
                                    <button type="button" className="close pr-4" data-dismiss="modal">&times;</button>
                                </div >
                                <form onSubmit={this.handleEditQuestion}>
                                    <ul className="row content">
                                        <li className="col-sm-9 mt-3">
                                            <TextareaAutosize
                                                className="col-sm-10 comment-input p-2 pl-4 pr-4"
                                                className="form-control"
                                                value={this.state.questionEdit}
                                                onChange={this.onQuestionEditChange}
                                                required
                                            />
                                        </li>
                                        <li className="col-sm-2 mt-3">
                                            <button type="submit" className="btn btn-orange">Edit Question</button>
                                        </li>
                                    </ul>
                                </form>
                            </div>
                        </div>
                    </div>
                    {/* end of edit question modal */}

                    {/* start of edit post modal */}
                    <div id="editPostModal" className="modal fade" role="dialog">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h4>Edit My Post</h4>
                                    <button type="button" className="close pr-4" data-dismiss="modal">&times;</button>
                                </div >
                                <form onSubmit={this.handleEditPost}>
                                    <ul className="row content">
                                        <li className="col-sm-9 mt-3">
                                            <TextareaAutosize
                                                className="col-sm-10 comment-input p-2 pl-4 pr-4"
                                                className="form-control"
                                                value={this.state.postEdit}
                                                onChange={this.onPostEditChange}
                                                required
                                            />
                                        </li>
                                        <li className="col-sm-2 mt-3">
                                            <button type="submit" className="btn btn-orange">Edit Post</button>
                                        </li>
                                    </ul>
                                </form>
                            </div>
                        </div>
                    </div>
                    {/* end of edit post modal */}

                    {/* start of delete answer modal */}
                    <div id="deleteAnswerModal" className="modal fade" role="dialog">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h4>Delete Answer</h4>
                                    <button type="button" className="close pr-4" data-dismiss="modal">&times;</button>
                                </div >
                                <div className="modal-body text-left pt-3 pb-3">
                                    Are you sure you want to delete your answer?
                                    <div className="row content ml-1 mr-1 pt-5 d-flex justify-content-center">
                                        <button className="btn btn-default col-sm-5 btn-outline-danger mr-2" onClick={this.handleDeleteAnswer}>Delete</button>
                                        <button type="button" className="btn btn-default col-sm-5 btn-outline-secondary" data-dismiss="modal">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

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
                </div>
            </div >
        )
    }
}
