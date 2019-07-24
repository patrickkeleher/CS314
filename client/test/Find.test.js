import './enzyme.config.js';
import React from 'react';
import {mount, shallow} from 'enzyme';
import Itinerary from '../src/components/Application/Itinerary/Itinerary';

import FindTable from '../src/components/Application/Find/FindTable';
import ErrorBanner from '../src/components/Application/ErrorBanner';

import {getOriginalServerPort} from '../src/api/restfulAPI';


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
  itinerary: {requestVersion: 3,
    requestType: 'itinerary',
    options: {"title":"My Trip",
      "earthRadius":"3958.761316","optimization":"none" },
    places: [],
    distances: [],
  },
  updateItinerary: () => {}
};

function createErrorBanner(statusText, statusCode, message) {
  return (
      <ErrorBanner statusText={statusText}
                   statusCode={statusCode}
                   message={message}/>
  );
}

function findTableTest() {
  const findData = {
    "find": {
      match: "Denver",
      limit: 10,
      found: 0,
      places: []
    }
  };

  const find = shallow(<Itinerary options={startProperties.planOptions}
                                  settings={startProperties.clientSettings}
                                  createErrorBanner={createErrorBanner}
                                  itinerary={startProperties.itinerary}
                                  updateItinerary={startProperties.updateItinerary}/>);

  find.setState(findData);
  find.update();

  expect(find.containsMatchingElement(<FindTable/>)).toEqual(false);
}

test('Testing that the findTable component gets rendered', findTableTest);