import React, {Component} from 'react';
import {Container, Row, Col, FormGroup, Form, Button} from 'reactstrap';
import Pane from '../Pane'
import ItineraryForm from "./ItineraryForm";
import ItineraryTable from   "./ItineraryTable";
import ItineraryMap from "./ItineraryMap"
import FindForm from '../Find/FindForm';
import FindTable from "../Find/FindTable";
import {sendServerRequestWithBody} from "../../../api/restfulAPI";
import ItineraryCustomInput from "./ItineraryCustomInput";
import saveItinerary from "./ItinerarySave";
import ItineraryOptions from "./ItineraryOptions";
import ItineraryOptimizationOptions from "./ItineraryOptimizationOptions";
import {schemaValidator} from "../SchemaValidation";
import TIPItinerarySchema from "../../../../../server/src/main/resources/TIPItinerarySchema.json";

/*
 * Renders the itinerary page.
 */
export default class Itinerary extends Component {

    constructor(props) {
        super(props);
        this.updateDisplay = this.updateDisplay.bind(this);
        this.updateDisplayMarker = this.updateDisplayMarker.bind(this);
        this.getItineraryData = this.getItineraryData.bind(this);
        this.renderItineraryForm = this.renderItineraryForm.bind(this);
        this.renderItineraryTable = this.renderItineraryTable.bind(this);
        this.renderItineraryCustomInput = this.renderItineraryCustomInput.bind(this);

        this.getFindData = this.getFindData.bind(this);
        this.renderFindForm = this.renderFindForm.bind(this);
        this.renderFindTable = this.renderFindTable.bind(this);
        this.calculateLegDistance = this.calculateLegDistance.bind(this);
        this.setErrorBanner = this.setErrorBanner.bind(this);

        this.state = {
            itinerary: props.itinerary,
            display:{itineraryTable: true, itineraryCustomInput: false, itineraryUpload: false, findForm:false, findTable:false },
            displayMarker: props.displayMarker,
            find:null,
            errorMessage: null
        };
        console.log(props.displayMarker);
        this.callCalcLegDistance();
    }

    render() {
        const allrenderMethods = [this.renderMap(),this.renderItineraryOptimizationOptions(),this.renderItineraryOptions(),this.renderFindForm(),this.renderFindTable(),this.renderItineraryForm(),
            this.renderItineraryCustomInput(),this.renderItineraryTable()];
        return (
            <div>
                {this.state.errorMessage}
                <Container>
                    {allrenderMethods.map((method,index) =>{
                        return(
                            <Row className = 'mb-4' key ={index}>
                                <Col xs={12}>
                                    {method}
                                </Col>
                            </Row>
                        )
                    })}

                </Container>
            </div>
        )
    }

    renderItineraryCustomInput (){
        if (this.state.display.itineraryCustomInput){
            return (
                <ItineraryCustomInput settings={this.props.settings}
                                      createErrorBanner={this.props.createErrorBanner}
                                      itinerary={this.state.itinerary}
                                      display = {this.state.display}
                                      updateDisplay = {this.updateDisplay}
                                      getItineraryData={this.getItineraryData}/>
            );

        }}

    renderMap() {
        return (
            <ItineraryMap title= "Itinerary Map" displayMarker = {this.state.displayMarker} places = {this.state.itinerary.places}/>

        );
    }

    renderItineraryOptions (){
        let buttons = [{name: "Save Itinerary", onClick:()=>saveItinerary(this.state.itinerary)},
            {name: "Add to Itinerary", onClick:() =>this.setState({display:{itineraryCustomInput: !this.state.display.itineraryCustomInput}})},
            {name: "Upload Itinerary", onClick:() =>this.setState({display:{itineraryUpload: !this.state.display.itineraryUpload}})},
            {name: "Find Place", onClick:() =>this.setState({display:{findForm: !this.state.display.findForm, findTable: !this.state.display.findTable}})}
        ];
        const allButtons = [];
        buttons.forEach((button) => {
            allButtons.push(<Button className={'btn-csu'} onClick={button.onClick}>{button.name}</Button>);
        });

        return (
            <ItineraryOptions allButtons = {allButtons}/>
        );
    };

    optimizeItinerary() {
        const itinerary = Object.assign({}, this.state.itinerary);
        itinerary.options.optimization = "short";
        this.getItineraryData(itinerary);
    }

    noneItinerary() {
        const itinerary = Object.assign({}, this.state.itinerary);
        itinerary.options.optimization = "none";
        this.getItineraryData(itinerary);
    }

