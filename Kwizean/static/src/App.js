import './App.css';
import Login from "./Login";
import React, { Component } from "react";

class App extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className="App">
        <Login />
      </div>
    );
  }
}

export default App;
