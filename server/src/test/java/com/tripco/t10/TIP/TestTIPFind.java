package com.tripco.t10.TIP;

import com.google.gson.JsonObject;
import org.apache.commons.lang.ObjectUtils;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;

import static org.junit.Assert.assertEquals;

/** Verifies the operation of the TIP config class and its buildResponse method.
 */
public class TestTIPFind {
    public String match;
    public int limit;
    public ArrayList<JsonObject> itemsExpected;

    public JsonObject makeObject(String WorldID, String RegionID, String CountryID,
                                 String ContinentID, String name, String municipality,
                                 String latitude, String longitude, String region,
                                 String country, String continent){
        JsonObject item = new JsonObject();

        item.addProperty("WorldID", WorldID);
        item.addProperty("RegionID", RegionID);
        item.addProperty("CountryID", CountryID);
        item.addProperty("ContinentID", ContinentID);

        item.addProperty("name", name);
        item.addProperty("municipality", municipality);
        item.addProperty("latitude", latitude);
        item.addProperty("longitude", longitude);
        item.addProperty("region", region);
        item.addProperty("country", country);
        item.addProperty("continent", continent);

        return item;
    }

    @Before
    public void makeExpected(){
        itemsExpected = new ArrayList<>();
    }
    //Connection for Database
    private String myDriver = "com.mysql.jdbc.Driver";
    private String url;
    private String user="cs314-db";
    private String pass="eiK5liet1uej";

    @Test
    public void testResponse() {
        match = "Frankend";
        limit = 0;

        TIPFind find = new TIPFind(match, limit);
        find.buildResponse();

        itemsExpected.add(makeObject("DE-0349", "DE-BY", "DE", "EU",
                "Frankendorf UL", null, "49.8365058", "11.0890816",
                "Bavaria", "Germany", "Europe"));

        assertEquals("Expected number of items found", 1, find.getFound());
        assertEquals("Expected places to be found", itemsExpected, find.getPlaces());
        assertEquals("Expected match", "Frankend", find.getMatch());
        assertEquals("Expected limit", 0, find.getLimit());
    }

    @Test
    public void testWithoutLimit() {
        match = "Frankend";

        TIPFind find = new TIPFind(match);
        find.buildResponse();
        itemsExpected.add(makeObject("DE-0349", "DE-BY", "DE", "EU",
                "Frankendorf UL", null, "49.8365058", "11.0890816",
                "Bavaria", "Germany", "Europe"));

        assertEquals("Expected number of items found", 1, find.getFound());
        assertEquals("Expected places to be found", itemsExpected, find.getPlaces());
        assertEquals("Expected match", "Frankend", find.getMatch());
        assertEquals("Expected limit", 0, find.getLimit());
    }

    @Test
    public void testWithSpecificLimit() {
        match = "fort";

        TIPFind find = new TIPFind(match, 1);
        find.buildResponse();
        itemsExpected.add(makeObject("NA-0148", "NA-OH", "NA", "AF",
                "Fortuna Landing Site", null, "-21.808332443237305", "19.90833282470703",
                "Omaheke Region", "Namibia", "Africa"));

        assertEquals("Expected number of items found", 466, find.getFound());
        assertEquals("Expected match", "fort", find.getMatch());
        assertEquals("Expected limit", 1, find.getLimit());
        assertEquals("Same items exist", itemsExpected, find.getPlaces());
    }

    @Test
    public void testMatchWithSpecialChar() {
        match = "Oxfor&";

        TIPFind find = new TIPFind(match, 1);
        find.buildResponse();
        itemsExpected.add(makeObject("BW-0011", "BW-KG", "BW", "AF",
                "Oxford Airport", "Oxford", "-25.0243", "24.215",
                "Kgalagadi District", "Botswana", "Africa"));

        assertEquals("Expected number of items found", 28, find.getFound());
        assertEquals("Expected match", "Oxfor_", find.getMatch());
        assertEquals("Expected limit", 1, find.getLimit());
        assertEquals("Same items exist", itemsExpected, find.getPlaces());
    }

    @Test
    public void testWithDifferentLimit() {
        match = "fort";

        TIPFind find = new TIPFind(match, 3);
        find.buildResponse();
        itemsExpected.add(makeObject("NA-0148", "NA-OH", "NA", "AF",
                "Fortuna Landing Site", null, "-21.808332443237305", "19.90833282470703",
                "Omaheke Region", "Namibia", "Africa"));
        itemsExpected.add(makeObject("FAFO", "ZA-EC", "ZA", "AF",
                "Fort Beaufort Airport", "Fort Beaufort", "-32.79050064086914", "26.577699661254883",
                "Eastern Cape", "South Africa", "Africa"));
        itemsExpected.add(makeObject("ZA-0011", "ZA-FS", "ZA", "AF",
                "Brandfort Airport", "Brandfort", "-28.690399169921875", "26.420799255371094",
                "Free State", "South Africa", "Africa"));

        assertEquals("Expected number of items found", 466, find.getFound());
        assertEquals("Expected places to be found", itemsExpected, find.getPlaces());
    }
}