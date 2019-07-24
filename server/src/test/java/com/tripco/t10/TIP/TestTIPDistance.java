package com.tripco.t10.TIP;

import org.junit.Before;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;

/** Verifies the operation of the TIP distance class and its buildResponse method.
 */
public class TestTIPDistance {

  /* Radius and location values shared by test cases */
  private final Double radiusMiles = 6.37E+9;
  private Map<String, Object> csu;

  @Before
  public void createLocationsForTestCases() {
    csu = new HashMap<>();
    csu.put("latitude", "40.576179");
    csu.put("longitude", "-105.080773");
    csu.put("name", "Oval, Colorado State University, Fort Collins, Colorado, USA");
  }

  @Test
  public void testOriginDestinationSame() {
    TIPDistance trip = new TIPDistance(csu, csu, radiusMiles);
    trip.buildResponse();
    Long expect = 0L;
    Long actual = trip.getDistance();
    assertEquals("origin and destination are the same", expect, actual);
  }
}
