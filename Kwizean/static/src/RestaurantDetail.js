import React, { Component} from "react";
import { Button, Checkbox, Card, Form, Label, Rating, Icon, Divider } from 'semantic-ui-react'
import RestaurantEditButton from "./RestaurantEditButton";
import ReviewEditButton from "./ReviewEditButton";
import {kzPost, kzGet} from "./Actions";

export default class RestaurantDetail extends Component {
  constructor(props){
    super(props);
    this.state={
      addRestaurantModelOpen:false,
      addReviewModalOpen:false,
      specialReviews:{},
    }
  }

  componentDidMount(){
    this.getSpecialReviews();
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

  getSpecialReviews(){
    kzGet("getspecialreviews").then(response => {
      if (response && response.success){
        this.setState({
          specialReviews:response.data,
        });
      }else{
        console.log("Failed to get special reviews");
      }
    });
  }

  addReview(data){
    kzPost("addreview",data).then(value => {
      if (value && value.success){
        this.setState({
          addReviewModalOpen:false,
        },this.getSpecialReviews());
      }else{
        console.log("Failed to add review");
      }
    });
  }

  createReview(reviewObj){
    return (!reviewObj ? <p>No review found</p> :
    <div>
      <Rating defaultRating={reviewObj.rating} maxRating={5} disabled/>
      <p>Visited {reviewObj.date}</p>
      <p>{reviewObj.content}</p>
      <p className="review-user">{reviewObj.userName}</p>
    </div>);
  }

  render(){
    const {addRestaurantModelOpen,addReviewModalOpen,specialReviews} = this.state;
    const {userEmail, userAdmin, userId, setAppState, selectedRestaurantDetails}=this.props;
    const {name, location, description} = selectedRestaurantDetails;
    const userAdminStr=userAdmin ? " (Admin)" : "";
    return <div className="detail-background-pane">
          <div className="login-banner">
            <a className="banner-logo-link" onClick={()=>setAppState({
                pageState:"restaurant-list",
              })
            }>
              <img className="login-banner-logo" src="icons/kwizeanFull105.png"/>
            </a>
            <div className="banner-user-label-group">
              <Icon name="user"/>
              <p className="banner-user-label"> {userEmail+userAdminStr}</p>
            </div>
          </div>
          <div className="detail-pane">
            <h1 className="detail-header"> {name} </h1>
            <div className="detail-rating-location-box">
              <div className="detail-rating-box">
                <Rating defaultRating={3} maxRating={5} disabled/>
                <p className="restaurant-card-rating-label"> {3.5 + ("  ("+150+" reviews)")} </p>
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
            <h3> Latest Review </h3>
              {this.createReview(specialReviews.newestReview)}
            <h3> Highest Review </h3>
              {this.createReview(specialReviews.maxRatingReview)}
            <h3>Lowest Review </h3>
              {this.createReview(specialReviews.minRatingReview)}
            <ReviewEditButton
              open={addReviewModalOpen}
              setParentState={(s)=>this.setState(s)}
              onSubmit={(data)=>this.addReview({...data, ...{userId,restaurantId:selectedRestaurantDetails.id}})}
              actionText={"Add Review"}
              buttonId={"review-add-btn"}
            />
          </div>
      </div>
  }
}
