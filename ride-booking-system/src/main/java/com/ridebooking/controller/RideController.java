package com.ridebooking.controller;

import com.ridebooking.dto.request.*;
import com.ridebooking.dto.response.RideResponse;
import com.ridebooking.service.RideService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/rides")

public class RideController {

    private final RideService rideService;

    @PostMapping("/users/{userId}/book")
    public ResponseEntity<RideResponse> bookRide(@PathVariable Long userId, @Valid @RequestBody BookingRideRequest request) {
        RideResponse response = rideService.bookRide(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("{rideId}/accept")
    public ResponseEntity<RideResponse> acceptRide(@Valid @RequestBody AcceptRideRequest request) {
        RideResponse response = rideService.acceptRide(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{rideId}/cancel")
    public ResponseEntity<RideResponse> cancelRide(@PathVariable Long rideId, @Valid @RequestBody CancelRideRequest request) {
        RideResponse response = rideService.cancelRide(request.getUserId(), rideId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{rideId}/start")
    public ResponseEntity<RideResponse> startRide(@PathVariable Long rideId, @Valid @RequestBody StartRequest request) {
        RideResponse response = rideService.startRide(request.getDriverId(), rideId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{rideId}/complete")
    public ResponseEntity<RideResponse> completeRide(@PathVariable Long rideId, @Valid @RequestBody CompleteRideRequest request) {
        RideResponse response = rideService.completeRide(request.getDriverId(), rideId);
        return ResponseEntity.ok(response);
    }


}
