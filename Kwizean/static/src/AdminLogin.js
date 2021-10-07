import { Button, Checkbox, Card, Form } from 'semantic-ui-react'
import React, { Component } from "react";


export default class AdminLogin extends Component{

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
          <Card className="login-plate" style={{backgroundColor:"#fddba9"}}>
            <h1> Sign in to Kwizean as Admin </h1>
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
                switchLoginState("login");
              }}>Sign In as User </a>
            </Form>
          </Card>
        </div>
      </div>
    );
  }
}
