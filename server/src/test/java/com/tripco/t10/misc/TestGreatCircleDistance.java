package com.tripco.t10.misc;

import org.junit.Test;

import java.util.LinkedHashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;

public class TestGreatCircleDistance {
    /*
        Testing for GreatCircleDistance:
            Tests will be checked in miles, kilometers, nautical miles, millimeters, and deciliters
            for earthRadius

            Tests will also include some basic builds that use miles for easy reference
     */

    @Test
    public void buildTest(){
        Map origin = new LinkedHashMap();
        origin.put("latitude", 0);
        origin.put("longitude", 0);

        Map destination = new LinkedHashMap();
        destination.put("latitude", 0);
        destination.put("longitude", 0);

        double earthRadius = 3959;

        GreatCircleDistance calculator = new GreatCircleDistance();
        assertEquals(0, calculator.calculateGreatCircleDistance(origin, destination, earthRadius).intValue());
    }

    @Test
    public void easyTest(){
        Map origin = new LinkedHashMap();
        origin.put("latitude", 40.5853);
        origin.put("longitude", -105.0844);

        Map destination = new LinkedHashMap();
        destination.put("latitude", 39.7392);
        destination.put("longitude", -104.9903);

        double earthRadius = 3959;

        GreatCircleDistance calculator = new GreatCircleDistance();
        assertEquals(59, calculator.calculateGreatCircleDistance(origin, destination, earthRadius).intValue());
    }

    @Test
    public void testCorners(){
        Map origin = new LinkedHashMap();
        origin.put("latitude", 0);
        origin.put("longitude", 0);

        Map destination = new LinkedHashMap();
        destination.put("latitude", 90);
        destination.put("longitude", 180);

        double earthRadius = 3959;

        GreatCircleDistance calculator = new GreatCircleDistance();
        assertEquals(6219, calculator.calculateGreatCircleDistance(origin, destination, earthRadius).intValue());
    }

    @Test
    public void edgeTest(){
        Map origin = new LinkedHashMap();
        origin.put("latitude", 45);
        origin.put("longitude", 90);

        Map destination = new LinkedHashMap();
        destination.put("latitude", -45);
        destination.put("longitude", -90);

        double earthRadius = 3959;

        GreatCircleDistance calculator = new GreatCircleDistance();
        assertEquals(12438, calculator.calculateGreatCircleDistance(origin, destination, earthRadius).intValue());
    }

    @Test
    public void testWithKilometers(){
        Map origin = new LinkedHashMap();
        origin.put("latitude", 45);
        origin.put("longitude", 90);

        Map destination = new LinkedHashMap();
        destination.put("latitude", -45);
        destination.put("longitude", -90);

        double earthRadius = 6371;

        GreatCircleDistance calculator = new GreatCircleDistance();
        assertEquals(20015, calculator.calculateGreatCircleDistance(origin, destination, earthRadius).intValue());
    }

    @Test
    public void testWithMeters(){
        Map origin = new LinkedHashMap();
        origin.put("latitude", 45);
        origin.put("longitude", 90);

        Map destination = new LinkedHashMap();
        destination.put("latitude", -45);
        destination.put("longitude", -90);

        double earthRadius = 6371000;

        GreatCircleDistance calculator = new GreatCircleDistance();
        assertEquals(20015087, calculator.calculateGreatCircleDistance(origin, destination, earthRadius).intValue());
    }

    @Test
    public void testWithCentimeters(){
        Map origin = new LinkedHashMap();
        origin.put("latitude", 45);
        origin.put("longitude", 90);

        Map destination = new LinkedHashMap();
        destination.put("latitude", -45);
        destination.put("longitude", -90);

        double earthRadius = 637100000;

        GreatCircleDistance calculator = new GreatCircleDistance();
        assertEquals(2001508680, calculator.calculateGreatCircleDistance(origin, destination, earthRadius).doubleValue(), 1);
    }

    @Test
    public void testWithMillimeters(){
        Map origin = new LinkedHashMap();
        origin.put("latitude", 45);
        origin.put("longitude", 90);

        Map destination = new LinkedHashMap();
        destination.put("latitude", -45);
        destination.put("longitude", -90);

        double earthRadius = 6.371E9;

        GreatCircleDistance calculator = new GreatCircleDistance();

        double value = calculator.calculateGreatCircleDistance(origin, destination, earthRadius);
        double expect = 2.0015086796E10;

        assertEquals(expect, value, 1);
    }

    @Test
    public void testWithNauticalMiles(){
        Map origin = new LinkedHashMap();
        origin.put("latitude", 45);
        origin.put("longitude", 90);

        Map destination = new LinkedHashMap();
        destination.put("latitude", -45);
        destination.put("longitude", -90);

        double earthRadius = 3440;

        GreatCircleDistance calculator = new GreatCircleDistance();
        assertEquals(10807, calculator.calculateGreatCircleDistance(origin, destination, earthRadius).intValue());
    }

    @Test
    public void testMapsWithMultipleValues(){
        Map origin = new LinkedHashMap();
        origin.put("latitude", 40);
        origin.put("longitude", -150);
        origin.put("latitude", 50);
        origin.put("longitude", -150);

        Map destination = new LinkedHashMap();
        destination.put("latitude", 40);
        destination.put("longitude", -151);
        destination.put("latitude", 50);
        destination.put("longitude", -151);

        double earthRadius = 3959;

        GreatCircleDistance calculator = new GreatCircleDistance();
        assertEquals(44, calculator.calculateGreatCircleDistance(origin, destination, earthRadius).intValue());
    }

}
