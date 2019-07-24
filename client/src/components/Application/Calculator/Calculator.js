import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { Form, Button , Input } from 'reactstrap'
import { sendServerRequestWithBody } from '../../../api/restfulAPI'
import Pane from '../Pane';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import {Map, Marker, Polyline, Popup, TileLayer} from 'react-leaflet';
import Cookies from 'js-cookie';
import { isValidLatLon,parseLatLon} from '../../../api/checkLatLon'
import {schemaValidator} from "../SchemaValidation";
import TIPDistanceSchema from "../../../../../server/src/main/resources/TIPDistanceSchema.json";


export default class Calculator extends Component {
  constructor(props) {
      super(props);

      this.updateLocationOnChange = this.updateLocationOnChange.bind(this);
      this.updateStateWithCookieCoord = this.updateStateWithCookieCoord.bind(this);
      this.calculateDistance = this.calculateDistance.bind(this);
      this.createInputField = this.createInputField.bind(this);
      this.setErrorBanner = this.setErrorBanner.bind(this);
      this.state = {
          origin: {latitude:"", longitude: ""},
          destination: {latitude: "", longitude: ""},
          distance: 0,
          errorMessage: null
      };

  }

  render() {
    const panes = [this.createForm('origin'),this.createForm('destination'),this.createDistance()];
    return (
      <Container>
        {this.state.errorMessage}
        <Row className = 'mb-4'>
          <Col>
            {this.createHeader()}
          </Col>
        </Row>

        <Row className = 'mb-4'>
          {panes.map ((pane,index)=>{
          return(<Col xs={12} sm={6} md={4} lg={3} key ={index}>
            {pane}
          </Col>)
        })}
        </Row>

        <Row className = 'mb-4'>
              <Col xs={12} sm={12} md={7} lg={8} xl={9}>
                  {this.renderMap()}
              </Col>
        </Row>
      </Container>
    );
  }

  createHeader() {
    return (
        <Pane header={'Calculator'}>
            <div>Determine the distance between the origin and destination.
                Change the units on the <b>Options</b> page.
            </div>
        </Pane>
    );
  }

    createInputField(stateVar, coordinate) {
    let updateStateVarOnChange = (event) => {
      Cookies.set(`${stateVar.charAt(0)}${event.target.name}`, event.target.value);

        this.updateLocationOnChange(stateVar, event.target.name, event.target.value)

    };

    let capitalizedCoordinate = coordinate.charAt(0).toUpperCase() + coordinate.slice(1);
    return (
      <Input name={coordinate} placeholder={capitalizedCoordinate}
             id={`${stateVar}${capitalizedCoordinate}`}
             defaultValue={this.state[stateVar][coordinate]}
             onBlur={updateStateVarOnChange}
             style={{width: "100%"}}
      />
    );

  }

  createForm(stateVar) {
    return (
        <Pane header={stateVar.charAt(0).toUpperCase() + stateVar.slice(1)}>
            <Form >
                {this.createInputField(stateVar, 'latitude')}
                {this.createInputField(stateVar, 'longitude')}
            </Form>
        </Pane>

    );
  }

  createDistance() {
    return(
        <Pane header={'Distance'}>
            <div>
                <h5>{this.state.distance} {this.props.options.activeUnit}</h5>
                <Button onClick={this.calculateDistance}>Calculate</Button>
            </div>
        </Pane>
    );
  }



  updateLocationOnChange(stateVar, field, value) {
      let location = Object.assign({}, this.state[stateVar]);
      location[field] = value;
      this.setState({[stateVar]: location});
      }

  updateStateWithCookieCoord(){

          let stateData = Object.assign({},this.state);

          if (Cookies.get().hasOwnProperty('olatitude')
              && Cookies.get().hasOwnProperty('olongitude')) {
            stateData.origin.latitude = Cookies.get('olatitude');
            stateData.origin.longitude =Cookies.get('olongitude');
            this.setState({stateData});
          }

          if (Cookies.get().hasOwnProperty('dlatitude')
              && Cookies.get().hasOwnProperty('dlongitude')) {
            stateData.destination.latitude = Cookies.get('dlatitude');
            stateData.destination.longitude = Cookies.get('dlongitude');
            this.setState({stateData});
          }
  }

