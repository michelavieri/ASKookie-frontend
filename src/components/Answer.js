import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import NavigationRouter2 from './Navigation'
import { animateScroll as scroll } from "react-scroll";
import { trackPromise } from 'react-promise-tracker';

export class Answer extends Component {
    constructor() {
        super();
        this.state = {
            feeds: [],
            query: "",
            filteredQuestions: [],
            checkedCategories: ['1', '2', '3', '4', '5', '6'],
            isChecked: true,
        };
    }
    componentDidMount() {
        trackPromise(
            fetch('https://whispering-hamlet-08619.herokuapp.com/unanswered')
                .then(res => res.json())
                .then(res => {
                    this.setState({ 
                        feeds: res.data,
                        filteredQuestions: res.data,
                     });
                }))
    }
    scrollToTop = () => {
        scroll.scrollToTop();
    };

    onCategoryChange = e => {
        const category = e.target.value;
        var isChecked = e.target.checked;
        var first = true;

        this.setState(prevState => {
            
            var checkedCategories = prevState.checkedCategories;
            if (first) {
                if (isChecked) {
                    checkedCategories.push(category);
                } else {
                    checkedCategories.splice(checkedCategories.indexOf(category), 1);
                }
            }
            first = false;

            const filteredQuestions = prevState.feeds.filter(element => {
                var found = false;
                for (var i in checkedCategories) {
                    if (element.category == checkedCategories[i]) {
                        found = true;
                    }
                }
                return found;
            });

            return {
                filteredQuestions,
                checkedCategories
            };
        });


    };

    getData = () => {
        fetch('https://whispering-hamlet-08619.herokuapp.com/home')
            .then(response => response.json())
            .then(feeds => {
                const { category } = this.state;
                const filteredQuestions = feeds.filter(element => {
                    return element.category.toLowerCase().includes(category.toLowerCase());
                });

                this.setState({
                    feeds,
                    filteredQuestions
                });
            });
    };


    render() {
        return (
            <div className="mt-5 justify-content-left">
                <NavigationRouter2 />
                <button className="bottom-right-fixed btn bg-yellow btn-lg refresh-button rounded-edge" onClick={() => this.scrollToTop()} id="myBtn" title="Scroll to top"><i className="fa fa-chevron-up"></i></button>
                <div className="row content">
                    <div className="col-sm-3 mr-4">
                        <div className="position-fixed">
                            <div className="card d-none d-xl-block text-left mt-3" style={{ width: '15rem' }}>
                                <form>
                                    <div className="card-header bg-dark">
                                        FILTER
                                </div>
                                    <div className="card-body">
                                        <ul className="list-group list-group-flush large-space">
                                            <div className="form-check row pull-left ml-0">
                                                <div>
                                                    <input type="checkbox" value="1" id="faculties" defaultChecked={this.state.isChecked} onChange={this.onCategoryChange} />
                                                    <label className="ml-3 font-weight-bold" for="faculties">
                                                        Faculties
                                                    </label>
                                                </div>
                                                <div>
                                                    <input type="checkbox" value="2" defaultChecked={this.state.isChecked} onChange={this.onCategoryChange} id="accommodation" />
                                                    <label className="ml-3 font-weight-bold" for="accommodation">
                                                        Accommodation
                                                     </label>
                                                </div>
                                                <div>
                                                    <input type="checkbox" value="3" defaultChecked={this.state.isChecked} onChange={this.onCategoryChange} id="student_life" />
                                                    <label className="ml-3 font-weight-bold" for="student_life">
                                                        Student Life
                                                    </label>
                                                </div>
                                                <div>
                                                    <input type="checkbox" value="4" defaultChecked={this.state.isChecked} onChange={this.onCategoryChange} id="job_intern" />
                                                    <label className="ml-3 font-weight-bold" for="job_intern">
                                                        Job/Internship
                                                    </label>
                                                </div>
                                                <div>
                                                    <input type="checkbox" value="5" defaultChecked={this.state.isChecked} onChange={this.onCategoryChange} id="exchange_noc" />
                                                    <label className="ml-3 font-weight-bold" for="exchange_noc">
                                                        Exchange/NOC
                                                    </label>
                                                </div>
                                                <div>
                                                    <input type="checkbox" value="6" defaultChecked={this.state.isChecked} onChange={this.onCategoryChange} id="others" />
                                                    <label className="ml-3 font-weight-bold" for="others">
                                                        Others
                                                    </label>
                                                </div>
                                            </div>
                                        </ul>
                                    </div>
                                </form>
                                <div className="card-footer">
                                    <NavLink className="text-dark small" to="/about_us">About us</NavLink>
                                    <br />
                                    <a className="text-dark small" href="mailto:askookieforum@gmail.com">Email us</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-7 text-left mt-3">
                        {/* unanswered Questions */}
                        <div className="card mb-3">
                            <div className="card text-left" >
                                <div className="card-header">
                                    Questions for You
                                </div>
                                <ul className="list-group list-group-flush">
                                    {this.state.filteredQuestions.filter(feeds => feeds.post_content == "").map((feeds, index) => (
                                        <NavLink className="btn-category" to={`/thread/${feeds.postID}`}><li className="list-group-item unanswered"><p className="mr-4 mb-0">{feeds.question}</p> <i className="fa fa-fw fa-pencil bottom-right icon"></i></li></NavLink>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}