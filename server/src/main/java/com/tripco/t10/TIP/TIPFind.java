package com.tripco.t10.TIP;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;

public class TIPFind extends TIPHeader{
    private final transient Logger log = LoggerFactory.getLogger(TIPFind.class);

    //TIP objects
    /*
        match is required value set by client to lookup similar strings in database
        limit is optional value set by client to choose how many to
     */
    private String match;
    private int limit = 0;
    private int found;
    private List<JsonObject> places = new ArrayList<>();
    private List<JsonObject> narrow = new ArrayList<>();

    public String getMatch() {
        return match;
    }

    public void setMatch(String match) {
        this.match = match;
    }

    public int getLimit() {
        return limit;
    }

    public int getFound() {
        return found;
    }

    public List<JsonObject> getPlaces() {
        return places;
    }

    //Constructors
    private TIPFind(){
        this.requestType = "find";
        this.requestVersion = 3;
    }

    TIPFind(String match, int limit){
        this();
        this.match = match;
        this.limit = limit;
        this.narrow = new ArrayList<>();
    }

    TIPFind(String match, int limit, ArrayList<JsonObject> narrow){
        this();
        this.match = match;
        this.limit = limit;
        this.narrow = narrow;
    }

    TIPFind(String match, ArrayList<JsonObject> narrow){
        this();
        this.match = match;
        this.narrow = narrow;
    }

    TIPFind(String match){
        this();
        this.match = match;
        this.narrow = new ArrayList<>();
    }

    private String setDBConnection(String url){
        String isTravis = System.getenv("TRAVIS");
        String isDevelopment = System.getenv("CS314_ENV");

        //running build on travis
        if(isTravis != null && isTravis.equals("true")) {
            url = "jdbc:mysql://127.0.0.1/cs314";
        }
        //running on own machine and connecting through a tunnel
        else if(isDevelopment != null && isDevelopment.equals("development")){
            url = "jdbc:mysql://127.0.0.1:56247/cs314";
        }
        //running against production database directly (on campus)
        else {
            url = "jdbc:mysql://faure.cs.colostate.edu/cs314";
        }
        return url;
    }

    private String searchCases(String search, String limiter){
        if(limit > 0){
            return search + limiter;
        } else if(limit == 0){
            return search;
        } else {
            System.err.println("Limit must be an integer of zero or greater.");
            return "Search failed";
        }
    }

    private void checkMatch(){
        //Checks if alphanumeric
        char[] matchArr = match.toCharArray();
        if(!match.matches("^[a-zA-Z0-9]+$")){
            for(int i = 0; i < matchArr.length; ++i){
                if(!Character.isLetterOrDigit(matchArr[i])){
                    matchArr[i] = '_';
                }
            }
        }
        match = String.valueOf(matchArr);
    }

    private String setSearch(String filter) {
        String select = "SELECT world.name as \"World\", world.id as \"WorldID\", "
                + "world.latitude, world.longitude, world.municipality, "
                + "region.name as \"Region\", region.id as \"RegionID\", "
                + "country.name as \"Country\", country.id as \"CountryID\","
                + "continent.name as \"Continent\", continent.id as \"ContinentID\"";
        String from = "FROM continent "
                + "INNER JOIN country ON continent.id = country.continent "
                + "INNER JOIN region ON country.id = region.iso_country "
                + "INNER JOIN world ON region.id = world.iso_region ";
        String where = "WHERE (country.name LIKE \"%" + match
                + "%\" OR country.id LIKE \"%" + match
                + "%\" OR region.name LIKE \"%" + match
                + "%\" OR region.id LIKE \"%" + match
                + "%\" OR world.name LIKE \"%" + match
                + "%\" OR world.id LIKE \"%" + match
                + "%\" OR world.municipality LIKE \"%" + match + "%\")";

        if(!filter.equals("")){
            where += filter;
        }

        String order = "ORDER BY continent.name, country.name, "
                + "region.name, world.municipality, world.name ASC ";
        String limiter = "limit " + limit;
        return searchCases(select + from + where + order, limiter);
    }

    private String setCount(){
        String select = "SELECT COUNT(*) ";
        String from = "FROM continent "
                + "INNER JOIN country ON continent.id = country.continent "
                + "INNER JOIN region ON country.id = region.iso_country "
                + "INNER JOIN world ON region.id = world.iso_region ";
        String where = "WHERE (country.name LIKE \"%" + match
                + "%\" OR country.id LIKE \"%" + match
                + "%\" OR region.name LIKE \"%" + match
                + "%\" OR region.id LIKE \"%" + match
                + "%\" OR world.name LIKE \"%" + match
                + "%\" OR world.id LIKE \"%" + match
                + "%\" OR world.municipality LIKE \"%" + match + "%\")";

        return select + from + where;
    }

