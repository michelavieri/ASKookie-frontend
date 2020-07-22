import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import axios from 'axios';
import { trackPromise } from 'react-promise-tracker';
import NavigationRouter2 from './Navigation'
import Linkify from 'react-linkify';

export class Search extends Component {
    constructor() {
        super();
        this.state = {
            filteredData: [],
        };
    }

    componentDidMount() {
        trackPromise(
            fetch('http://localhost:5000/search/' + `${this.props.match.params.query}`)
                .then(res => res.json())
                .then(res => {
                    const filtered_Data = res.data;
                    console.log("filteredData", res.data)

                    this.setState({
                        filteredData: filtered_Data,
                    });

                }));

    };

    render() {
        return (
            <div className="container-fluid">
                <NavigationRouter2 />
                <div class="card mb-3 mt-5">
                    <div class="card-header orange-color">
                        <b>Search Results on: <i>{this.props.match.params.query}</i></b>
                    </div>
                </div>
                {this.state.filteredData && this.state.filteredData.map(feeds => (
                    <div class="card mb-3">
                        <div class="card-body pb-1">
                            <ul class="list-group">
                                <li>
                                    {feeds.type_post == "1" &&
                                        <div class="sub-text">
                                            <Link class="sub-link" to={`/thread/${feeds.postID}`}><h8> @{feeds.postID} </h8></Link>
                                    &middot; Posted on {`${feeds.time}`}
                                        </div>
                                    }
                                    {feeds.type_post == "2" &&
                                        <div class="sub-text">
                                            <Link class="sub-link" to={`/thread/${feeds.postID}`}><h8> @{feeds.postID} </h8></Link>
                                    &middot; Posted by {feeds.asker} on {`${feeds.time}`}
                                        </div>
                                    }
                                </li>
                                <li>
                                    <Link class="btn-category unanswered font-weight-bold lead" to={`/thread/${feeds.postID}`}>{feeds.question}{feeds.title}</Link>
                                </li>
                                <li>
                                    <Linkify componentDecorator={this.componentDecorator}>
                                        <div class="show-more" data-type="text" data-number="80">
                                            <p class="whiteSpace">{feeds.post_content}{feeds.answer}</p>
                                        </div>
                                    </Linkify>
                                </li>
                            </ul>
                        </div>
                    </div>
                ))}
                {this.state.filteredData.length == 0 &&
                    <div class="card mb-3">
                        <div class="p-3">
                            No Search Result for <b><i>{this.props.match.params.query}</i></b>
                        </div>
                    </div>
                }
            </div>
        )
    }
}