    renderItineraryOptimizationOptions (){
        let buttons = [{name: "None", onClick:()=>this.noneItinerary()},

            {name: "Short", onClick:() => this.optimizeItinerary()}
        ];
        const allButtons = [];
        buttons.forEach((button) => {
            allButtons.push(<Button className={'btn-csu'} onClick={button.onClick}>{button.name}</Button>);
        });

        return (
            <ItineraryOptimizationOptions allButtons = {allButtons}/>
        );
    };

    renderItineraryForm() {
        if (this.state.display.itineraryUpload) {
            return (
                <Pane header={'Itinerary Upload'}>
                    {<ItineraryForm  settings = {this.props.settings}
                                     createErrorBanner={this.props.createErrorBanner}
                                     getItineraryData={this.getItineraryData}
                                     display = {this.state.display}
                                     updateDisplay = {this.updateDisplay}/>}
                </Pane>
            );
        }
    }

    renderFindForm() {
        if (this.state.display.findForm) {
            return (
                <Pane header={'FindForm'}>
                    {<FindForm settings = {this.props.settings}
                               createErrorBanner={this.props.createErrorBanner}
                               getFindData={this.getFindData}
                               display = {this.state.display}
                               updateDisplay = {this.updateDisplay}/>}
                </Pane>
            );
        }
    }

    renderFindTable(){
        if (this.state.find) {
            if(this.state.display.findTable){
                return (<FindTable settings={this.props.settings}
                                   createErrorBanner={this.props.createErrorBanner}
                                   find={this.state.find}
                                   itinerary={this.state.itinerary}
                                   getItineraryData={this.getItineraryData}/>)

            }
        }
    }

    renderItineraryTable(){
        return (<ItineraryTable settings = {this.props.settings}
                                createErrorBanner={this.props.createErrorBanner}
                                itinerary={this.state.itinerary}
                                getItineraryData={this.getItineraryData}
                                displayMarker = {this.state.displayMarker}
                                updateDisplayMarker ={this.updateDisplayMarker}
                                options={this.props.options}
        />)
    }

    setErrorBanner(statusText, statusCode, message) {
        //if message is set to null, then the error banner will be disabled
        if (message) {
            this.setState({errorMessage: this.props.createErrorBanner(statusText, statusCode, message)});
        } else {
            this.setState({errorMessage: null});
        }
    }

    getItineraryData(itinerary){
        this.setState({itinerary: itinerary},()=>{this.calculateLegDistance()});
    }

    updateDisplay(display){

        this.setState({display:display});
    }

    getFindData(find){

        this.setState({find: find});
    }
    updateDisplayMarker(displayMarker){
            //console.log(displayMarker);
            this.setState({displayMarker: displayMarker},()=>{this.props.updateDisplayMarker(this.state.displayMarker)});

    }

    callCalcLegDistance(){
        if(this.state.itinerary.distances.length === 0){
            return;
        } else {
            this.calculateLegDistance();
        }
    }

    calculateLegDistance () {
        let itineraryOptions = this.state.itinerary.options;
        itineraryOptions.earthRadius = this.props.options.units[this.props.options.activeUnit].toString();

        const tipLegDistanceRequest = {
            'requestType': 'itinerary',
            'requestVersion': this.state.itinerary.requestVersion,
            'options': itineraryOptions,
            'places': this.state.itinerary.places,
            'distances': []
        };

        sendServerRequestWithBody('itinerary', tipLegDistanceRequest, this.props.settings.serverPort)
            .then((response) => {
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    if (schemaValidator(TIPItinerarySchema, response.body)) {
                        const state = Object.assign({}, this.state);
                        state.itinerary.distances = response.body.distances;
                        state.itinerary.places = response.body.places;
                        state.itinerary.options.optimization = "none";
                        this.setState({errorMessage: null});
                        this.setState({itinerary: state.itinerary}, () => {
                            this.props.updateItinerary(this.state.itinerary)
                        });
                    } else {
                        this.setState({
                            errorMessage: this.props.createErrorBanner(
                                "Server Error",
                                500,
                                `Response from ${this.props.settings.serverPort} is an invalid schema.`
                            )
                        });
                    }
                }else {
                    this.setState({
                        errorMessage: this.props.createErrorBanner(
                            response.statusText,
                            response.statusCode,
                            `Request to ${this.props.settings.serverPort} failed.`
                        )
                    });
                }
            });
    }

}
