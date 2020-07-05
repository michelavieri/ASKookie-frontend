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
            checkedCategories: ['faculties', 'accommodation', 'student_life', 'job_intern', 'exchange_noc', 'others'],
            isChecked: true,
        };
    }
    componentDidMount() {
        trackPromise(
            fetch('https://whispering-hamlet-08619.herokuapp.com/home')
                .then(res => res.json())
                .then(res => this.setState({
                    feeds: res.data,
                    filteredQuestions: res.data,
                }, () => console.log('Data fetched', res)))
        )
    }
    scrollToTop = () => {
        scroll.scrollToTop();
    };

    onCategoryChange = e => {
        const category = e.target.value;
        var isChecked = e.target.checked;
        var first = true;

        this.setState(prevState => {

            console.log(first);
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
                    if (element.category.includes(checkedCategories[i])) {
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
                <button class="bottom-right-fixed btn bg-yellow btn-lg refresh-button rounded-edge" onClick={() => this.scrollToTop()} id="myBtn" title="Scroll to top"><i class="fa fa-chevron-up"></i></button>
                <div class="row content">
                    <div class="col-sm-3 mr-4">
                        <div class="position-fixed">
                            <div class="card d-none d-xl-block text-left mt-3" style={{ width: '15rem' }}>
                                <form>
                                    <div class="card-header bg-dark">
                                        FILTER
                                </div>
                                    <div class="card-body">
                                        <ul class="list-group list-group-flush large-space">
                                            <div class="form-check row pull-left ml-0">
                                                <div>
                                                    <input type="checkbox" value="faculties" id="faculties" defaultChecked={this.state.isChecked} onChange={this.onCategoryChange} />
                                                    <label class="ml-3 font-weight-bold" for="faculties">
                                                        Faculties
                                                    </label>
                                                </div>
                                                <div>
                                                    <input type="checkbox" value="accommodation" defaultChecked={this.state.isChecked} onChange={this.onCategoryChange} id="accommodation" />
                                                    <label class="ml-3 font-weight-bold" for="accommodation">
                                                        Accommodation
                                                     </label>
                                                </div>
                                                <div>
                                                    <input type="checkbox" value="student_life" defaultChecked={this.state.isChecked} onChange={this.onCategoryChange} id="student_life" />
                                                    <label class="ml-3 font-weight-bold" for="student_life">
                                                        Student Life
                                                    </label>
                                                </div>
                                                <div>
                                                    <input type="checkbox" value="job_intern" defaultChecked={this.state.isChecked} onChange={this.onCategoryChange} id="job_intern" />
                                                    <label class="ml-3 font-weight-bold" for="job_intern">
                                                        Job/Internship
                                                    </label>
                                                </div>
                                                <div>
                                                    <input type="checkbox" value="exchange_noc" defaultChecked={this.state.isChecked} onChange={this.onCategoryChange} id="exchange_noc" />
                                                    <label class="ml-3 font-weight-bold" for="exchange_noc">
                                                        Exchange/NOC
                                                    </label>
                                                </div>
                                                <div>
                                                    <input type="checkbox" value="others" defaultChecked={this.state.isChecked} onChange={this.onCategoryChange} id="others" />
                                                    <label class="ml-3 font-weight-bold" for="others">
                                                        Others
                                                    </label>
                                                </div>
                                            </div>
                                        </ul>
                                    </div>
                                </form>
                                <div class="card-footer">
                                    <NavLink class="text-dark small" to="/about_us">About us</NavLink>
                                    <br />
                                    <a class="text-dark small" href="mailto:askookieforum@gmail.com">Email us</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-7 text-left mt-3">
                        {/* unanswered Questions */}
                        <div class="card mb-3">
                            <div class="card text-left" >
                                <div class="card-header">
                                    Questions for You
                                </div>
                                <ul class="list-group list-group-flush">
                                    {this.state.filteredQuestions.filter(feeds => feeds.answer == "").map((feeds, index) => (
                                        <NavLink class="btn-category" to={`/thread/${feeds.postID}`}><li class="list-group-item unanswered"><p class="mr-4 mb-0">{feeds.post}</p> <i class="fa fa-fw fa-pencil bottom-right icon"></i></li></NavLink>
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