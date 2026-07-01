package com.ridebooking.controller;

import com.ridebooking.dto.request.DriverAvailabilityRequest;
import com.ridebooking.dto.request.DriverLoginRequest;
import com.ridebooking.dto.request.DriverRegistrationRequest;
import com.ridebooking.dto.response.DriverResponse;
import com.ridebooking.service.DriverService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor

public class DriverController {
    private final DriverService driverService;

    @PostMapping("/register")
    public DriverResponse registerDriver(@RequestBody DriverRegistrationRequest request) {
        return driverService.registerDriver(request);
    }
    @PostMapping("/login")
    public DriverResponse loginDriver(@RequestBody DriverLoginRequest request) {
        return driverService.loginDriver(request);
    }
    @PutMapping("/availability")
    public DriverResponse driverAvailability(@RequestBody DriverAvailabilityRequest request) {
        return driverService.driverAvailability(request.getDriverId(), request);
    }
}
