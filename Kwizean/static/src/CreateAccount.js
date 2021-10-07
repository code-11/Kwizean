import React, { Component } from "react";
import { Button, Checkbox, Card, Form } from 'semantic-ui-react'

export default class CreateAccount extends Component {
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
            <h1> Sign Up for Kwizean </h1>
            <Form>
              <Form.Field>
                <label>First Name</label>
                <input placeholder='First Name' />
              </Form.Field>
              <Form.Field>
                <label>Last Name</label>
                <input placeholder='Last Name' />
              </Form.Field>
              <Form.Field>
                <label>Phone Number</label>
                <input placeholder='Phone Number' />
              </Form.Field>
              <Form.Field>
                <label>Email</label>
                <input placeholder='Email' />
              </Form.Field>
              <Form.Field>
                <label>Password</label>
                <input placeholder='Password' type="password" />
              </Form.Field>
              <Form.Field>
                <label>Confirm Password</label>
                <input placeholder='Confirm Password' type="password" />
              </Form.Field>
              <Button id="login-submit" type='submit'>Create Account</Button>
              <a className="login-action" onClick={()=>{
                switchLoginState("login");
              }}>Return to Sign In</a>
            </Form>
          </Card>
        </div>
      </div>
    );
  }
}
