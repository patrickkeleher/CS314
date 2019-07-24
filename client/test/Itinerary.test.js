import './enzyme.config.js';
import React from 'react';
import {mount, shallow} from 'enzyme';
import Itinerary from '../src/components/Application/Itinerary/Itinerary';
import ItineraryTable from '../src/components/Application/Itinerary/ItineraryTable';
import ItineraryCustomInput from  '../src/components/Application/Itinerary/ItineraryCustomInput';
import ErrorBanner from '../src/components/Application/ErrorBanner';
import Geolocation from '../src/components/Application/Geolocation'
import {getOriginalServerPort} from '../src/api/restfulAPI';
import {Map, TileLayer} from "react-leaflet";
import ItineraryMap from '../src/components/Application/Itinerary/ItineraryMap';
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
    updateItinerary: () => {},
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

function mapExistenceTest() {
    const itinerary = mount(<Itinerary options={startProperties.planOptions}
                                       settings={startProperties.clientSettings}
                                       createErrorBanner={createErrorBanner}
                                       itinerary={startProperties.itinerary}
                                       updateItinerary={startProperties.updateItinerary}
                                       displayMarker={startProperties.displayMarker}
                                       updateDisplayMarker={startProperties.updateDisplayMarker}/>);

    expect(itinerary.contains(
        <ItineraryMap title = "Itinerary Map" displayMarker = {startProperties.displayMarker} places = {startProperties.itinerary.places}/>
    )).toEqual(true);
}

test('Testing the renderMap() function in the Itinerary component', mapExistenceTest);

function itineraryTableTest() {
    const itineraryData = {
        "itinerary": {
            "places": [
                {"name": "Denver", "latitude": "39.7", "longitude": "-105.0"},
                {"name": "Boulder", "latitude": "40.0", "longitude": "-105.4"},
                {"name": "Fort Collins", "latitude": "40.6", "longitude": "-105.1"}],
            "distances": [24, 41, 59]
        }
    };

    const itinerary = shallow(<Itinerary options={startProperties.planOptions}
                                       settings={startProperties.clientSettings}
                                       createErrorBanner={createErrorBanner}
                                         itinerary={startProperties.itinerary}
                                         updateItinerary={startProperties.updateItinerary}
                                         displayMarker={startProperties.displayMarker}
                                         updateDisplayMarker={startProperties.updateDisplayMarker}/>);

    itinerary.setState(itineraryData);
    itinerary.update();

    expect(itinerary.containsMatchingElement(<ItineraryTable/>)).toEqual(true);
}

test('Testing that the itineraryTable component gets rendered', itineraryTableTest);

function itineraryCustomInput () {
    const itineraryData = {
        itinerary: {requestVersion: 3,
            requestType: 'itinerary',
            options: {"title":"My Trip",
                "earthRadius":"3958.761316","optimization":"none" },
            places: [],
            distances: [],
        },
        find:null,
        errorMessage: null
    };



    const itinerary = shallow(<Itinerary options={startProperties.planOptions}
                                         settings={startProperties.clientSettings}
                                         createErrorBanner={createErrorBanner}
                                         itinerary={startProperties.itinerary}
                                         updateItinerary={startProperties.updateItinerary}/>);

    itinerary.setState(itineraryData);
    itinerary.update();

    expect(itinerary.containsMatchingElement(<ItineraryCustomInput />)).toEqual(false);
}

test('Testing that the itineraryCustomInput component gets rendered', itineraryCustomInput );
