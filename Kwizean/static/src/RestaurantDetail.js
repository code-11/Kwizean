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
    }
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

  addReview(data){
    kzPost("addreview",data).then(value => {
      if (value && value.success){
        this.setState({
          addReviewModalOpen:false,
        });
      }else{
        console.log("Failed to add review");
      }
    });
  }

  render(){
    const {addRestaurantModelOpen,addReviewModalOpen} = this.state;
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
            <div>
              <Rating defaultRating={5} maxRating={5} disabled/>
              <p>Visited July 18, 2021</p>
              <p>But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful.</p>
              <p className="review-user">John Goodbody Esq.</p>
            </div>
            <h3> Highest Review </h3>
            <div>
              <Rating defaultRating={5} maxRating={5} disabled/>
              <p>Visited July 18, 2021</p>
              <p>Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? </p>
              <p>John Goodbody Esq.</p>
            </div>
            <h3>Lowest Review </h3>
            <div>
              <Rating defaultRating={5} maxRating={5} disabled/>
              <p>Visited July 18, 2021</p>
              <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.</p>
              <p>John Goodbody Esq.</p>
            </div>
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
