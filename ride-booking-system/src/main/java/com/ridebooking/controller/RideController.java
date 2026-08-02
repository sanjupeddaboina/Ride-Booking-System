package com.ridebooking.controller;

import com.ridebooking.dto.request.ride.*;
import com.ridebooking.dto.response.ride.RideResponse;
import com.ridebooking.service.RideService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/rides")
public class RideController {

    private final RideService rideService;

    public RideController(RideService rideService) {
        this.rideService = rideService;
    }

    @PutMapping("/{rideId}/accept")
    public ResponseEntity<RideResponse> acceptRide(@PathVariable Long rideId, @Valid @RequestBody AcceptRideRequest request) {
        // rideId now comes solely from the URL path, so there's no way for a
        // client to accept a different ride than the one named in the URL.
        RideResponse rideResponse = rideService.acceptRide(request.getDriverId(), rideId);
        return ResponseEntity.ok(rideResponse);
    }

    @PutMapping("/{rideId}/start")
    public ResponseEntity<RideResponse> startRide(@PathVariable Long rideId, @Valid @RequestBody StartRideRequest request) {
        RideResponse rideResponse = rideService.startRide(request.getDriverId(), rideId);
        return ResponseEntity.ok(rideResponse);
    }

    @PutMapping("/{rideId}/complete")
    public ResponseEntity<RideResponse> completeRide(@PathVariable Long rideId, @Valid @RequestBody CompleteRideRequest request) {
        RideResponse rideResponse = rideService.completeRide(request.getDriverId(), rideId);
        return ResponseEntity.ok(rideResponse);
    }
    @PutMapping("/{rideId}/cancel")
    public ResponseEntity<RideResponse> cancelRide(@PathVariable Long rideId, @Valid @RequestBody CancelRideRequest request) {
        RideResponse rideResponse = rideService.cancelRide(request.getUserId(), rideId);
        return ResponseEntity.ok(rideResponse);
    }
}
