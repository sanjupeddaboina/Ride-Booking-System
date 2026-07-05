package com.ridebooking.controller;

import com.ridebooking.dto.request.*;
import com.ridebooking.dto.response.DriverResponse;
import com.ridebooking.dto.response.RideResponse;
import com.ridebooking.service.DriverService;
import com.ridebooking.service.RideService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor

public class DriverController {
    private final DriverService driverService;
    private final RideService rideService;

    @PostMapping("/register")
    public ResponseEntity<DriverResponse> registerDriver(@Valid @RequestBody DriverRegistrationRequest request) {
        DriverResponse response = driverService.registerDriver(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<DriverResponse> loginDriver(@Valid @RequestBody DriverLoginRequest request) {
        DriverResponse response = driverService.loginDriver(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{driverId}/availability")
    public ResponseEntity<DriverResponse> driverAvailability(
            @PathVariable Long driverId,
            @Valid @RequestBody DriverAvailabilityRequest request) {

        DriverResponse response = driverService.driverAvailability(driverId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{driverId}/current")
    public RideResponse getCurrentRide(@PathVariable Long driverId) {
        return driverService.getCurrentRide(driverId);
    }

    @GetMapping("/{driverId}/earnings")
    public Double getDriverEarnings(@PathVariable Long driverId) {
        return driverService.getDriverEarnings(driverId);
    }

    @PutMapping("/{rideId}/complete")
    public ResponseEntity<RideResponse> completeRide(@PathVariable Long rideId, @Valid @RequestBody CompleteRideRequest request) {
        RideResponse response = rideService.completeRide(request.getDriverId(), rideId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{rideId}/cancel")
    public ResponseEntity<RideResponse> cancelRide(@PathVariable Long rideId, @Valid @RequestBody CancelRideRequest request) {
        RideResponse response = rideService.cancelRide(request.getUserId(), rideId);
        return ResponseEntity.ok(response);
    }
}
