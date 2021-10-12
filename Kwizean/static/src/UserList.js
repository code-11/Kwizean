import { Button, Checkbox, Card, Form, Label, Rating, Icon, Modal, Header, Loader, Segment } from 'semantic-ui-react'
import React, { Component} from "react";
import UserEditButton from "./UserEditButton";
import {kzPost, kzGet} from "./Actions";

export default class Userlist extends Component{
  constructor(props){
    super(props);
    this.state={
      users:null,
      editUserModalId:null,
    }
  }

  componentDidMount(){
    this.getUsers();
  }

  getUsers(){
    kzGet("getusers").then(response => {
      if (response && response.success){
        this.setState({
          users:response.data,
        });
      }else{
        console.log("Failed to get reviews");
      }
    });
  }

  deleteUser(userId){
    kzPost("deleteuser",{userId}).then(response => {
      if (response && response.success){
        this.getUsers();
      }else{
        console.log("Failed to delete user");
      }
    });
  }

  updateUser(userObj){
    kzPost("updateuser",userObj).then(response => {
      if (response && response.success){
        this.setState({
          editUserModalId:null
        },
        this.getUsers());
      }else{
        console.log("Failed to update user");
      }
    });
  }

  createUser(userObj){
    const {editUserModalId} = this.state;
    const {userId} = this.props;
    return <Segment>
      <div className="review-box">
        <div>
          <h4>{userObj.firstName+" "+userObj.lastName}</h4>
          <p><span style={{fontWeight:"bold"}}>Is Admin:</span>{userObj.isAdmin ? " Yes" : " No"} </p>
          <p><span style={{fontWeight:"bold"}}>Email: </span>{userObj.email} </p>
          <p><span style={{fontWeight:"bold"}}>Phone Number: </span>{userObj.phoneNumber}</p>
        </div>
        <div className="review-action-box">
          <UserEditButton
              buttonClass="review-edit-btn"
              open={userObj.id==editUserModalId}
              setParentState={(s)=>this.setState(s)}
              userObj={userObj}
              onSubmit={(data)=>this.updateUser({...data,...{userId:userObj.id}})} />
          <Button className="review-delete-btn" onClick={()=>{
            this.deleteUser(userObj.id);
            if (userObj.id ==userId){
              setAppState({
                  pageState:"prelogin",
              });
            }
          }}> Delete </Button>
        </div>
      </div>
    </Segment>
  }

  render(){
    const {users} =this.state;
    const {userEmail,userAdmin, setAppState} = this.props;
    const userAdminStr=userAdmin ? " (Admin)" : "";
    const userList=users ? users.map((usr)=>this.createUser(usr)) : null;
    return <div className="user-list-page">
      <div className="login-banner">
        <a className="banner-logo-link" onClick={()=>setAppState({
            pageState:"restaurant-list",
          })
        }>
          <img className="login-banner-logo" src="icons/kwizeanFull105.png"/>
        </a>
        <div className="banner-user-label-group">
          <p className="banner-user-label"> {userEmail+userAdminStr}</p>
          <a onClick={()=>setAppState({pageState:"prelogin"})}> Log Out </a>
        </div>
      </div>
      <div className="detail-pane">
        <h1>Users</h1>
        {userList}
      </div>
    </div>
  }
}
