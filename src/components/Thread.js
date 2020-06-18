import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../logo.png'
import { Navigation } from './Navigation'

export class Thread extends Component {

    render() {
        return (
            <div className="container-fluid margin-top">
                <Navigation />
                <div class="row content">
                    <div class="col-sm-9 text-left">
                        <div class="card mb-3 border border-secondary">
                            <div class="card-body">
                                <ul class="list-group">
                                    <li>
                                        <div class="sub-text">
                                            <h8>@1728 </h8>
                                    &middot; Posted on 17/01/2020
                                </div>
                                    </li>
                                    <li>
                                        <p class="font-weight-bold lead" to="">What residence should I pick?</p>
                                    </li>
                                    <li>
                                        <hr class="mt-0 mb-4" />
                                    </li>
                                    <li>
                                        <div class="form-row align-items-left mb-3 ml-3">
                                            <textarea type="text" rows="5" class="form-control col-sm-9" id="inputAnswer" aria-describedby="answerHere" placeholder="What are your thoughts? " />
                                            <small id="passwordHelpBlock" class="form-text text-muted col-sm-11">
                                                Inappropriate or irrelevant answers will be filtered accordingly.
                                    </small>
                                        </div>
                                        <div class="form-check row pull-left ml-3">
                                            <input class="form-check-input" type="checkbox" value="" id="anonymousCheck" />
                                            <label class="form-check-label" for="anonymousCheck">
                                                Appear Anonymous to others
                                        </label>
                                        </div>
                                        <button type="submit" class="btn btn-outline-success my-2 my-sm-0 ml-2 bottom-right" >Comment</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <h2> <b>Answers: </b></h2>
                        <div class="card mb-3">
                            <div class="card-body mr-4">
                                <ul>
                                    <li>
                                        <div class="sub-text">
                                            Posted by
                                        <NavLink class="sub-link" to=""><h8> Michela Vieri </h8></NavLink>
                                        &middot; Answered on 17/01/2020
                                </div>
                                    </li>
                                    <li>
                                        <div class="show-more" data-type="text" data-number="80">
                                            <br />
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pretium leo in ex
                                            vehicula sagittis.  Tortor hendrerit elit porta auctor. Maecenas fringilla eleifend ante,
                                            sed hendrerit massa rutrum vel. Orci varius natoque penatibus et magnis dis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pretium leo in ex
                                            vehicula sagittis.  Tortor hendrerit elit porta auctor. Maecenas fringilla eleifend ante,
                                        <br /><br />
                                                <img src={logo} class="img-responsive" width="100%"></img>
                                        sed hendrerit massa rutrum vel. Orci varius natoque penatibus et magnis dis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pretium leo in ex
                                        vehicula sagittis.  Tortor hendrerit elit porta auctor. Maecenas fringilla eleifend ante,
                                        sed hendrerit massa rutrum vel. Orci varius natoque penatibus et magnis dis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pretium leo in ex
                                        vehicula sagittis.  Tortor hendrerit elit porta auctor. Maecenas fringilla eleifend ante,
                                        sed hendrerit massa rutrum vel. Orci varius natoque penatibus et magnis disLorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pretium leo in ex
                                        vehicula sagittis.  Tortor hendrerit elit porta auctor. Maecenas fringilla eleifend ante,
                                        sed hendrerit massa rutrum vel. Orci varius natoque penatibus et magnis dis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pretium leo in ex
                                        vehicula sagittis.  Tortor hendrerit elit porta auctor. Maecenas fringilla eleifend ante,
                                        <br /><br />
                                        sed hendrerit massa rutrum vel. Orci varius natoque penatibus et magnis dis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pretium leo in ex
                                        vehicula sagittis.  Tortor hendrerit elit porta auctor. Maecenas fringilla eleifend ante,
                                        sed hendrerit massa rutrum vel. Orci varius natoque penatibus et magnis dis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pretium leo in ex
                                        vehicula sagittis.  Tortor hendrerit elit porta auctor. Maecenas fringilla eleifend ante,
                                        sed hendrerit massa rutrum vel. Orci varius natoque penatibus et magnis dis</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="card mb-3">
                            <div class="card-body mr-4">
                                <ul>
                                    <li>
                                        <div class="sub-text">
                                            Posted by
                                        <NavLink class="sub-link" to=""><h8> Anoymous </h8></NavLink>
                                        &middot; Answered on 19/01/2020
                                </div>
                                    </li>
                                    <li>
                                        <div class="show-more" data-type="text" data-number="80">
                                            <br />
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pretium leo in ex
                                            vehicula sagittis.  Tortor hendrerit elit porta auctor. Maecenas fringilla eleifend ante,
                                            sed hendrerit massa rutrum vel. Orci varius natoque penatibus et magnis dis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pretium leo in ex
                                            vehicula sagittis.  Tortor hendrerit elit porta auctor. Maecenas fringilla eleifend ante,
                                        <br /><br />
                                        nis dis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pretium leo in ex
                                        vehicula sagittis.  Tortor hendrerit elit porta auctor. Maecenas fringilla eleifend ante,
                                        sed hendrerit massa rutrum vel. Orci varius natoque penatibus et magnis dis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pretium leo in ex
                                        vehicula sagittis.  Tortor hendrerit elit porta auctor. Maecenas fringilla eleifend ante,
                                        sed hendrerit massa rutrum vel. Orci varius natoque penatibus et magnis disLorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pretium leo in ex
                                        vehicula sagittis.  Tortor hendrerit elit porta auctor. Maecenas fringilla eleifend antes</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-2">
                        <div class="card d-none d-xl-block text-left" style={{ width: '18rem' }}>
                            <div class="card-header">
                                Unanswered Questions
                            </div>
                            <ul class="list-group list-group-flush">
                                <NavLink class="btn-category" to="/thread"><li class="list-group-item unanswered"><p class="mr-4 mb-0">What is the difference
                                    between exchange and NOC?</p> <i class="fa fa-fw fa-pencil bottom-right icon"></i></li></NavLink>
                                <NavLink class="btn-category" to="/thread"><li class="list-group-item unanswered"><p class="mr-4 mb-0">How is CS1231
                                    different from CS1231S?</p><i class="fa fa-fw fa-pencil bottom-right icon"></i></li></NavLink>
                                <NavLink class="btn-category" to="/thread"><li class="list-group-item unanswered"><p class="mr-4 mb-0">What are your experiences on internships?</p><i class="fa fa-fw fa-pencil bottom-right icon"></i></li></NavLink>
                                <NavLink class="btn-category" to="/thread"><li class="list-group-item unanswered"><p class="mr-4 mb-0">What is the difference between each residential colleges?</p><i class="fa fa-fw fa-pencil bottom-right icon"></i></li></NavLink>
                                <NavLink class="btn-category" to="/thread"><li class="list-group-item unanswered"><p class="mr-4 mb-0">Why should I choose Residential College 4?</p><i class="fa fa-fw fa-pencil bottom-right icon"></i></li></NavLink>
                            </ul>
                            <div class="card-footer overflow-auto">
                                <button class="btn refresh-button pull-right"><i class="fa fa-fw fa-refresh mx-lg-1 fa-lg"></i>Refresh</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}