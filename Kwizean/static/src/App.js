import './App.css';
import SignInUp from "./SignInUp";
import React, { Component } from "react";

class App extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className="App">
        <SignInUp />
      </div>
    );
  }
}

export default App;
