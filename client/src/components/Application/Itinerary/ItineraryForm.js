import React, { Component } from 'react'
import {Button, FormGroup} from 'reactstrap'
import { Form, Label, CustomInput} from 'reactstrap'
import { isValidLatLon,parseLatLon} from '../../../api/checkLatLon'
import {schemaValidator} from "../SchemaValidation";
import TIPItinerarySchema from "../../../../../server/src/main/resources/TIPItinerarySchema.json";

export default class ItineraryForm extends Component {

    constructor(props) {
        super(props);
        
        this.readFile = this.readFile.bind(this);
        this.hideForm = this.hideForm.bind(this);

        this.state = {
            errorMessage: null
        };

    };

    render() {
    return (
        <div>
            {this.state.errorMessage}
            <Form>
                <FormGroup>
                    <Label for="itinerary">Itinerary Upload</Label>
                    <CustomInput type="file" label="Upload itinerary json file" name="Itinerary Upload" id="itinerary" accept=".json,application/json" onChange ={this.readFile}/>

                </FormGroup>
              <FormGroup className={"Button text-center"}>
                <Button className={"btn-csu"} type ="button" onClick={this.hideForm}> Cancel </Button>
              </FormGroup>
            </Form>
        </div>
    );}

//code from https://blog.shovonhasan.com/using-promises-with-filereader/
processFile (file) {
    const reader = new FileReader();

    return new Promise((resolve => {
        reader.onload = () => {
            resolve(reader.result);
        };

        reader.readAsText(file);

    }));
    }

async readFile   (event) {
    const file = event.target.files[0];
    const fileContent = await this.processFile (file);

    if (schemaValidator(TIPItinerarySchema, JSON.parse(fileContent))){
        this.setState({errorMessage: null});
        this.setStateFromFile(fileContent);
    } else {
        this.setState({
            errorMessage: this.props.createErrorBanner(
                "Client Error",
                400,
                `Invalid itinerary uploaded (does not match schema)`
            )
        });
    }

};



setStateFromFile (fileContent) {
  const parsedJSON = JSON.parse(fileContent);
  let parsedPlaces = parsedJSON.places.map((place) => {
    if (isValidLatLon(place.latitude,place.longitude)) {

      const parseValue = parseLatLon(place.latitude,place.longitude);
      place.latitude = parseValue.lat;
      place.longitude = parseValue.lon;

      return place;

    };
  });

  parsedPlaces = parsedPlaces.filter(( element ) => {
    return element !== undefined;
  });

  const itineraryObject = {
    requestVersion: parsedJSON.requestVersion,
    options: parsedJSON.options,
    places: parsedPlaces,
    distances: []
  };

  this.props.getItineraryData(itineraryObject);
}

hideForm(){
  let display = Object.assign({}, this.props.display);
  display.itineraryUpload = !display.itineraryUpload;
  this.props.updateDisplay(display);
}






}
