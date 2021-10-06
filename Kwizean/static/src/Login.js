import { Button, Checkbox, Card, Form } from 'semantic-ui-react'
import React from "react";

function Login(){
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
              <label>First Name</label>
              <input placeholder='First Name' />
            </Form.Field>
            <Form.Field>
              <label>Last Name</label>
              <input placeholder='Last Name' />
            </Form.Field>
            <Form.Field>
              <Checkbox label='I agree to the Terms and Conditions' />
            </Form.Field>
            <Button type='submit'>Submit</Button>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default Login;
