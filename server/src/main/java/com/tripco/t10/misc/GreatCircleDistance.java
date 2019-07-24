package com.tripco.t10.misc;

import java.lang.Math;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.MathContext;
import java.util.Map;

/** Determines the distance between geographic coordinates.
 */
public class GreatCircleDistance {
    /** code below from https://rosettacode.org/wiki/Haversine_formula#Java and modified for project as needed
     * */

    public Long calculateGreatCircleDistance(Map origin, Map destination, Double earthRadius) {

        double originLatitude = Double.parseDouble(String.valueOf(origin.get("latitude")));
        double originLongitude = Double.parseDouble(String.valueOf(origin.get("longitude")));

        double destinationLatitude = Double.parseDouble(String.valueOf(destination.get("latitude")));
        double destinationLongitude = Double.parseDouble(String.valueOf(destination.get("longitude")));

        double dLat = Math.toRadians(destinationLatitude - originLatitude);
        double dLon = Math.toRadians(destinationLongitude - originLongitude);
        originLatitude = Math.toRadians(originLatitude);
        destinationLatitude = Math.toRadians(destinationLatitude);

        double a = Math.pow(Math.sin(dLat / 2),2) + Math.pow(Math.sin(dLon / 2),2) * Math.cos(originLatitude) * Math.cos(destinationLatitude);
        double c = 2 * Math.asin(Math.sqrt(a));



        return Math.round(earthRadius * c);

    }


    @Override
    public String toString() {
        return "GreatCircleDistance{}";
    }
}
