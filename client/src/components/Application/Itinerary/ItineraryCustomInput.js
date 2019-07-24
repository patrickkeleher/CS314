import React from 'react';
import {Form,Row, Col, FormGroup, Input, Label, Button} from 'reactstrap';
import Pane from '../Pane'
import { isValidLatLon,parseLatLon} from '../../../api/checkLatLon'

const customInput = (props) =>{
  const latLon = ["Latitude","Longitude"];
return(
    <Form className={"Form"} onSubmit = {processForm(props)}>


      <FormGroup>
        <Label for="Name">Name</Label>
        <Input type="text" name="Name" id="Name" placeholder="Name" required/>
      </FormGroup>

      <Row form>
        {latLon.map((name)=>{
        return (<Col md={6} key={name}>
          <FormGroup>
            <Label for={name}>{name}</Label>
            <Input type="text" name={name} id={name} placeholder={name} required/>
          </FormGroup>
        </Col>)
      })}

          </Row>

      <FormGroup className={"Button text-center"}>
        <Button className={"btn-csu"} type="submit"> Submit </Button>
      </FormGroup>

      <FormGroup className={"Button text-center"}>
        <Button className={"btn-csu"} type ="button" onClick={()=>hideForm(props)}> Cancel </Button>
      </FormGroup>


    </Form>
);
};

export const processForm = (props) => event => {
  event.preventDefault();
  const newPlace = new FormData(event.target);

  const newPlaceLat = newPlace.get('Latitude');
  const newPlaceLon = newPlace.get('Longitude');
  const newPlaceName = newPlace.get('Name');


  if (isValidLatLon(newPlaceLat,newPlaceLon)) {
   const parsedLatLon = parseLatLon(newPlaceLat,newPlaceLon);
   const place = {"name": newPlaceName, "latitude": parsedLatLon.lat, "longitude":parsedLatLon.lon};
   updateItinerary(props, place);
  }
  
};

const renderItineraryCustomInput = (props) =>{
  return (
      <Pane header={'Add Itinerary'}>
        {customInput(props)}
      </Pane>
  );
};

export const updateItinerary = (props,place) => {

  let itinerary = Object.assign({}, props.itinerary);
  itinerary.places.push(place);
  props.getItineraryData(itinerary);

};

export const hideForm = (props) =>{

  let display = Object.assign({}, props.display);
  display.itineraryCustomInput = !display.itineraryCustomInput;
  //props.display = display;
  props.updateDisplay(display);
  return display;
};



export default renderItineraryCustomInput;
