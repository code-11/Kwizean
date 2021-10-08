import React, { Component} from "react";
import { Button, Checkbox, Card, Form, Label, Rating, Icon, Modal, Header, Loader } from 'semantic-ui-react'
import {kzPost, kzGet} from "./Actions";

export default class RestaurantList extends Component {
  constructor(props){
    super(props);
    this.state={
      addRestaurantModelOpen:false,
      restaurants:[],
      fetchingRestaurants:true,
    }
  }

  componentDidMount(){
    this.getRestaurants();
  }

  getRestaurants(){
    kzGet("getrestaurants").then(restaurantListResponse=>{
      if(restaurantListResponse && restaurantListResponse.success){
        this.setState({
          restaurants:restaurantListResponse.data,
          fetchingRestaurants:false,
        });
      }
    });
  }

  submitRestaurant(e){
    const elements=e.target.elements;
    const {name,location,description} = elements;
    const data={
      name:name.value,
      location:location.value,
      description:description.value,
    };
    kzPost("createrestaurant",data).then(value => {
      if (value && value.success){
        this.setState({addRestaurantModelOpen:false});
      }else{
        console.log("Failed to make restaurant");
      }
    });
  }

  createAddRestaurantButton(){
    const {addRestaurantModelOpen} = this.state;
    return <Modal
      id="restaurant-add-modal"
      onClose={() => {}}
      onOpen={() => {}}
      open={addRestaurantModelOpen}
      trigger={<Label id="restaurant-add-btn" onClick={()=>this.setState({addRestaurantModelOpen:true})}><h2> Add Restaurant </h2></Label>}
    >
      <Modal.Header>Add Restaurant</Modal.Header>
      <Modal.Content>
        <Form onSubmit={(e)=>{this.submitRestaurant(e)}}>
          <Form.Field>
            <label>Restaurant Name</label>
            <input placeholder='Restaurant Name' name="name" />
          </Form.Field>
          <Form.Field>
            <label>Restaurant Location</label>
            <input placeholder='Restaurant Location' name="location" />
          </Form.Field>
          <Form.TextArea name="description" label='Description' placeholder='Tell us more about this restaurant...' />
          <Button color='black' onClick={ ()=>this.setState({addRestaurantModelOpen:false}) }> Cancel </Button>
          <Button id="restaurant-add-model-confirm" content="Submit Restaurant" type="submit"/>
        </Form>
      </Modal.Content>
    </Modal>
  }

  // createCard(name, location, desc, avgRating, numReviews, tagList){
  createCard(restaurantObj){
    const {setAppState} = this.props;
    const {name,location,description,}=restaurantObj;
    const avgRating=3;
    const numReviews=105;
    const tagElementList = null;// tagList.map((tag)=><Label>{tag}</Label>);

    const possibleDeleteBtn = !this.props.userAdmin ? null :
      <Card.Content extra>
        <Button className="restaurant-delete-btn">Delete</Button>
      </Card.Content>;

    return (
    <a onClick={()=>{
      setAppState({
        pageState:"restaurant-detail"
      });
    }}>
      <Card className="restaurant-card">
        <Card.Content>
          <Card.Header>{name}</Card.Header>
          <Card.Meta>{location}</Card.Meta>
          <Card.Description>{description}</Card.Description>
          <Rating className="restaurant-card-rating" defaultRating={avgRating} maxRating={5} disabled/>
          <p className="restaurant-card-rating-label"> {avgRating + ("  ("+numReviews+" reviews)")} </p>
        </Card.Content>
        <Card.Content extra>
        <div>
          {tagElementList}
        </div>
        </Card.Content>
        {possibleDeleteBtn}
      </Card>
    </a>);
  }

  render(){

    const {userEmail, userAdmin}=this.props;
    const {restaurants, fetchingRestaurants} = this.state;
    const restaurantInfo=restaurants.map((r)=>this.createCard(r));

    const userAdminStr=userAdmin ? " (Admin)" : "";
    const possibleAddRestaurantBtn = !userAdmin ? null : this.createAddRestaurantButton();

    return <div className="restaurant-page">
      <div className="login-banner">
        <img className="login-banner-logo" src="icons/kwizeanFull105.png"/>
        <div className="banner-user-label-group">
          <Icon name="user"/>
          <p className="banner-user-label"> {userEmail+userAdminStr}</p>
        </div>
      </div>
      <div className="restaurant-grid">
        <h2 className="restaurant-grid-header"> The best restaurants in your area </h2>
        {
          fetchingRestaurants ? <Loader active inline='centered'> Loading Restaurants </Loader> :
          <Card.Group>
            {restaurantInfo}
          </Card.Group>
        }
      </div>
      {possibleAddRestaurantBtn}
    </div>;
  }
}
