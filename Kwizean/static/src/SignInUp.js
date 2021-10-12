import React, { Component } from "react";
import Login from "./Login";
import CreateAccount from "./CreateAccount";

/**
This is a secondary router which switches between login and sign up
using loginState. Originally I had other states here which were refactored out.
**/
export default class SignInUp extends Component{

  constructor(props){
    super(props);
    //loginState can either be "login" or "signup"
    this.state={
      loginState:"login",
    }
    this.switchLoginState = this.switchLoginState.bind(this);
  }

  switchLoginState(newLoginState){
    this.setState({
      loginState:newLoginState
    })
  }

  render(){
    switch(this.state.loginState){
      case "login":
        return <Login setAppState={this.props.setAppState} switchLoginState={this.switchLoginState}/>;
      case "signup":
        return <CreateAccount switchLoginState={this.switchLoginState}/>;
    }
  }
}
