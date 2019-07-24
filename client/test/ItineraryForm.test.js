import './enzyme.config.js';
import React from 'react';
import {mount, shallow} from 'enzyme';
import ErrorBanner from '../src/components/Application/ErrorBanner';

import {getOriginalServerPort} from '../src/api/restfulAPI';
import ItineraryForm from "../src/components/Application/Itinerary/ItineraryForm";


const startProperties = {
  serverConfig: null,
  planOptions: {
    units: {'miles':3959, 'kilometers': 6371, 'nautical miles': 3440},
    activeUnit: 'miles'
  },
  clientSettings: {
    serverPort: getOriginalServerPort()
  },
  errorMessage: null,
  getItineraryData: () => {},
  display: () => {},
  updateDisplay: () => {}
};

function createErrorBanner(statusText, statusCode, message) {
  return (
      <ErrorBanner statusText={statusText}
                   statusCode={statusCode}
                   message={message}/>
  );
}

function itineraryFormTest() {

  const itineraryForm = shallow(<ItineraryForm settings={startProperties.settings}
                                     createErrorBanner={createErrorBanner}
                                     getItineraryData={startProperties.getItineraryData}
                                     display={startProperties.display}
                                     updateDisplay={startProperties.updateDisplay}
  />);
  expect(itineraryForm.find('Form')).toHaveLength(1);
}

test('Testing that the itineraryForm component gets rendered', itineraryFormTest);