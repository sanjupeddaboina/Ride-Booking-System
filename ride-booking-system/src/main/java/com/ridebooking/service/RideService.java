package com.ridebooking.service;

import com.ridebooking.dto.request.ride.BookingRideRequest;
import com.ridebooking.dto.response.ride.RideResponse;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

public interface RideService {
    RideResponse bookRide(Long userId, @Valid BookingRideRequest request);
    RideResponse acceptRide(Long driverId, Long rideId);
    RideResponse cancelRide(Long userId, Long rideId);
    RideResponse completeRide(Long driverId, Long rideId);
    RideResponse startRide(Long driverId, Long rideId);
}
