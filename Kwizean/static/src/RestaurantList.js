import React, { Component} from "react";
import { Button, Checkbox, Card, Form, Label, Rating, Icon, Modal, Header, Loader } from 'semantic-ui-react'
import RestaurantEditButton from "./RestaurantEditButton";
import {kzPost, kzGet} from "./Actions";

export default class RestaurantList extends Component {
  constructor(props){
    super(props);
    this.state={
      addRestaurantModelOpen:false,
      deleteRestaurantModalId: null,
      restaurants:[],
      fetchingRestaurants:true,
    }
  }

  componentDidMount(){
    this.getRestaurants();
  }

  setSelectedRestaurantDetails(id){
    const {setAppState} = this.props;
    kzPost("getrestaurantdetails",{id:id}).then(restaurantDetailResponse=>{
      if(restaurantDetailResponse && restaurantDetailResponse.success){
        setAppState({
          selectedRestaurantDetails: restaurantDetailResponse.data,
          pageState:"restaurant-detail",
        });
      }
    });
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

  deleteRestaurant(id){
    kzPost("deleterestaurant",{id}).then(restaurantDeletionResponse=>{
      if(restaurantDeletionResponse && restaurantDeletionResponse.success){
        this.setState({
          fetchingRestaurants:true,
          deleteRestaurantModalId:null,
        }, this.getRestaurants());
      }
    });
  }

  createDeleteRestaurantButton(restaurantObj){
    const {deleteRestaurantModalId} = this.state;
    return <Modal
      open={deleteRestaurantModalId==restaurantObj.id}
      trigger={<Button className="restaurant-delete-btn" onClick={()=>{this.setState({deleteRestaurantModalId:restaurantObj.id})}}>Delete</Button>}>
      <Modal.Header>Delete Restaurant?</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>{"This action cannot be undone. Are you sure you want to delete "+restaurantObj.name+"?"}</p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => this.setState({deleteRestaurantModalId:null})}> Cancel </Button>
        <Button onClick={()=>{this.deleteRestaurant(restaurantObj.id)}}> Delete </Button>
      </Modal.Actions>
    </Modal>
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
        this.setState({
          addRestaurantModelOpen:false,
          fetchingRestaurants:true,
        }, this.getRestaurants());
      }else{
        console.log("Failed to make restaurant");
      }
    });
  }

  // createCard(name, location, desc, avgRating, numReviews, tagList){
  createCard(restaurantObj){
    const {setAppState} = this.props;
    const {name,location,description,avgRating,numReviews}=restaurantObj;
    const tagContainer = null;// <Card.Content extra>{tagList.map((tag)=><Label>{tag}</Label>)}</Card.Content>;

    const possibleDeleteBtn = !this.props.userAdmin ? null : this.createDeleteRestaurantButton(restaurantObj);

    return (
      <Card className="restaurant-card">
          <Card.Content>
            <Card.Header>{name}</Card.Header>
            <Card.Meta>{location}</Card.Meta>
            <Card.Description>{description}</Card.Description>
            <Rating className="restaurant-card-rating" defaultRating={avgRating} maxRating={5} disabled/>
            <p className="restaurant-card-rating-label"> {avgRating.toFixed(2) + ("  ("+numReviews+" reviews)")} </p>
          </Card.Content>
          {tagContainer}
          <Card.Content extra>
            <Button className="restaurant-details-btn" onClick={()=>{
              this.setSelectedRestaurantDetails(restaurantObj.id);
            }}> See Details </Button>
            {possibleDeleteBtn}
          </Card.Content>
      </Card>);
  }

  render(){

    const {userEmail, userAdmin, setAppState}=this.props;
    const {restaurants, fetchingRestaurants,addRestaurantModelOpen} = this.state;
    const restaurantInfo=restaurants.map((r)=>this.createCard(r));

    const userAdminStr=userAdmin ? " (Admin)" : "";
    const possibleAddRestaurantBtn = !userAdmin ? null :
    <RestaurantEditButton
      open={addRestaurantModelOpen}
      setParentState={(s)=>this.setState(s)}
      onSubmit={(e)=>this.submitRestaurant(e)}
      actionText={"Add Restaurant"}
      buttonId="restaurant-add-btn"
      />;

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
      <div className="admin-actions-panel">
        {possibleAddRestaurantBtn}
        <Button onClick={()=>{setAppState({pageState:"user-list"})}}> Edit Users </Button>
      </div>
    </div>;
  }
}
