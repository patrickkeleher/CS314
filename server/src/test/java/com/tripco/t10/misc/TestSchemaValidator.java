package com.tripco.t10.misc;

import org.json.JSONObject;
import org.junit.Test;

import static org.junit.Assert.*;

public class TestSchemaValidator {

    public void configBadResponseSchemaTest() {
        //this test produces several error messages, add the @Test annotation if you would like to run this test
        SchemaValidator sv = new SchemaValidator();
        try {
            JSONObject badConfigResponse = new JSONObject("{}");
            sv.performValidation(badConfigResponse, "/TIPConfigSchema.json");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            assertFalse(sv.isValid);
        }
    }

    @Test
    public void configGoodResponseSchemaTest() {
        SchemaValidator sv = new SchemaValidator();
        try {
            String configResponse = "{" +
                    "\"requestType\"        : \"config\"," +
                    "\"requestVersion\"     : 4," +
                    "\"serverName\"         : \"t## name\"," +
                    "\"placeAttributes\"    : [\"name\", \"latitude\", \"longitude\", \"id\", \"municipality\", \"region\", \"country\", \"continent\", \"altitude\"]," +
                    "\"optimizations\"      : [\"none\", \"short\", \"shorter\"]," +
                    "\"filters\"            : [{\"name\": \"type\"," +
                    "\"values\": [\"airport\",\"heliport\",\"balloonport\",\"closed\"]}" +
                    "]," +
                    "}";
            JSONObject goodConfigResponse = new JSONObject(configResponse);
            sv.performValidation(goodConfigResponse, "/TIPConfigSchema.json");
        } catch (Exception e) {
            e.printStackTrace();
            fail();
        } finally {
            assertTrue(sv.isValid);
        }
    }

    @Test
    public void distanceGoodRequestSchemaTest() {
        SchemaValidator sv = new SchemaValidator();
        try {
            String distanceRequest = "{" +
                    "\"requestType\"    : \"distance\"," +
                    "\"requestVersion\" : 4," +
                    "\"origin\"         : {\"latitude\":  \"40.6\", \"longitude\": \"-105.1\", \"name\":\"Fort Collins, Colorado, USA\"}," +
                    "\"destination\"    : {\"latitude\": \"-33.9\", \"longitude\":  \"151.2\", \"name\":\"Sydney, New South Wales, Australia\"}," +
                    "\"earthRadius\"    : 3958.8," +
                    "}";
            JSONObject goodDistanceRequest = new JSONObject(distanceRequest);
            sv.performValidation(goodDistanceRequest, "/TIPDistanceSchema.json");
            assertTrue(sv.isValid);
        } catch (Exception e) {
            e.printStackTrace();
            fail();
        } finally {
            assertTrue(sv.isValid);
        }
    }

    @Test
    public void itineraryGoodRequestSchemaTest() {
        SchemaValidator sv = new SchemaValidator();
        try {
            String itineraryRequest = "{" +
                    "\"requestType\"    : \"itinerary\"," +
                    "\"requestVersion\" : 4," +
                    "\"options\"        : { \"title\":\"My Trip\"," +
                    "\"earthRadius\":\"3958.8\"," +
                    "\"optimization\":\"none\" }," +
                    "\"places\"         : [{\"name\":\"Denver\",       \"latitude\": \"39.7\", \"longitude\": \"-105.0\"}," +
                    "{\"name\":\"Boulder\",      \"latitude\": \"40.0\", \"longitude\": \"-105.4\"}," +
                    "{\"name\":\"Fort Collins\", \"latitude\": \"40.6\", \"longitude\": \"-105.1\"}]" +
                    "}";
            JSONObject goodItineraryRequest = new JSONObject(itineraryRequest);
            sv.performValidation(goodItineraryRequest, "/TIPItinerarySchema.json");
            assertTrue(sv.isValid);
        } catch (Exception e) {
            e.printStackTrace();
            fail();
        } finally {
            assertTrue(sv.isValid);
        }
    }

    @Test
    public void findGoodRequestSchemaTest() {
        SchemaValidator sv = new SchemaValidator();
        try {
            String findRequest = "{" +
                    "\"requestType\"    :\"find\"," +
                    "\"requestVersion\" :4," +
                    "\"match\"          :\"fort collins\"," +
                    "\"narrow\"         :[]" +
            "}";
            JSONObject goodFindRequest = new JSONObject(findRequest);
            sv.performValidation(goodFindRequest, "/TIPFindSchema.json");
            assertTrue(sv.isValid);
        } catch (Exception e) {
            e.printStackTrace();
            fail();
        } finally {
            assertTrue(sv.isValid);
        }
    }
}