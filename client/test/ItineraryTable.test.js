import {moveToFirst, moveUp, moveDown} from '../src/components/Application/Itinerary/ItineraryTable.js';
import {reverseItinerary, updateItinerary} from '../src/components/Application/Itinerary/ItineraryTable.js';
import {getCumulativeDistance, getTotalDistance} from '../src/components/Application/Itinerary/ItineraryTable.js';
import {updateDisplayMarker,deleteDisplayMarker} from '../src/components/Application/Itinerary/ItineraryTable.js';
//startProperties will change throughout the course of the test, so be aware of hardcoding expected values
const startProperties = {
    getItineraryData: (itineraryObject) => {},
    itinerary: {
        places: [
            {"name": "Denver", "latitude": "39.7", "longitude": "-105.0"},
            {"name": "Boulder", "latitude": "40.0", "longitude": "-105.4"},
            {"name": "Fort Collins", "latitude": "40.6", "longitude": "-105.1"},
            {"name": "somewhere", "latitude": "0", "longitude": "0"}
        ],
        distances: [24, 41, 59, 9999]
    },
    displayMarker:[],
    updateDisplayMarker: () => {}
};

function testUpdateItinerary () {
    let lastPlace = startProperties.itinerary.places[3];
    let lastDistance = startProperties.itinerary.distances[3];

    updateItinerary(startProperties, 0, 3);

    expect(startProperties.itinerary.places).not.toContain(lastPlace);
    expect(startProperties.itinerary.distances).not.toContain(lastDistance);
}

test('testing updateItinerary() function', testUpdateItinerary);

function testCumulativeDistance() {
    let cumulativeArray = [];
    getCumulativeDistance(startProperties.itinerary, cumulativeArray);

    expect(cumulativeArray).toEqual([24, 65, 124]);
}

test('testing getCumulativeDistance() function', testCumulativeDistance);

function testTotalDistance() {
    let totalSum = getTotalDistance(startProperties);

    expect(totalSum).toEqual(124);
}

test('testing getTotalDistance() function', testTotalDistance);

function testMoveToFirst() {
    moveToFirst(startProperties, 0, 2);
    expect(startProperties.itinerary.places[0].name).toBe("Fort Collins");
}

test('testing moveToFirst() function', testMoveToFirst);

function testMoveUp() {
    let secondPlace = startProperties.itinerary.places[1];
    moveUp(startProperties, 0, 1);
    expect(startProperties.itinerary.places[0]).toBe(secondPlace);
}

test('testing moveUp() function', testMoveUp);

function testMoveDown() {
    let secondPlace = startProperties.itinerary.places[1];
    moveDown(startProperties, 0, 1);
    expect(startProperties.itinerary.places[2]).toBe(secondPlace);
}

test('testing moveDown() function', testMoveDown);

function testReverseItinerary () {
    let indexOfLastPlace = startProperties.itinerary.places.length - 1;
    let indexOfLastDistance = startProperties.itinerary.distances.length - 1;
    let secondPlace = startProperties.itinerary.places[1];
    let secondDistance = startProperties.itinerary.distances[1];

    reverseItinerary(startProperties);

    expect(startProperties.itinerary.places[indexOfLastPlace - 1]).toBe(secondPlace);
    expect(startProperties.itinerary.distances[indexOfLastDistance - 1]).toBe(secondDistance);
}

test('testing reverseItinerary() function', testReverseItinerary);


function testUpdateDisplayMarker (){
    const place = {"name": "Denver", "latitude": "39.7", "longitude": "-105.0"};
    let displayMarker = updateDisplayMarker (startProperties,place);
    expect(displayMarker.length).toBe(1);
    displayMarker = updateDisplayMarker (startProperties,place);//toggle off
    expect(displayMarker.length).toBe(0);
}

test('testing updateDisplayMarker() function', testUpdateDisplayMarker);

function testDeleteDisplayMarker (){
    const place = {"name": "Denver", "latitude": "39.7", "longitude": "-105.0"};
    const displayMarker = deleteDisplayMarker(startProperties,place);
    expect(displayMarker.length).toBe(0);
}

test('testing deleteDisplayMarker() function', testDeleteDisplayMarker);