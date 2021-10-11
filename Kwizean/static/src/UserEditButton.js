import { Button, Checkbox, Card, Form, Label, Rating, Icon, Modal, Header, Loader, Segment } from 'semantic-ui-react'
import React, { Component} from "react";
import {kzPost, kzGet} from "./Actions";

export default class UserEditButton extends Component{
  constructor(props){
      super(props);
  }

  extractData(e){
    const elements=e.target.elements;
    const {firstName, lastName, phoneNumber,password,email,admin} = elements;
    const data={
      firstName:firstName.value,
      lastName:lastName.value,
      phoneNumber:phoneNumber.value,
      email:email.value,
      admin:admin.checked
    };
    return data;
  }

  render(){
    const {buttonClass, open, setParentState, onSubmit, userObj} = this.props;
    return <Modal
      open={open}
      trigger={<Button className={buttonClass} onClick={()=>setParentState({editUserModalId:userObj.id})}>{"Edit"}</Button>}
    >
      <Modal.Header>Edit User</Modal.Header>
      <Modal.Content>
      <Form onSubmit={(e)=>{ onSubmit(this.extractData(e)) }}>
        <Form.Field>
          <label>First Name</label>
          <input placeholder='First Name' name="firstName" defaultValue={userObj.firstName} />
        </Form.Field>
        <Form.Field>
          <label>Last Name</label>
          <input placeholder='Last Name' name="lastName" defaultValue={userObj.lastName} />
        </Form.Field>
        <Form.Field>
          <label>Phone Number</label>
          <input placeholder='Phone Number' name="phoneNumber" defaultValue={userObj.phoneNumber} />
        </Form.Field>
        <Form.Field>
          <label>Email</label>
          <input placeholder='Email' name="email" defaultValue={userObj.email} />
        </Form.Field>
        <Form.Field>
          <label>Admin</label>
          <input type="checkbox" name="admin" defaultChecked = {userObj.isAdmin} />
        </Form.Field>
        <Button color='black' onClick={()=>setParentState({editUserModalId:null})}>Cancel</Button>
        <Button id="restaurant-add-model-confirm" type='submit'>Edit User</Button>
        </Form>
      </Modal.Content>
    </Modal>
  }
}
