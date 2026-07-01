package com.ridebooking.service.impl;

import com.ridebooking.repository.DriverRepository;
import com.ridebooking.service.DriverService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.ridebooking.entity.Driver;
import com.ridebooking.dto.request.*;
import com.ridebooking.dto.response.DriverResponse;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DriverServiceImpl implements DriverService {
    private final DriverRepository driverRepository;

    @Override
    public DriverResponse registerDriver(DriverRegistrationRequest request) {
        Driver driver = Driver.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .password(request.getPassword()) // In real application, hash the password
                .available(true)
                .createdAt(LocalDateTime.now())
                .build();
        Driver savedDriver = driverRepository.save(driver);
        return mapToDriverResponse(savedDriver);
    }

    @Override
    public DriverResponse loginDriver(DriverLoginRequest request) {
        Driver driver = driverRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        if (!driver.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        return mapToDriverResponse(driver);
    }

    @Override
    public DriverResponse driverAvailability(Long driverId, DriverAvailabilityRequest request) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        driver.setAvailable(request.getAvailable());
        Driver updatedDriver = driverRepository.save(driver);
        return mapToDriverResponse(updatedDriver);
    }
    private DriverResponse mapToDriverResponse(Driver driver) {
        return DriverResponse.builder()
                .id(driver.getId())
                .name(driver.getName())
                .email(driver.getEmail())
                .phoneNumber(driver.getPhoneNumber())
                .vehicleNumber(driver.getVehicleNumber())
                .vehicleType(driver.getVehicleType())
                .available(driver.getAvailable())
                .rating(driver.getRating())
                .build();
    }
}