    private boolean checkNarrow(){
        if(narrow.isEmpty()){
            return false;
        }
        String checkNarrow = narrow.get(0).get("values").toString();
        log.info(checkNarrow);
        if(checkNarrow.isEmpty() || checkNarrow.equals("[]")){
            log.info("Narrows empty");
            return false;
        }
        log.info("Narrows not empty");
        return true;
    }

    private ArrayList<String> extractFilter(){
        ArrayList<String> filters = new ArrayList<>();
        for(int i = 0; i < narrow.size(); ++i){
            String values = narrow.get(i).get("values").toString();
            String[] parts = values.split("\"");
            for(int j = 0; j < parts.length; ++j){
                parts[j] = parts[j].replaceAll("\\\\", "");
                if(parts[j].length() > 1) {
                    if(parts[j].equals("Seaplane Base")){
                        parts[j] = "Seaplane_Base";
                    }
                    filters.add(parts[j]);
                }
            }
        }
        return filters;
    }

    //narrow in format narrow=[{"name":"type", "values":["airport", "helioport"]}
    //taken from https://github.com/csucs314s19/tripco/blob/master/guides/database/DatabaseGuide.md
    private void addInfo() {
        String myDriver = "com.mysql.jdbc.Driver", url = "", user="cs314-db", pass="eiK5liet1uej";
        url = setDBConnection(url);

        String isTravis = System.getenv("TRAVIS");
        if(isTravis != null && isTravis.equals("true")) {
            user = "travis"; pass = null;
        }

        String count, search;
        checkMatch();
        ArrayList<String> filters = extractFilter();
        String selectByFilter = "AND (type IN (";
        for(int i = 0; i < filters.size(); ++i){
            selectByFilter += "\"" + filters.get(i) + "\"";
            if(i != filters.size()-1){
                selectByFilter += ",";
            }
        }
        selectByFilter += "))";

        if(checkNarrow()){
            count = setCount() + selectByFilter;
            search = setSearch(selectByFilter);
        } else {
            count = setCount();
            search = setSearch("");
        }

        try {
            Class.forName(myDriver);
            // connect to the database and query

            try {
                Connection conn = DriverManager.getConnection(url, user, pass);

                Statement stCount = conn.createStatement();
                Statement stQuery = conn.createStatement();
                ResultSet rsCount = stCount.executeQuery(count);
                ResultSet rsQuery = stQuery.executeQuery(search);
                setFound(rsCount);
                setPlaces(rsQuery);
            } catch (Exception e) {
                System.err.println("Exception, connection failure: " + e.getMessage());
            }
        } catch (Exception e) {
            System.err.println("Exception, driver failure: " + e.getMessage());
        }
    }

    private void setFound(ResultSet rsCount) throws SQLException{
        rsCount.next();
        found = rsCount.getInt(1);
    }

    private void addProperties(String WorldID, String RegionID, String CountryID,
                               String ContinentID, String name, String municipality,
                               String latitude, String longitude, String region,
                               String country, String continent){
        JsonObject place = new JsonObject();
        place.addProperty("WorldID", WorldID);
        place.addProperty("RegionID", RegionID);
        place.addProperty("CountryID", CountryID);
        place.addProperty("ContinentID", ContinentID);

        place.addProperty("name", name);
        place.addProperty("municipality", municipality);
        place.addProperty("latitude", latitude);
        place.addProperty("longitude", longitude);
        place.addProperty("region", region);
        place.addProperty("country", country);
        place.addProperty("continent", continent);

        places.add(place);
    }

    private void setPlaces(ResultSet rsQuery) throws SQLException{
        while (rsQuery.next()) {

            String WorldID = rsQuery.getString("WorldID");
            String RegionID = rsQuery.getString("RegionID");
            String CountryID = rsQuery.getString("CountryID");
            String ContinentID = rsQuery.getString("ContinentID");

            String name = rsQuery.getString("World");
            String municipality = rsQuery.getString("municipality");
            String latitude = rsQuery.getString("latitude");
            String longitude = rsQuery.getString("longitude");
            String region = rsQuery.getString("Region");
            String country = rsQuery.getString("Country");
            String continent = rsQuery.getString("Continent");

            addProperties(WorldID, RegionID, CountryID, ContinentID,
                    name, municipality, latitude, longitude, region,
                    country, continent);
        }
    }

    @Override
    public void buildResponse() {
        this.addInfo();
        found = getFound();
        places = getPlaces();
        log.trace("buildResponse -> {}", this);
    }
}
