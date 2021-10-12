import React, { Component} from "react";
import { Button, Checkbox, Card, Form, Label, Rating, Icon, Divider, Segment } from 'semantic-ui-react'
import RestaurantEditButton from "./RestaurantEditButton";
import ReviewEditButton from "./ReviewEditButton";
import {kzPost, kzGet} from "./Actions";

export default class RestaurantDetail extends Component {
  constructor(props){
    super(props);
    this.state={
      addRestaurantModelOpen:false,
      addReviewModalOpen:null,
      reviews:{},
    }
  }

  componentDidMount(){
    this.getAppropriateReviews();
  }

  //TODO: This is the same as the one in RestaurantList. Refactor
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

  updateRestaurantDetails(e,id){
    const elements=e.target.elements;
    const {name,location,description} = elements;
    const data={
      id:id,
      name:name.value,
      location:location.value,
      description:description.value,
    };
    kzPost("updaterestaurantdetails", data).then(value => {
      if (value && value.success){
          this.setSelectedRestaurantDetails(id);
          this.setState({
            addRestaurantModelOpen:false,
          });
      }else{
        console.log("Failed to update restaurant");
      }
    });
  }

  getAppropriateReviews(){
    const restaurantId = this.props.selectedRestaurantDetails.id;
    if (this.props.userAdmin){
      this.getAllReviews(restaurantId);
    }else{
      this.getSpecialReviews(restaurantId);
    }
  }

  getAllReviews(restaurantId){
    kzPost("getreviews",{restaurantId}).then(response => {
      if (response && response.success){
        this.setState({
          reviews:response.data,
        });
      }else{
        console.log("Failed to get reviews");
      }
    });
  }

  getSpecialReviews(restaurantId){
    kzPost("getspecialreviews",{restaurantId}).then(response => {
      if (response && response.success){
        this.setState({
          reviews:response.data,
        });
      }else{
        console.log("Failed to get special reviews");
      }
    });
  }

  updateReview(reviewObj){
    kzPost("updatereview",reviewObj).then(value => {
      if (value && value.success){
        this.setState({
          addReviewModalOpen:null
        },this.getAppropriateReviews());

      }else{
        console.log("Failed to update review");
      }
    });
  }

  deleteReview(reviewId){
    kzPost("deletereview",{reviewId}).then(value => {
      if (value && value.success){
        this.setSelectedRestaurantDetails(this.props.selectedRestaurantDetails.id);
        this.getAppropriateReviews();
      }else{
        console.log("Failed to delete review");
      }
    });
  }

  addReview(data){
    kzPost("addreview",data).then(value => {
      if (value && value.success){
        this.setState({
          addReviewModalOpen:false,
        },()=>{
          this.getAppropriateReviews();
        });
      }else{
        console.log("Failed to add review");
      }
    });
  }

  createReview(reviewObj){
    const {addReviewModalOpen} = this.state;
    const {userAdmin,selectedRestaurantDetails,userId} = this.props;
    return (!reviewObj ? <p>No review found</p> :
    <Segment>
      <div className="review-box">
        <div className="review-content-box">
          <p> {"Rating: ("+reviewObj.rating+"/5)"}</p>
          <p>Visited {reviewObj.date}</p>
          <p>{reviewObj.content}</p>
          <p className="review-user">{reviewObj.userFullName}</p>
        </div>
        {userAdmin ?
        <div className="review-action-box">
          <ReviewEditButton
            open={reviewObj.id==addReviewModalOpen}
            setParentState={(s)=>this.setState(s)}
            reviewObj={reviewObj}
            onSubmit={(data)=>this.updateReview({...data,...{id:reviewObj.id}})}
            actionText={"Edit"}
            buttonClass={"review-edit-btn"}/>
          <Button className="review-delete-btn" onClick={()=>{this.deleteReview(reviewObj.id)}}> Delete </Button>
        </div>:null}
      </div>
    </Segment>);
  }

  isObject(thing){
    return typeof thing === 'object' &&
    !Array.isArray(thing) &&
    thing !== null;
  }

  render(){
    const {addRestaurantModelOpen,addReviewModalOpen,reviews} = this.state;
    const {userEmail, userAdmin, userId, setAppState, selectedRestaurantDetails}=this.props;
    const {name, location, description, avgRating, numReviews} = selectedRestaurantDetails;
    const userAdminStr=userAdmin ? " (Admin)" : "";

    const userReviewSection=
      <div className="review-section">
        <h3> Latest Review </h3>
          {this.createReview(reviews.newestReview)}
        <h3> Highest Review </h3>
          {this.createReview(reviews.maxRatingReview)}
        <h3>Lowest Review </h3>
          {this.createReview(reviews.minRatingReview)}
        <ReviewEditButton
          open={addReviewModalOpen==-1}
          setParentState={(s)=>this.setState(s)}
          onSubmit={(data)=>this.addReview({...data, ...{userId,restaurantId:selectedRestaurantDetails.id}})}
          actionText={"Add Review"}
          buttonClass={"review-add-btn"}/>
      </div>

    const adminReviewSection=
        <div className="review-section">
          <h3> All Reviews </h3>
          <ReviewEditButton
            open={addReviewModalOpen==-1}
            setParentState={(s)=>this.setState(s)}
            onSubmit={(data)=>this.addReview({...data, ...{userId,restaurantId:selectedRestaurantDetails.id}})}
            actionText={"Add Review"}
            buttonClass={"review-add-btn"}/>
          <div>
            {!this.isObject(reviews) ? reviews.map((rev)=>this.createReview(rev)) : null}
          </div>
        </div>

    return <div className="detail-background-pane">
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
            <h1 className="detail-header"> {name} </h1>
            <div className="detail-rating-location-box">
              <div className="detail-rating-box">
                <Rating defaultRating={avgRating} maxRating={5} disabled/>
                <p className="restaurant-card-rating-label"> {avgRating.toFixed(2) + ("  ("+numReviews+" reviews)")} </p>
              </div>
              <h4 className="detail-location"> {location}</h4>
            </div>
            <div className="detail-description-box">
              <h4> {description} </h4>
            </div>

            {!userAdmin ? null:
              <RestaurantEditButton
                  open={addRestaurantModelOpen}
                  setParentState={(s)=>this.setState(s)}
                  onSubmit={(e)=>this.updateRestaurantDetails(e, selectedRestaurantDetails.id)}
                  actionText={"Edit Restaurant"}
                  buttonId="detail-edit-btn"
                  restaurantObj={selectedRestaurantDetails}
                  />
            }

            <Divider/>
            <div>
              {!userAdmin ? userReviewSection : adminReviewSection}
            </div>
          </div>
      </div>
  }
}
