import {schemaValidator} from "../src/components/Application/SchemaValidation.js";
import TIPItinerarySchema from "../../server/src/main/resources/TIPItinerarySchema.json";
import TIPConfigSchema from "../../server/src/main/resources/TIPConfigSchema.json";
import TIPDistanceSchema from "../../server/src/main/resources/TIPDistanceSchema.json";
import TIPFindSchema from "../../server/src/main/resources/TIPFindSchema.json";

const startProperties = {
    "config": {
        "requestType"        : "config",
        "requestVersion"     : 5,
        "serverName"         : "t## name",
        "placeAttributes"    : ["name", "latitude", "longitude", "id", "municipality", "region", "country", "continent", "altitude"],
        "optimizations"      : ["none", "short", "shorter", "shortest"],
        "filters"            : [{"name": "type",
            "values": ["airport","heliport","balloonport","closed"]},
        ]
    },
    "distance": {
        "requestType"    : "distance",
        "requestVersion" : 5,
        "origin"         : {"latitude":  "40.6", "longitude": "-105.1", "name":"Fort Collins, Colorado, USA"},
        "destination"    : {"latitude": "-33.9", "longitude":  "151.2", "name":"Sydney, New South Wales, Australia"},
        "earthRadius"    : 3958.8,
        "distance"       : 0
    },
    "itinerary": {
        "requestType"    : "itinerary",
        "requestVersion" : 5,
        "options"        : { "title":"My Trip",
            "earthRadius":"3958.8",
            "optimization":"none" },
        "places"         : [{"name":"Denver",       "latitude": "39.7", "longitude": "-105.0"},
            {"name":"Boulder",      "latitude": "40.0", "longitude": "-105.4"},
            {"name":"Fort Collins", "latitude": "40.6", "longitude": "-105.1"}],
        "distances"      : [24, 41, 59]
    },
    "find": {
        "requestType"    : "find",
        "requestVersion" : 5,
        "match"          : "fort collins",
        "narrow"         : [{"name":"type", "values":["airport","heliport"]}],
        "limit"          : 1,
        "found"          : 123,
        "places"         : [{"name":"Fort Collins", "latitude": "40.6", "longitude": "-105.1"}]
    }
}

function validItinerary() {
    expect(schemaValidator(TIPItinerarySchema, startProperties.itinerary)).toEqual(true);
}

test("testing schemaValidator() with itinerary response", validItinerary);

function validConfig() {
    expect(schemaValidator(TIPConfigSchema, startProperties.config)).toEqual(true);
}

test("testing schemaValidator() with config response", validConfig);

function validDistance() {
    expect(schemaValidator(TIPDistanceSchema, startProperties.distance)).toEqual(true);
}

test("testing schemaValidator() with distance response", validDistance);

function validFind() {
    expect(schemaValidator(TIPFindSchema, startProperties.find)).toEqual(true);
}

test("testing schemaValidator() with find response", validFind);