import './enzyme.config.js';
import React from 'react';
import {mount, shallow} from 'enzyme';
import {updateItinerary,generateTableData} from '../src/components/Application/Find/FindTable.js';
import FindTable from "../src/components/Application/Find/FindTable";
import {Table} from "reactstrap"
import ErrorBanner from "./Calculator.test";
const startProperties = {
  getItineraryData: (itineraryObject) => {},
  itinerary: {
    places: [
      {"name": "Denver", "latitude": "39.7", "longitude": "-105.0"},
      {"name": "Boulder", "latitude": "40.0", "longitude": "-105.4"},


    ],
    distances: [24, 41]
  },
  find:{places: [
      {"name": "Denver", "latitude": "39.7", "longitude": "-105.0"},
      {"name": "Boulder", "latitude": "40.0", "longitude": "-105.4"},


    ]},
  'clientSettings': {
    'serverPort': 'black-bottle.cs.colostate.edu:31400'
  },

};

function testUpdateItinerary () {
  let place =  {"name": "somewhere", "latitude": "0", "longitude": "0"};


  const updatedPlace = updateItinerary(startProperties, place);
  expect(updatedPlace.places.length).toBe(3);


}

test('testing updateItinerary() function', testUpdateItinerary);

function testGenerateTableData () {

const tableData = generateTableData(startProperties);
  expect(tableData.length).toBe(2)



}

test('testing testGenerateTableData() function', testGenerateTableData );

function testFindTableRender () {
  const findTable = mount(<FindTable settings={startProperties.clientSettings}
                                              createErrorBanner={createErrorBanner}
                                              find={startProperties.find}
                                              itinerary={startProperties.itinerary}
                                              getItineraryData={startProperties.getItineraryData}/>);
  expect( findTable .find('Table').length).toEqual(1);
}

test('Testing if table component exists', testFindTableRender);

function createErrorBanner(statusText, statusCode, message) {
  return (
      <ErrorBanner statusText={statusText}
                   statusCode={statusCode}
                   message={message}/>
  );
}