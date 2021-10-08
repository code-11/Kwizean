import './App.css';
import SignInUp from "./SignInUp";
import ResturantList from "./ResturantList";
import React, { Component } from "react";

export default class App extends Component {
  constructor(props){
    super(props);
    this.state={
      pageState:"prelogin",
      userEmail: null,
      userAdmin: false,
    }
    this.setAppState = this.setAppState.bind(this);
  }

  setAppState(newState){
    this.setState(newState);
  }

  render() {
    let pageToRender = null;
    if (this.state.pageState == "prelogin"){
      pageToRender = <SignInUp setAppState={this.setAppState} />
    }else{
      pageToRender = <ResturantList userEmail={this.state.userEmail} userAdmin={this.state.userAdmin}/>
    }
    return (
      <div className="App">
        {pageToRender}
      </div>
    );
  }
}
