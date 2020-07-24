import React, { Component } from 'react';
import jwt_decode from 'jwt-decode';
import {Image} from "cloudinary-react";
//import console = require('console');

export class Image_Upload extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            fileInput: "",
            previewSource: '',
            selectedFile: '',
            successMsg: '',
            errMsg: ''
        };

        this.handleFileInputChange = this.handleFileInputChange.bind(this);
        this.handleSubmitFile = this.handleSubmitFile.bind(this);
    }

    handleFileInputChange = (e) => {
        const file = e.target.files[0];
        this.previewFile(file);
    }

    previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            this.setState({previewSource: reader.result})
        }
    }

    handleSubmitFile = (e) => {
        e.preventDefault();
        if(!this.state.previewSource) return;
        this.uploadImage(this.state.previewSource);
    }

    uploadImage = async (base64EncodedImage) => {
        const token = localStorage.usertoken;
        const decoded = jwt_decode(token);
        //this.setState({name: decoded.result.username});
        const name = decoded.result.username;
        try {
            await fetch('http://localhost:5000/upload/profile/' + name, {
                method: 'POST',
                body: JSON.stringify({data: base64EncodedImage}),
                headers: {'Content-type': 'application/json'},
            });
            this.setState({fileInput: ''});
            this.setState({previewSource: ''});
            this.setState({successMsg: 'Image uploaded!'});
        } catch (error) {
            console.error(error);
            this.setState({errMsg: 'Something went wrong!'});
        }
    }; 

    render() {
        return (
            <div>
                <h1>Upload</h1>
                <form onSubmit={this.handleSubmitFile}
                className="form">
                    <input type="file" name="image" onChange={this.handleFileInputChange} value={this.state.fileInput}
                    className="form-input"/>
                    <button className="btn" type="submit">
                        Submit
                    </button>
                </form>
                {this.state.previewSource && (
                    <img src={this.state.previewSource} alt="chosen"
                    style={{height: '300px'}}/>
                )}
            </div>
        )
    }
}