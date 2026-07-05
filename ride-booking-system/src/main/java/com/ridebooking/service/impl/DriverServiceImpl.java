package com.ridebooking.service.impl;

import com.ridebooking.dto.response.RideResponse;
import com.ridebooking.entity.Ride;
import com.ridebooking.enums.RideStatus;
import com.ridebooking.exception.BusinessException;
import com.ridebooking.exception.ResourceNotFoundException;
import com.ridebooking.repository.DriverRepository;
import com.ridebooking.repository.RideRepository;
import com.ridebooking.service.DriverService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.TypeRegistration;
import org.springframework.stereotype.Service;

import com.ridebooking.entity.Driver;
import com.ridebooking.dto.request.*;
import com.ridebooking.dto.response.DriverResponse;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional

public class DriverServiceImpl implements DriverService {
    private final DriverRepository driverRepository;
    private final RideRepository rideRepository;

    @Override
    public DriverResponse registerDriver(DriverRegistrationRequest request) {
        if(driverRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email is already registered");
        }
        if(driverRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new BusinessException("Phone number is already registered");
        }
        if(driverRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            throw new BusinessException("License number is already registered");
        }
        if (driverRepository.existsByVehicleNumber(request.getVehicleNumber())) {
            throw new BusinessException("Vehicle number is already registered");
        }
        Driver driver = Driver.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password((request.getPassword()))
                .phoneNumber((request.getPhoneNumber()))
                .vehicleNumber((request.getVehicleNumber()))
                .vehicleType(request.getVehicleType())
                .licenseNumber(request.getLicenseNumber())
                .available(true)
                .rating(0.0)
                .totalEarnings(0.0)
                .createdAt(LocalDateTime.now())
                .build();
        Driver savedDriver = driverRepository.save(driver);
        return mapToDriverResponse(savedDriver);
    }

    @Override
    public DriverResponse loginDriver(DriverLoginRequest request) {
        Driver driver = driverRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password."));

        if (!driver.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return mapToDriverResponse(driver);
    }

    @Override
    public DriverResponse driverAvailability(Long driverId, DriverAvailabilityRequest request) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

        if(!request.getAvailable()){
            boolean hasActiveRide = rideRepository.existsByDriverIdAndStatusIn(
                    driverId,
                    List.of(com.ridebooking.enums.RideStatus.ACCEPTED, com.ridebooking.enums.RideStatus.STARTED));

            if(hasActiveRide){
                throw new BusinessException("Driver cannot go offline while in a ride.");
            }
        }

        driver.setAvailable(request.getAvailable());
        Driver updatedDriver = driverRepository.save(driver);
        return mapToDriverResponse(updatedDriver);
    }

    @Override
    public RideResponse getCurrentRide(Long driverId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

        Ride ride = rideRepository.findFirstByDriverIdAndStatusInOrderByBookedAtDesc(driverId,
                List.of(RideStatus.ACCEPTED,RideStatus.STARTED))
                .orElseThrow(() -> new ResourceNotFoundException("No active ride is found"));

        return mapToRideResponse(ride);
    }

    @Override
    public Double getDriverEarnings(Long driverId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));
        return driver.getTotalEarnings();
    }

    @Override
    public List<RideResponse> getDriverRideHistory(Long driverId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found."));
        List<RideResponse> rideHistory = driver.getRides()
                .stream()
                .map(this::mapToRideResponse)
                .toList();
        return rideHistory;
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

    private RideResponse mapToRideResponse(Ride ride) {
        return RideResponse.builder()
                .rideId(ride.getId())
                .userId(ride.getUser().getId())
                .driverId(ride.getDriver() != null ? ride.getDriver().getId() : null)
                .pickupAddress(ride.getPickupAddress())
                .dropAddress(ride.getDropAddress())
                .fare(ride.getFare())
                .status(ride.getStatus().name())
                .bookedAt(ride.getBookedAt())
                .startedAt(ride.getStartedAt())
                .completedAt(ride.getCompletedAt())
                .build();
    }
}
