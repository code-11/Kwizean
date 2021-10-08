import React, { Component} from "react";
import { Button, Checkbox, Card, Form, Label, Rating, Icon } from 'semantic-ui-react'

export default class ResturantList extends Component {
  constructor(props){
    super(props);
  }

  createCard(name, location, desc, avgRating, numReviews, tagList){

    const tagElementList = tagList.map((tag)=><Label>{tag}</Label>);

    const possibleDeleteBtn = !this.props.userAdmin ? null :
      <Card.Content extra>
        <Button className="restaurant-delete-btn">Delete</Button>
      </Card.Content>;

    return (
    <a>
      <Card className="restaurant-card">
        <Card.Content>
          <Card.Header>{name}</Card.Header>
          <Card.Meta>{location}</Card.Meta>
          <Card.Description>{desc}</Card.Description>
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

    const restaurantInfo=[
      this.createCard("Pizza Junction",
        "135 N. Reading St.",
        "Pizza Junction has been serving the Metropolis area for over thirty years. With an unsurpassed attention to quality, fresh ingredients and timely delivery, find out whats new at the Junction!",
        3.5 ,
        105,
        ["Pizzas","Calzones","Salads","Falafel"]
      )
    ]

    const userAdminStr=userAdmin ? " (Admin)" : "";

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
        <Card.Group>
          {restaurantInfo}
        </Card.Group>
      </div>
      <Label id="restaurant-add-btn"><h1> Add Restaurant </h1></Label>
    </div>;
  }
}
