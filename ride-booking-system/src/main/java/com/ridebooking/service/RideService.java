package com.ridebooking.service;

import com.ridebooking.dto.request.AcceptRideRequest;
import com.ridebooking.dto.request.BookingRideRequest;
import com.ridebooking.dto.request.CompleteRideRequest;
import com.ridebooking.dto.request.StartRequest;
import com.ridebooking.dto.response.RideResponse;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
public interface RideService {
    public RideResponse bookRide(Long userId, BookingRideRequest request);
    RideResponse acceptRide(AcceptRideRequest request);
    RideResponse cancelRide(Long userId, Long rideId);
    RideResponse completeRide(Long rideId, Long driverId);
    RideResponse startRide(Long driverId, Long rideId);
}