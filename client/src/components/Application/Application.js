import React, {Component} from 'react';
import {Container} from 'reactstrap';

import Home from './Home';
import Options from './Options/Options';
import Calculator from './Calculator/Calculator';
import Settings from './Settings/Settings';
import {getOriginalServerPort, sendServerRequest} from '../../api/restfulAPI';
import ErrorBanner from './ErrorBanner';
import About from './About/About';
import Itinerary from "./Itinerary/Itinerary";
import Cookies from "js-cookie";


/* Renders the application.
 * Holds the destinations and options state shared with the trip.
 */
export default class Application extends Component {
  constructor(props){
    super(props);
    this.updateItinerary = this.updateItinerary.bind(this);
    this.updateDisplayMarker = this.updateDisplayMarker.bind(this);
    this.updatePlanOption = this.updatePlanOption.bind(this);
    this.updateClientSetting = this.updateClientSetting.bind(this);
    this.createApplicationPage = this.createApplicationPage.bind(this);
    this.addUnit = this.addUnit.bind(this);
    this.updateStateWithCookies = this.updateStateWithCookies.bind(this);

    this.state = {
      serverConfig: null,
      planOptions: {
        units: {'miles':3959, 'kilometers': 6371, 'nautical miles': 3440},
        activeUnit: 'miles'
      },
      clientSettings: {
        serverPort: getOriginalServerPort()
      },
      errorMessage: null,
      itinerary: {requestVersion: 4,
        requestType: 'itinerary',
        options: {"title":"My Trip",
          "earthRadius":"3958.761316","optimization":"none" },
        places: [],
        distances: [],
      },
      displayMarker:[]
    };

    this.updateStateWithCookies();
    this.updateServerConfig();
  }

  render() {
    let pageToRender = this.state.serverConfig ? this.props.page : 'settings';

    return (
      <div className='application-width'>
        { this.state.errorMessage }{ this.createApplicationPage(pageToRender) }
      </div>
    );
  }

  addUnit (data)  {
  //console.log(data);
  let jasper = Object.assign(this.state.planOptions.units, data);
  Cookies.set('units',jasper);
  Cookies.set('activeUnit', this.state.planOptions.activeUnit);
  this.setState({jasper});
}

  updateClientSetting(field, value) {
    if(field === 'serverPort')
      this.setState({clientSettings: {serverPort: value}}, this.updateServerConfig);
    else {
      let newSettings = Object.assign({}, this.state.planOptions);
      newSettings[field] = value;
      this.setState({clientSettings: newSettings});
    }
  }

  updatePlanOption(option, value) {
    let optionsCopy = Object.assign({}, this.state.planOptions);
    optionsCopy[option] = value;
    this.setState({'planOptions': optionsCopy});
  }

  updateServerConfig() {
    sendServerRequest('config', this.state.clientSettings.serverPort).then(config => {
      console.log(config);
      this.processConfigResponse(config);
    });
  }

  updateItinerary(itinerary){

    this.setState({'itinerary': itinerary});
  }

  updateDisplayMarker(displayMarker){

    this.setState({'displayMarker': displayMarker});
  }

  updateStateWithCookies(){
    let stateData = Object.assign({},this.state);

    if (Cookies.get().hasOwnProperty('units')
        && Cookies.get().hasOwnProperty('activeUnit')) {
      stateData.planOptions.units = JSON.parse(Cookies.get('units'));
      stateData.planOptions.activeUnit =Cookies.get('activeUnit');
      this.setState({stateData});
    }
  }

  createErrorBanner(statusText, statusCode, message) {
    return (
      <ErrorBanner statusText={statusText}
                   statusCode={statusCode}
                   message={message}/>
    );
  }

  createApplicationPage(pageToRender) {
    switch(pageToRender) {
      case 'about':
        return <About options={this.state.planOptions}
                      settings={this.state.clientSettings}
                      createErrorBanner={this.createErrorBanner}/>;
      case 'calc':
        return <Calculator options={this.state.planOptions}
                           settings={this.state.clientSettings}
                           createErrorBanner={this.createErrorBanner}/>;
      case 'itinerary':
        return <Itinerary options={this.state.planOptions}
                          settings={this.state.clientSettings}
                          createErrorBanner={this.createErrorBanner}
                          itinerary={this.state.itinerary}
                          updateItinerary={this.updateItinerary}
                          displayMarker={this.state.displayMarker}
                          updateDisplayMarker ={this.updateDisplayMarker}/>;
      case 'options':
        return <Options options={this.state.planOptions}
                        config={this.state.serverConfig}
                        updateOption={this.updatePlanOption}
                        addUnit={this.addUnit}/>;
      case 'settings':
        return <Settings settings={this.state.clientSettings}
                         serverConfig={this.state.serverConfig}
                         updateSetting={this.updateClientSetting}/>;
      default:
        return <Home settings={this.state.clientSettings}
                     createErrorBanner={this.createErrorBanner}
        />;
    }
  }

  processConfigResponse(config) {
    if(config.statusCode >= 200 && config.statusCode <= 299) {
      console.log("Switching to server ", this.state.clientSettings.serverPort);
      this.setState({
        serverConfig: config.body,
        errorMessage: null
      });
    }
    else {
      this.setState({
        serverConfig: null,
        errorMessage:
          <Container>
            {this.createErrorBanner(config.statusText, config.statusCode,
            `Failed to fetch config from ${ this.state.clientSettings.serverPort}. Please choose a valid server.`)}
          </Container>
      });
    }
  }
}
