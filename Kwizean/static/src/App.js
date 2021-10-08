import './App.css';
import SignInUp from "./SignInUp";
import RestaurantList from "./RestaurantList";
import RestaurantDetail from "./RestaurantDetail";
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
    }else if (this.state.pageState == "restaurant-list"){
      pageToRender = <RestaurantList userEmail={this.state.userEmail} userAdmin={this.state.userAdmin} setAppState={this.setAppState}/>
    }else if (this.state.pageState == "restaurant-detail"){
      pageToRender = <RestaurantDetail userEmail={this.state.userEmail} userAdmin={this.state.userAdmin} setAppState={this.setAppState}/>
    }
    return (
      <div className="App">
        {pageToRender}
      </div>
    );
  }
}
