package com.tripco.t10.TIP;

import java.util.*;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.tripco.t10.misc.GreatCircleDistance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;



public class TIPItinerary extends TIPHeader{
    private JsonObject options;
    //    private JsonArray places;
    protected JsonObject [] places = new JsonObject[0];
    protected long[] distances = new long[0];

    private final transient Logger log = LoggerFactory.getLogger(TIPItinerary.class);

    private TIPItinerary() {
        this.requestType = "itinerary";
        this.requestVersion = 4;
    }

    //for testing purposes, optional distances
//    TIPItinerary(JsonObject options, JsonArray places) {
    TIPItinerary(JsonObject options, JsonObject[] places) {
        this();
        this.options = options;
        this.places = places;
    }

    //    TIPItinerary(JsonObject options, JsonArray places, long[] distances) {
    TIPItinerary(JsonObject options, JsonObject[] places, long[] distances) {
        this();
        this.options = options;
        this.places = places;
        this.distances = distances;
    }

    public long calculateDistance(int position1, int position2){
        Map<String, Object> origin, destination;
        origin = new LinkedHashMap<>();
        destination = new LinkedHashMap<>();
        GreatCircleDistance haversine = new GreatCircleDistance();

        //base case, there are 0 or 1 places listed then return 0
        if(places.length == 0 || places.length == 1){
            destination = origin;
            return 0;
        }

        double originLatitude = getLatitude(position1);
        double originLongitude = getLongitude(position1);
        origin.put("latitude", originLatitude);
        origin.put("longitude", originLongitude);

        log.trace("Pos2: " + position2);
        double destLatitude = getLatitude(position2);
        double destLongitude = getLongitude(position2);
        destination.put("latitude", destLatitude);
        destination.put("longitude", destLongitude);

        return haversine.calculateGreatCircleDistance(origin, destination, getEarthRadius());
    }

    //Code to extract data from Jsonarray from https://stackoverflow.com/questions/41354932/getting-a-value-from-a-jsonarray-using-gson
    public double getLatitude(int i){
        return places[i].getAsJsonObject().get("latitude").getAsDouble();
    }

    public double getLongitude(int i){
        return places[i].getAsJsonObject().get("longitude").getAsDouble();
    }

    public long[] fillDistances(){
        distances = new long[places.length];
        for(int i = 0; i < places.length; ++i){
            long leg_distance = 0;
            if(i == places.length-1){
                leg_distance = calculateDistance(i, 0);
            } else {
                leg_distance = calculateDistance(i, i + 1);
            }
            log.trace("Leg Distance[ " + i + "] = " + leg_distance);
            distances[i] = leg_distance;
        }
        return distances;
    }

    public Double getEarthRadius(){
        return options.getAsJsonObject().get("earthRadius").getAsDouble();
    }

    public void setOptimization(){
        String optimization;
        try {
            optimization = options.getAsJsonObject().get("optimization").getAsString();
            options.addProperty("optimization", optimization);
        } catch(NullPointerException e){
            optimization = "none";
            options.addProperty("optimization", optimization);
        }
    }

    public long[] getDistances(){
        return this.distances;
    }

    @Override
    public void buildResponse() {
        log.trace("buildResponse -> {}", this);
        setOptimization();
        if (options.getAsJsonObject().get("optimization").getAsString().equals("short")) {

            int first = this.places.length > 0 ? find(nearestNeighbor(this.places),this.places[0].get("name").getAsString()) : -1;
            this.places = leftRotate(nearestNeighbor(this.places),first,this.places.length);
            this.distances = fillDistances();
        }
        else {
            this.distances = fillDistances();
        }
    }
    protected int find (JsonObject [] places ,String findValue){
        for (int i =0; i< places.length; i++){
            if ((places[i].get("name").getAsString()).equals(findValue)){ return i;}
        }
        return -1;
    }
    //code from https://www.geeksforgeeks.org/array-rotation/
    /*Function to left rotate arr[] of size n by d*/
    JsonObject[] leftRotate(JsonObject arr[], int oldPosition, int lengthOfArray)
    {
        for (int i = 0; i < oldPosition; i++) {
            leftRotatebyOne(arr, lengthOfArray);
        }
        return arr;
    }

