import React, { Component, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import LogOutButton from "./LogOut"
import axios from 'axios'
import UploadImages from './uploadimages'
// import logo from '../../public/photos/icon.jpg'

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: "",
      signInPassword: "",
      signInError: "",
      isLoading: false,
      token: "",
      userdata: [],
      username: '',
      useremail: '',
      showdata: false,
      isAdmin: '',
      link: []
    }


  }
  componentDidMount() {
    const token = localStorage.getItem("the_main_app");
    if (token) {
      axios
        .get("/api/users/verify?token=" + token, {
          headers: { "Content-Type": "application/json" },
        })
        .then((json) => {
          if (json.data.success) {
            this.setState({
              token,
              isLoading: false,
              useremail: json.data.authData.user.email
            });
            axios
              .get(`/api/users/upload/${this.state.useremail}`, {
                headers: { "Content-Type": "application/json" },
              })
              .then((json) => this.setState({
                username: json.data.username
              }))
            axios.get("/api/users/upload/1/10", {
              headers: { "Content-Type": "application/json" },
            }).then((json) => {
              if (json) {
                this.setState({
                  userdata: json.data.rows
                })

              }
            })
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    }
  }


  postdata = async () => {
    this.setState({
      showdata: !this.state.showdata
    })
   await axios
      .get("/api/users/images", {
        headers: { "Content-Type": "application/json" }
      }).then((json) => {
        console.log(json.data);
        this.setState({
          link: json.data.link
        })
      })
  }







  logOut = () => {
    const token = localStorage.getItem("the_main_app");

    if (token) {
      axios
        .get("/api/user/logout?token=" + token, {
          headers: { "Content-Type": "application/json" },
        })
        .then((json) => {
          if (json.data.success) {
            this.setState({
              token: "",
              isLoading: false,
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  };


  onTextboxChangeSignInEmail = (e) => {
    this.setState({
      signInEmail: e.target.value,
    });
  };
  onTextboxChangeSignInPassword = (e) => {
    this.setState({
      signInPassword: e.target.value,
    });
  };

  onSignIn = () => {
    const { token, signInEmail, signInPassword } = this.state;

    axios
      .post(
        "/api/users/signin",
        {
          email: signInEmail,
          password: signInPassword,
          token: token,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((json) => {
        if (json.data.success) {
          localStorage.setItem("the_main_app", json.data.token)
          this.setState({
            isAdmin: json.data.isAdmin,
            signInError: json.data.message,
            isLoading: true,
            token: json.data.token,
            username: json.data.username

          });
        } else {
          this.setState({
            signInError: json.data.message,
            isLoading: false,
          });
        }
      });


  };

  render() {
    if (!this.state.token) {
      return (
        <div className="signup">
          <h1>Sign In</h1>
          <Form>
            <FormGroup>
              <Label for="exampleEmail" hidden>Email</Label>
              <Input onChange={this.onTextboxChangeSignInEmail} type="email" name="email" id="exampleEmail" placeholder="Email" />
            </FormGroup>
            <FormGroup>
              <Label for="examplePassword" hidden>Password</Label>
              <Input onChange={this.onTextboxChangeSignInPassword} type="password" name="password" id="examplePassword" placeholder="Password" />
            </FormGroup>
            {this.state.isLoading ? null : <p className='signup_err'> {this.state.signInError}</p>}
            <Button className="signup_button" onClick={this.onSignIn}>Sign In</Button>
          </Form>
        </div>
      )
    }
    if (!this.state.isAdmin) {
      return (

        <div>
          <h1> Welcome {this.state.username}</h1>
          <LogOutButton />
          <button onClick={this.postdata}>Post</button>

          { this.state.showdata ? this.state.link.map((data, i) => <img key={i} width={150} height={150} src={`${this.state.link[i]}`} />) : null}


          <UploadImages></UploadImages>




        </div>


      );
    }
    return (<div>Admin</div>)
  }

}

export default SignIn;