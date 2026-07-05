package com.ridebooking.service;

import com.ridebooking.dto.request.DriverAvailabilityRequest;
import com.ridebooking.dto.request.DriverLoginRequest;
import com.ridebooking.dto.request.DriverRegistrationRequest;
import com.ridebooking.dto.response.DriverResponse;
import com.ridebooking.dto.response.RideResponse;

import java.util.List;

public interface DriverService {
    DriverResponse registerDriver(DriverRegistrationRequest request);
    DriverResponse loginDriver(DriverLoginRequest request);
    DriverResponse driverAvailability(Long driverId, DriverAvailabilityRequest request);
    RideResponse getCurrentRide(Long driverId);
    Double getDriverEarnings(Long driverId);
    List<RideResponse> getDriverRideHistory(Long driverId);
}