    void leftRotatebyOne(JsonObject arr[], int lengthOfArray)
    {
        int i;
        JsonObject temp;
        temp = arr[0];
        for (i = 0; i < lengthOfArray - 1; i++) {
            arr[i] = arr[i + 1];
        }
        arr[i] = temp;
    }

    public JsonObject[] nearestNeighbor(JsonObject[] places) {
        long shortestTourCumulativeDistance = Integer.MAX_VALUE;
        JsonObject [] shortestTour = new JsonObject[places.length];
        for (int startingCity = 0; startingCity < places.length; startingCity++) {
            JsonObject[] tempPlaces = new JsonObject[places.length];
            for(int i = 0; i < places.length; ++i){
                tempPlaces[i] = places[i];
            }
            JsonObject [] newTour = new JsonObject[places.length];

            for(int i = 0; i < newTour.length; ++i) {
                if(newTour[i] == null) {
                    newTour[i] = tempPlaces[startingCity];
                    break;
                }
            }

            tempPlaces[startingCity] = null;

            long[] distances = new long[places.length];
            for(int i = 0; i < places.length - 1; ++i){
                findClosestNeighbor(newTour, tempPlaces, distances);
            }

            Map<String, String> startingPlace = createMapFromPlace(newTour[0]);
            Map<String, String> lastPlace = createMapFromPlace(newTour[newTour.length - 1]);

            long roundTripLeg = sourceToDestinationDistance(lastPlace, startingPlace);
            distances[distances.length-1] = roundTripLeg;

            long totalDistance = calculateTotalDistance(distances);

            if (totalDistance < shortestTourCumulativeDistance){
                shortestTour = newTour;
                shortestTourCumulativeDistance = totalDistance;
            }
        }
        return shortestTour;
    }

    private Map<String, String> lastPlace(JsonObject[] newTour)
    {
        int count = 0;
        for(int i = newTour.length; i > 0; --i){
            if(newTour[i-1] != null){
                count = i-1;
                break;
            }
        }
        return createMapFromPlace(newTour[count]);
    }

    private void findClosestNeighbor(JsonObject[] newTour, JsonObject[] tempPlaces, long[] distances){
        long closestNeighborDistance = Integer.MAX_VALUE;
        int closestNeighborIndex = -1;

        Map<String, String> source = lastPlace(newTour);

        log.trace("source: " + newTour[newTour.length - 1]);
        for (int j = 0; j < tempPlaces.length; ++j) {
            Map<String, String> destination;
            if(tempPlaces[j] != null) {
                destination = createMapFromPlace(tempPlaces[j]);
                long distance = sourceToDestinationDistance(source, destination);

                if (distance < closestNeighborDistance) {

                    closestNeighborDistance = distance;
                    closestNeighborIndex = j;
                }
            }
        }
        for(int i = 0; i < distances.length; ++i){
            if(distances[i] == 0){
                distances[i] = closestNeighborDistance;
                break;
            }
        }

        for(int i = 0; i < newTour.length; ++i) {
            if(newTour[i] == null) {
                newTour[i] = tempPlaces[closestNeighborIndex];
                break;
            }
        }
        tempPlaces[closestNeighborIndex] = null;
    }

    private long sourceToDestinationDistance(Map<String, String> source, Map<String, String> destination) {
        GreatCircleDistance gcd = new GreatCircleDistance();
        return gcd.calculateGreatCircleDistance(source, destination, this.getEarthRadius());
    }

    private Map<String, String> createMapFromPlace(JsonElement place) {
        JsonObject placeObject = place.getAsJsonObject();
        String currentPlaceLatitude = placeObject.get("latitude").getAsString();
        String currentPlaceLongitude = placeObject.get("longitude").getAsString();
        Map<String, String> placeLatLon = new HashMap<>();
        placeLatLon.put("latitude", currentPlaceLatitude);
        placeLatLon.put("longitude", currentPlaceLongitude);
        return placeLatLon;
    }

    private long calculateTotalDistance(long[] distances) {
        long totalDistance = 0;
        for (long distance : distances) {
            totalDistance += distance;
        }
        return totalDistance;
    }


    @Override
    public String toString() {
        return "TIPItinerary{" +
            "options: " + options +
            "places: " + places +
            "distances: " + distances +
            '}';
    }
}