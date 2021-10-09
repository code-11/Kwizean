import { Button, Checkbox, Card, Form, Label, Rating, Icon, Modal, Header, Loader, TextArea } from 'semantic-ui-react'
import React, { Component} from "react";

export default class ReviewEditButton extends Component{
  constructor(props){
      super(props);
  }

  extractData(e){
    const elements=e.target.elements;
    const {rating,date,content} = elements;
    const data={
      rating:rating.value,
      date:date.value,
      content:content.value,
    };
    return data;
  }

  render(){
    const {open, setParentState, onSubmit, actionText, buttonId, reviewObj} = this.props;
    return <Modal
      open={open}
      trigger={<Label id={buttonId} onClick={()=>setParentState({addReviewModalOpen:true})}>{actionText}</Label>}
    >
      <Modal.Header>{actionText}</Modal.Header>
      <Modal.Content>
        <Form onSubmit={(e)=>{ onSubmit(this.extractData(e)) }}>
          <Form.Field>
            <label> Rating 1-5 </label>
            <input type="number" id="quantity" name="rating" min="1" max="5"/>
          </Form.Field>
          <Form.Field>
            <input type="date" name="date"/>
          </Form.Field>
          <Form.Field required control={TextArea} name="content" label='Content' width={8}  placeholder='Tell us how you felt about this restaurant...'/>
          <Button color='black' onClick={ ()=>setParentState({addReviewModalOpen:false}) }> Cancel </Button>
          <Button id="review-add-modal-confirm" content="Submit Restaurant" type="submit"/>
        </Form>
      </Modal.Content>
    </Modal>
  }
}
