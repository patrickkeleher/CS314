
import { isValidLatLon,parseLatLon,checkValidLatLonRange} from '../src/api/checkLatLon'



function checkCoordinates() {

  expect(isValidLatLon("5","10")).toBe(true);
  expect(isValidLatLon("garbage","value")).toBe(false);
  expect(isValidLatLon("900","2")).toBe(false);
  expect(isValidLatLon("39.87","yy")).toBe(false);

}

test('Testing that the coordinate are valid', checkCoordinates);

function checkParseCoordinates() {

  expect(parseLatLon("59°12\'7.7“N","02°15\'39.6“W")).toEqual({"lat": "59.20213888888889", "lon": "-2.261"});

}
test('Testing that the coordinate are parsed', checkParseCoordinates);

function testValidLatLonRange () {
  expect(checkValidLatLonRange("5","10")).toBe(true);
  expect(checkValidLatLonRange("500","1")).toBe(false);
}

test('Testing that the coordinate range are correct',  testValidLatLonRange);