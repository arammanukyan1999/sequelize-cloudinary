import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import '../styles/signup.css'
import axios from "axios";



class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signUpError: "",
            isLoading: false,
        }
    }

    onTextboxChangeSignUpEmail = (e) => {
        this.setState({
            signUpEmail: e.target.value,
        });
    };
    onTextboxChangeSignUpPassword = (e) => {
        this.setState({
            signUpPassword: e.target.value,
        });
    };
    onTextboxChangeSignUpUsername = (e) => {
        this.setState({
            signUpUsername: e.target.value,
        });
    };


    

    onSignUp = () => {

        const {
            signUpEmail,
            signUpUsername,
            signUpPassword,

        } = this.state;
        axios
            .post(
                "/api/users/signup",
                {
                    username: signUpUsername,
                    email: signUpEmail,
                    password: signUpPassword,
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            )
            .then((json) => {
                if (json.data.success) {
                    this.setState({
                        signUpError: json.data.message,
                        isLoading: true,
                    });
                } else {
                    this.setState({
                        signUpError: json.data.message,
                        isLoading: false,
                    });
                }
            })


    };


    render() {
        return (
            <div className="signup">
                <h1>Sign Up</h1>
                <Form>
                    <FormGroup>
                        <Label for="exampleEmail" hidden>Username</Label>
                        <Input onChange={this.onTextboxChangeSignUpUsername} type="text" name="username" placeholder="Username" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="exampleEmail" hidden>Email</Label>
                        <Input onChange={this.onTextboxChangeSignUpEmail} type="email" name="email" id="exampleEmail" placeholder="Email" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="examplePassword" hidden>Password</Label>
                        <Input onChange={this.onTextboxChangeSignUpPassword} type="password" name="password" id="examplePassword" placeholder="Password" />
                    </FormGroup>
                    <p className='signup_err'> {this.state.signUpError}</p>
                    <Button className="signup_button" onClick={this.onSignUp}>Sign Up</Button>
                </Form>
            </div>

        );
    }
}

export default SignUp;