package com.tripco.t10.TIP;

public abstract class TIPHeader {
  protected Integer requestVersion;
  protected String requestType;

  public abstract void buildResponse();
}
