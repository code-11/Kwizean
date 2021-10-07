import { Button, Checkbox, Card, Form } from 'semantic-ui-react'
import React, { Component } from "react";


export default class Login extends Component{

  constructor(props){
    super(props);
  }

  render(){
    const {switchLoginState} = this.props;

    return (
      <div>
        <div className="login-banner">
        <img className="login-banner-logo" src="icons/kwizeanFull105.png"/>
        </div>
        <div className="login-holder">
          <Card className="login-plate">
            <h1> Sign in to Kwizean </h1>
            <Form>
              <Form.Field>
                <label>Email</label>
                <input placeholder='Email' />
              </Form.Field>
              <Form.Field>
                <label>Password</label>
                <input placeholder='Password' type="password" />
              </Form.Field>
              <Button id="login-submit" type='submit'>Sign In</Button>
              <a className="login-action" onClick={()=>{
                switchLoginState("signup");
              }}>Create Account</a>
              <a className="login-action" onClick={()=>{
                switchLoginState("admin");
              }}>Sign In as Admin </a>
            </Form>
          </Card>
        </div>
      </div>
    );
  }
}
