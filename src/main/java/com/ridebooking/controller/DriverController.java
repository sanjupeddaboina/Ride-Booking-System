package com.ridebooking.controller;

import com.ridebooking.dto.request.driver.DriverAvailabilityRequest;
import com.ridebooking.dto.request.driver.DriverLoginRequest;
import com.ridebooking.dto.request.driver.DriverRegistrationRequest;
import com.ridebooking.dto.response.auth.AuthResponse;
import com.ridebooking.dto.response.driver.DriverResponse;
import com.ridebooking.dto.response.ride.RideResponse;
import com.ridebooking.service.DriverService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/drivers")
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    @PostMapping("/register")
    public ResponseEntity<DriverResponse> registerDriver(@Valid @RequestBody DriverRegistrationRequest request) {
        DriverResponse response = driverService.registerDriver(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginDriver(@Valid @RequestBody DriverLoginRequest request) {
        AuthResponse response = driverService.loginDriver(request);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('DRIVER')")
    @PutMapping("/{driverId}/status")
    public ResponseEntity<DriverResponse> updateDriverStatus(
            @PathVariable Long driverId,
            @Valid @RequestBody DriverAvailabilityRequest request) {

        DriverResponse driverResponse  = driverService.updateDriverStatus(driverId, request);
        return ResponseEntity.ok(driverResponse );
    }

    @PreAuthorize("hasRole('DRIVER')")
    @GetMapping("/{driverId}/current")
    public ResponseEntity<RideResponse> getCurrentRide(@PathVariable Long driverId) {
        RideResponse rideResponse = driverService.getCurrentRide(driverId);
        return ResponseEntity.ok(rideResponse);
    }

    @PreAuthorize("hasRole('DRIVER')")
    @GetMapping("/{driverId}/pending")
    public ResponseEntity<RideResponse> getPendingRide(@PathVariable Long driverId) {
        RideResponse rideResponse = driverService.getPendingRide(driverId);
        return ResponseEntity.ok(rideResponse);
    }

    @PreAuthorize("hasRole('DRIVER')")
    @GetMapping("/{driverId}/earnings")
    public ResponseEntity<Double> getDriverEarnings(@PathVariable Long driverId) {
        Double earnings =driverService.getDriverEarnings(driverId);
        return ResponseEntity.ok(earnings);
    }

    @PreAuthorize("hasRole('DRIVER')")
    @GetMapping("/{driverId}/rides")
    public ResponseEntity<java.util.List<RideResponse>> getDriverRideHistory(@PathVariable Long driverId) {
        java.util.List<RideResponse> rideHistory = driverService.getDriverRideHistory(driverId);
        return ResponseEntity.ok(rideHistory);
    }
}
