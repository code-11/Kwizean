import { Button, Checkbox, Card, Form } from 'semantic-ui-react'
import React, { Component } from "react";
import {kzPost} from "./Actions";

export default class Login extends Component{

  constructor(props){
    super(props);
    this.state={
      showfailure:false
    }
  }

  render(){
    const {switchLoginState, setAppState} = this.props;
    const {showFailure} = this.state;
    const possibleFailureLabel = showFailure ? <p> That login is not recognized. </p> : null;
    return (
      <div>
        <div className="login-banner">
        <img className="login-banner-logo" src="icons/kwizeanFull105.png"/>
        </div>
        <div className="login-holder">
          <Card className="login-plate">
            <h1 className="login-header"> Sign in to Kwizean </h1>
            <Form onSubmit={(e)=>{
              const elements=e.target.elements;
              const {password,email,admin} = elements;
              const data={
                password:password.value,
                email:email.value,
                admin:admin.checked,
              };
              kzPost("login",data).then(value => {
                if (value && value.success){
                  setAppState({
                    pageState:"postlogin",
                    userEmail:email.value,
                    userAdmin:admin.checked,
                  });
                }else{
                  this.setState({
                    showFailure:true
                  }, ()=>{
                     setTimeout(() => this.setState({ showFailure:false}), 5000);
                  });
                }
              });
            }}>
              {possibleFailureLabel}
              <Form.Field>
                <label>Email</label>
                <input placeholder='Email' name="email" />
              </Form.Field>
              <Form.Field>
                <label>Password</label>
                <input placeholder='Password' type="password" name="password" />
              </Form.Field>
              <Form.Field>
                <Checkbox name="admin" label="Is Admin"/>
              </Form.Field>
              <Button id="login-submit" type='submit'>Sign In</Button>
              <a className="login-action" onClick={()=>{
                switchLoginState("signup");
              }}>Create Account</a>
            </Form>
          </Card>
        </div>
      </div>
    );
  }
}
