import './App.css';
import SignInUp from "./SignInUp";
import RestaurantList from "./RestaurantList";
import RestaurantDetail from "./RestaurantDetail";
import UserList from "./UserList"
import React, { Component } from "react";

/**
  This is the main entry point for the application and acts as a
  router to the rest of the "pages of the app."
**/
export default class App extends Component {
  constructor(props){
    super(props);
    //The allowable values for pageState are:
    // "prelogin"
    // "restaurant-list"
    // "restaurant-detail"
    // "user-list"
    this.state={
      pageState:"prelogin",
      userEmail: null,
      userAdmin: false,
      userId:null,
      selectedRestaurantDetails:null,
    }
    this.setAppState = this.setAppState.bind(this);
  }

  //There are a number of times, usually for model dialogs, where children
  //need to reach back up to refresh their page.
  //This function allows them to do that.
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
      pageToRender = <RestaurantDetail userEmail={this.state.userEmail} userAdmin={this.state.userAdmin} userId={this.state.userId} setAppState={this.setAppState} selectedRestaurantDetails={this.state.selectedRestaurantDetails}/>
    }else if (this.state.pageState == "user-list"){
      pageToRender = <UserList userEmail={this.state.userEmail} userAdmin={this.state.userAdmin} userId={this.state.userId} setAppState={this.setAppState}/>
    }
    return (
      <div className="App">
        {pageToRender}
      </div>
    );
  }
}
