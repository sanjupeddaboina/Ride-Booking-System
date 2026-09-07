package com.ridebooking.service;

import com.ridebooking.dto.request.driver.DriverAvailabilityRequest;
import com.ridebooking.dto.request.driver.DriverLoginRequest;
import com.ridebooking.dto.request.driver.DriverRegistrationRequest;
import com.ridebooking.dto.response.auth.AuthResponse;
import com.ridebooking.dto.response.driver.DriverResponse;
import com.ridebooking.dto.response.ride.RideResponse;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface DriverService {
    DriverResponse registerDriver(DriverRegistrationRequest request);
    AuthResponse loginDriver(DriverLoginRequest request);
    DriverResponse updateDriverStatus(Long driverId, DriverAvailabilityRequest request);
    RideResponse getCurrentRide(Long driverId);

    // A ride that has been auto-assigned to this driver but not yet accepted (status BOOKED).
    RideResponse getPendingRide(Long driverId);

    Double getDriverEarnings(Long driverId);
    List<RideResponse> getDriverRideHistory(Long driverId);

    DriverResponse getDriverProfile(Long driverId);
}
