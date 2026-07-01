package com.ridebooking.service;

import com.ridebooking.dto.request.AcceptRideRequest;
import com.ridebooking.dto.request.BookingRideRequest;
import com.ridebooking.dto.response.RideResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RideService {
    RideResponse bookRide(BookingRideRequest request);
    RideResponse acceptRide(AcceptRideRequest request);
    RideResponse cancelRide(Long rideId);
    RideResponse startRide(Long rideId);
    RideResponse completeRide(Long rideId);
    RideResponse getRideById(Long rideId);
    RideResponse getCurrentRide(Long userId);
    Object getRideHistory(Long userId);
}