import { Button, Checkbox, Card, Form, Label, Rating, Icon, Modal, Header, Loader, TextArea } from 'semantic-ui-react'
import React, { Component} from "react";

/**
This button is actually responsible for three things:
1) The actual button
2) The modal which comes up from the Button
3) Calling a callback after the restaurant has been edited.

In order to work, there needs to be a addRestaurantModelOpen as part of the parent state, which should default to false.
**/
export default class RestaurantEditButton extends Component{
  constructor(props){
      super(props);
  }

  render(){
    const {open, setParentState, onSubmit, actionText, buttonId, restaurantObj} = this.props;
    return <Modal
      id="restaurant-add-modal"
      onClose={() => {}}
      onOpen={() => {}}
      open={open}
      trigger={<Label id={buttonId} onClick={()=>setParentState({addRestaurantModelOpen:true})}>{actionText}</Label>}
    >
      <Modal.Header>{actionText}</Modal.Header>
      <Modal.Content>
        <Form onSubmit={(e)=>{onSubmit(e)}}>
          <Form.Field>
            <label>Restaurant Name</label>
            <input placeholder='Restaurant Name' name="name" defaultValue ={restaurantObj ? restaurantObj.name : ""}/>
          </Form.Field>
          <Form.Field>
            <label>Restaurant Location</label>
            <input placeholder='Restaurant Location' name="location" defaultValue ={restaurantObj ? restaurantObj.location : ""}/>
          </Form.Field>
          <Form.Field required control={TextArea} name="description" label='Description' width={8}  placeholder='Tell us more about this restaurant...' defaultValue ={restaurantObj ? restaurantObj.description : ""}/>
          <Button color='black' onClick={ ()=>setParentState({addRestaurantModelOpen:false}) }defaultValue = {restaurantObj ? restaurantObj.description : ""} > Cancel </Button>
          <Button id="restaurant-add-model-confirm" content="Submit Restaurant" type="submit"/>
        </Form>
      </Modal.Content>
    </Modal>
  }
}
