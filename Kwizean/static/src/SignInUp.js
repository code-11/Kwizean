import React, { Component } from "react";
import Login from "./Login";
import AdminLogin from "./AdminLogin";
import CreateAccount from "./CreateAccount";
export default class SignInUp extends Component{

  constructor(props){
    super(props);
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
        return <Login switchLoginState={this.switchLoginState}/>;
      case "admin":
        return <AdminLogin switchLoginState={this.switchLoginState}/>;
      case "signup":
        return <CreateAccount switchLoginState={this.switchLoginState}/>;
    }
  }
}
