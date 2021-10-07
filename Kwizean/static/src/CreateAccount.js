import React, { Component } from "react";
import { Button, Checkbox, Card, Form } from 'semantic-ui-react'
import {kzPost} from "./Actions";

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
            <Form onSubmit={(e)=>{
              const elements=e.target.elements;
              const {firstName, lastName, phoneNumber,password,email,admin} = elements;
              const data={
                firstName:firstName.value,
                lastName:lastName.value,
                phoneNumber:phoneNumber.value,
                password:password.value,
                email:email.value,
                admin:admin.checked
              };
              kzPost("signup",data).then(value => {
                if (value && value.success){
                  switchLoginState("login");
                }else{
                  console.log("Failed to make user");
                }
              });
            }}>
              <Form.Field>
                <label>First Name</label>
                <input placeholder='First Name' name="firstName" />
              </Form.Field>
              <Form.Field>
                <label>Last Name</label>
                <input placeholder='Last Name' name="lastName" />
              </Form.Field>
              <Form.Field>
                <label>Phone Number</label>
                <input placeholder='Phone Number' name="phoneNumber" />
              </Form.Field>
              <Form.Field>
                <label>Email</label>
                <input placeholder='Email' name="email" />
              </Form.Field>
              <Form.Field>
                <label>Password</label>
                <input placeholder='Password' type="password" name="password" />
              </Form.Field>
              <Form.Field>
                <label>Confirm Password</label>
                <input placeholder='Confirm Password' type="password" />
              </Form.Field>
              <Form.Field>
                <Checkbox name="admin" label="Admin"/>
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
