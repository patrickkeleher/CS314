import './enzyme.config.js';
import React from 'react';
import {mount, shallow} from 'enzyme';
import Itinerary from '../src/components/Application/Itinerary/Itinerary';
import ItineraryCustomInput from  '../src/components/Application/Itinerary/ItineraryCustomInput';
import ErrorBanner from '../src/components/Application/ErrorBanner';
import {getOriginalServerPort} from '../src/api/restfulAPI';
import {hideForm, updateItinerary} from  '../src/components/Application/Itinerary/ItineraryCustomInput';

let startProperties = {
  serverConfig: null,
  planOptions: {
    units: {'miles':3959, 'kilometers': 6371, 'nautical miles': 3440},
    activeUnit: 'miles'
  },
  clientSettings: {
    serverPort: getOriginalServerPort()
  },
  errorMessage: null,
  itinerary: {requestVersion: 3,
    requestType: 'itinerary',
    options: {"title":"My Trip",
      "earthRadius":"3958.761316","optimization":"none" },
    places: [],
    distances: [],
  },
  display:{ itineraryCustomInput: true},
  updateItinerary: () => {},
  getItineraryData: () => {},
  updateDisplay: () => {},
  displayMarker: [],
  updateDisplayMarker: () => {}
};

function createErrorBanner(statusText, statusCode, message) {
  return (
      <ErrorBanner statusText={statusText}
                   statusCode={statusCode}
                   message={message}/>
  );
}

function itineraryCustomInputTest() {


  const itinerary = mount(<Itinerary options={startProperties.planOptions}
                                       settings={startProperties.clientSettings}
                                       createErrorBanner={createErrorBanner}
                                     itinerary={startProperties.itinerary}
                                     updateItinerary={startProperties.updateItinerary}
                                     displayMarker={startProperties.displayMarker}
                                     updateDisplayMarker={startProperties.updateDisplayMarker}/>);

  const defaultPlaceSize = itinerary.state().itinerary.places.length;

  const itineraryCustomInput = mount (<ItineraryCustomInput settings = {startProperties.clientSettings}
                        createErrorBanner={createErrorBanner}
                        itinerary = {itinerary.state().itinerary}
                        updateDisplay = {()=>{}}
                        getItineraryData={()=>{}}/>);

  expect(defaultPlaceSize).toEqual(0);

  const numForm = itineraryCustomInput.find('Form');
  const numFormGroup = itineraryCustomInput.find('FormGroup');
  const numInput = itineraryCustomInput.find('Input');

  expect(numForm).toHaveLength(1);
  expect(numFormGroup).toHaveLength(5);
  expect(numInput).toHaveLength(3);



}

test('Testing that the ItineraryCustom component updates main Itinerary',  itineraryCustomInputTest);

function testUpdateItinerary(){
  let place ={"name": "test", "latitude": "5", "longitude": "10"};
 updateItinerary(startProperties,place);
 expect(startProperties.itinerary.places).toContain(place);
}

test('Testing that the UpdateItinerary works',  testUpdateItinerary);

function testHideForm() {
  const displayResult = hideForm(startProperties);
  expect(displayResult.itineraryCustomInput).toEqual(false);
}
test("Testing that the hideForm works",testHideForm);