    renderMap() {
        return (
            <Pane header={'Calculator Map'}>
                {this.renderLeafletMap()}
            </Pane>
        );
    }

    //Map background from https://leafletjs.com/examples/zoom-levels/
    renderLeafletMap() {
      let coordinates = [this.getMarker(this.state.origin.latitude,this.state.origin.longitude), this.getMarker(this.state.destination.latitude,this.state.destination.longitude)];
      const markers = [{name: "Origin", position:this.getMarker(this.state.origin.latitude,this.state.origin.longitude)},
        {name: "Destination", position:this.getMarker(this.state.destination.latitude,this.state.destination.longitude)} ];
      return (
            <Map center={L.latLng(0,0)} zoom={2} style={{height: 500, maxwidth: 700}} preferCanvas={true}>
                <TileLayer url='http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
                           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
              { markers.map((marker,index) =>{
                return(
                    <Marker position={marker.position} icon={this.markerIcon()} key ={index}>
                      <Popup className="font-weight-extrabold">{marker.name}</Popup>
                    </Marker>
                )
              })}

                <Polyline positions={coordinates}/>
            </Map>
        )
    }



    getMarker(lat,lon){

      if (isValidLatLon(lat,lon)  ) {
        const location  = parseLatLon(lat,lon);
          return L.latLng(location.lat, location.lon);
    }
      else {
        return L.latLng(0, 0);
      }
    }


    markerIcon() {
        // react-leaflet does not currently handle default marker icons correctly,
        // so we must create our own
        return L.icon({
            iconUrl: icon,
            shadowUrl: iconShadow,
            iconAnchor: [12,40]  // for proper placement
        })
    }

  setErrorBanner(message,statusCode,serverPort){
    this.setState({
      errorMessage: this.props.createErrorBanner(
          message, statusCode, `Request to ${serverPort} failed.`
      )
    });

  }

  getRequest(response){
    if (response.statusCode >= 200 && response.statusCode <= 299) {
      this.setState({
        distance: response.body.distance,
        errorMessage: null
      });
    } else {
      this.setErrorBanner(response.statusText,response.statusCode,response.serverPort);
    }
  }

  calculateDistance() {

    if (isValidLatLon(this.state.origin.latitude,this.state.origin.longitude) && isValidLatLon(this.state.destination.latitude,this.state.destination.longitude) ) {
      const origin = parseLatLon(this.state.origin.latitude,this.state.origin.longitude);
      const destination = parseLatLon(this.state.destination.latitude,this.state.destination.longitude);

      const tipConfigRequest = {
        'requestType': 'distance',
        'requestVersion': 5,
        'origin': {latitude: origin.lat, longitude: origin.lon},
        'destination': {latitude: destination.lat, longitude: destination.lat},
        'earthRadius': this.props.options.units[this.props.options.activeUnit]
      };

      sendServerRequestWithBody('distance', tipConfigRequest, this.props.settings.serverPort)
      .then((response) => {
        if (schemaValidator(TIPDistanceSchema, response.body)){
            this.getRequest(response);
        } else {
            this.setState({
                errorMessage: this.props.createErrorBanner(
                    "Server Error", 500, `TIPDistance response from ${this.props.settings.serverPort} failed.`
                )
            });
        }
      });
    }
    else {
      this.setErrorBanner("Bad latitude or longitude format",400,this.props.settings.serverPort)
    }

  }

  componentDidMount(){
    this.updateStateWithCookieCoord();

    const origin = this.state.origin.latitude !== "" && this.state.origin.longitude !== "";
    const destination = this.state.destination.latitude !== "" && this.state.destination.longitude !== "";

    if (origin && destination){ this.calculateDistance(); }
  }




}

