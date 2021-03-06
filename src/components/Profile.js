import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import NavigationRouter2 from './Navigation';
import profilePicture from '../default_pp.png';
import { trackPromise } from 'react-promise-tracker';
import Avatar from 'react-avatar-edit';
import { Image } from "cloudinary-react";

export class Profile extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            saved: [],
            followed: [],
            posted: [],
            preview: null,
            src: "",
            image: "",
            fileInput: "",
            previewSource: '',
            selectedFile: ''
        };

        //this.handleFileInputChange = this.handleFileInputChange.bind(this);
    }
    componentDidMount() {
        var token;
        var decoded;
        if (localStorage.usertoken) {
            token = localStorage.usertoken;
            decoded = jwt_decode(token);
            this.setState({ name: decoded.result.username });
        }

        trackPromise(
            fetch('https://whispering-hamlet-08619.herokuapp.com/follow/' + `${decoded.result.username}`)
                .then(res => res.json())
                .then(res => {
                    this.setState({ followed: res.data });
                }))
        trackPromise(
            fetch('https://whispering-hamlet-08619.herokuapp.com/save/' + `${decoded.result.username}`)
                .then(res => res.json())
                .then(res => {
                    this.setState({ saved: res.data });
                }))
        trackPromise(
            fetch('https://whispering-hamlet-08619.herokuapp.com/post/' + `${decoded.result.username}`)
                .then(res => res.json())
                .then(res => {
                    this.setState({ posted: res.data });
                }))
        trackPromise(
            fetch('https://whispering-hamlet-08619.herokuapp.com/profile/' + `${decoded.result.username}`)
                .then(res => res.json())
                .then(res => {
                    this.setState({ image: res.data[0].publicID });
                }))
        this.onCrop = this.onCrop.bind(this)
        this.onClose = this.onClose.bind(this)
    }

    // handleFileInputChange = e => {
    //     const file = e.target.files[0];
    //     this.previewFile(file);
    // }

    // previewFile = (file) => {
    //     const reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onloadend = () => {
    //         this.setState({ previewSource: reader.result })
    //     }
    // };

    handleSubmitPicture = async (e) => {
        var token;
        var decoded;
        if (localStorage.usertoken) {
            token = localStorage.usertoken;
            decoded = jwt_decode(token);
            this.setState({ name: decoded.result.username });
        }

        e.preventDefault();
        trackPromise(
            fetch('https://whispering-hamlet-08619.herokuapp.com/upload/profile/' + `${decoded.result.username}`, {
                method: 'POST',
                body: JSON.stringify({ data: this.state.preview }),
                headers: { 'Content-type': 'application/json' },
            }).catch(error => {
                console.error(error)
            }));
        setTimeout(() => {
            window.location.reload(false)
        }, 1500
        )
    };


    refreshPage() {
        window.location.reload(false);
    };

    componentDecorator = (href, text, key) => (
        <a href={href} key={key} target="_blank" rel="noopener noreferrer">
            {text}
        </a>
    );

    logOut(e) {
        e.preventDefault();
        localStorage.removeItem('usertoken');
        this.props.history.push(``);
        window.location.reload(false);
    }

    onClose() {
        this.setState({ preview: null })
    }

    onCrop(preview) {
        this.setState({ preview })
    }

    render() {
        return (
            <div className="container-fluid">
                <NavigationRouter2 />
                <div className="row content">
                    <div className="col-sm-3 profile-img">
                        {this.state.image == null &&
                            <img src={profilePicture} alt="" width="200" className="rounded-circle profile-picture" />
                        }
                        {this.state.image != null &&
                            <Image cloudName="askookie" className="img-feeds rounded-circle profile-picture" publicId={this.state.image} width="250" crop="scale" />
                        }
                    </div>
                    <div className="col-sm-6 profile-content">
                        {localStorage.usertoken &&
                            <ul className="list-group">
                                <li>
                                    <h2 className="name">{this.state.name}</h2>
                                </li>
                                <li>
                                    <button className="btn btn-logout">
                                        <NavLink className="link-logout stretched-link" to={``} onClick={this.logOut.bind(this)}>Logout</NavLink>
                                    </button>
                                </li>
                                <li>
                                    {/*<label for="files" className="btn">Change Profile Picture</label>
                                    <input id="files" type="file" name="image" onChange={this.handleFileInputChange} value={this.state.fileInput}
                        className="form-input ml-3 mb-3" />*/}
                                    <button className="file btn btn-lg btn-outline-secondary mt-3" type="button" data-toggle="modal" data-target="#ppModal" >
                                        Change Photo
                        </button>
                                    <div className="form-row align-items-left row">
                                        {/*{this.state.previewSource && (
                                            <img src={this.state.previewSource} alt="chosen"
                                            style={{ width: '600px' }} className="ml-3 mb-3 mt-3" />
                                        )}
                                        {this.state.previewSource && (
                                           <button type="submit" className="btn btn-outline-success my-2 my-sm-0 ml-2 bottom-right">
                                           Submit
                                            </button>
                                        )}*/}
                                    </div>
                                </li>
                                <li className="mt-3">
                                    <NavLink className="btn-back-home" to="/"><i className="fa fa-fw fa-angle-left fa-lg" />Back to Home</NavLink>
                                </li>
                            </ul>}
                        {!localStorage.usertoken &&
                            <div className="alert alert-danger mt-5 ml-2 mr-2" role="alert">
                                <span className="fa fa-exclamation-triangle mr-2" />
                                Please sign in or register first
                            </div>
                        }
                    </div>
                </div>
                <div className="mt-4">
                    <ul className="nav nav-tabs tab-profile-link pinkBg pl-5 pr-5 pt-3 pb-0" id="myTab" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link tab-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">My Saved Threads</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link tab-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">My Followed Threads</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link tab-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">My Posts/Questions</a>
                        </li>
                    </ul>
                    <div className="tab-content mb-5 ml-3 mt-3 pr-5 pl-5" id="myTabContent">
                        <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                            {this.state.saved && this.state.saved.map((saved) => (
                                <NavLink className="btn-category" to={`/thread/${saved.postID}`}><li className="list-group-item unanswered"><p className="mr-4 mb-0">{saved.title}{saved.question}</p> </li></NavLink>
                            ))}
                            {!this.state.saved || this.state.saved.length == 0 &&
                                <div className="muted-text mt-3 pl-4 pb-3">
                                    No saved threads yet!
                                    </div>
                            }
                        </div>
                        <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                            {this.state.followed && this.state.followed.map((followed) => (
                                <NavLink className="btn-category" to={`/thread/${followed.postID}`}><li className="list-group-item unanswered"><p className="mr-4 mb-0">{followed.title}{followed.question}</p> </li></NavLink>
                            ))}
                            {!this.state.followed || this.state.followed.length == 0 &&
                                <div className="muted-text mt-3 pl-4 pb-3">
                                    No followed threads yet!
                                    </div>
                            }
                        </div>
                        <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                            {this.state.posted && this.state.posted.map((posted) => (
                                <NavLink className="btn-category" to={`/thread/${posted.postID}`}><li className="list-group-item unanswered"><p className="mr-4 mb-0">{posted.title}{posted.question}</p> </li></NavLink>
                            ))}
                            {!this.state.posted || this.state.posted.length == 0 &&
                                <div className="muted-text mt-3 pl-4 pb-3">
                                    You never posted or asked a question before!
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div id="ppModal" className="modal fade" role="dialog">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header blueBg">
                                <h4 className="modal-title text-white">Change Profile Picture</h4>
                                <button type="button" className="close pr-4" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body text-left pt-0">
                                <form className="post pb-4" onSubmit={this.handleSubmitPicture}>
                                    <div className="col-sm-6 mt-3 mb-3">
                                        <Avatar
                                            width={390}
                                            height={295}
                                            onCrop={this.onCrop}
                                            onClose={this.onClose}
                                            src={this.state.src}
                                        />

                                        <img src={this.state.preview} alt="Preview" className="mt-3" />
                                    </div>
                                    <div className="col-sm-6">
                                        <button className="btn btn-outline-success" >Change Profile Picture</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}