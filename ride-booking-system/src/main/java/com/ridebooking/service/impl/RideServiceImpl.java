package com.ridebooking.service.impl;

import com.ridebooking.dto.request.AcceptRideRequest;
import com.ridebooking.dto.request.BookingRideRequest;
import com.ridebooking.dto.request.StartRequest;
import com.ridebooking.dto.response.RideResponse;
import com.ridebooking.entity.Driver;
import com.ridebooking.exception.AuthenticationException;
import com.ridebooking.exception.BusinessException;
import com.ridebooking.exception.ResourceNotFoundException;
import com.ridebooking.repository.DriverRepository;
import com.ridebooking.repository.RideRepository;
import com.ridebooking.repository.UserRepository;
import com.ridebooking.service.FareCalculationService;
import com.ridebooking.service.RideService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.ridebooking.entity.Ride;
import com.ridebooking.entity.User;
import com.ridebooking.enums.RideStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Transactional

public class RideServiceImpl implements RideService {
    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final DriverRepository driverRepository;

    private final FareCalculationService fareCalculationService;

    @Override
    @Transactional
    public RideResponse bookRide(Long userId, BookingRideRequest request) {

        User user = getUser(userId);
        boolean activeRideExists = rideRepository.existsByUserIdAndStatusIn(
                user.getId(),
                List.of(RideStatus.BOOKED, RideStatus.ACCEPTED, RideStatus.STARTED));

        if (activeRideExists) {
            throw new BusinessException("You already have an active ride. Cannot book another ride at this time.");
        }

        List<Driver> availableDrivers = driverRepository
                .findByAvailableTrueAndVehicleType(request.getVehicleType());

        if (availableDrivers.isEmpty()) {
            throw new ResourceNotFoundException("No available " + request.getVehicleType() + " driver found.");
        }

        Random random = new Random();
        Driver assignedDriver = availableDrivers.get(random.nextInt(availableDrivers.size()));

        Ride ride = Ride.builder()
                .pickupAddress(request.getPickupAddress())
                .dropAddress(request.getDropAddress())
                .distance(request.getDistance())
                .vehicleType(request.getVehicleType())
                .status(RideStatus.BOOKED)
                .bookedAt(LocalDateTime.now())
                .driver(assignedDriver)
                .user(user)
                .build();

        Ride savedRide = rideRepository.save(ride);
        return mapToRideResponse(savedRide);
    }

    @Override
    @Transactional
    public RideResponse acceptRide(AcceptRideRequest request) {

        Driver driver = driverRepository.findById(request.getDriverId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

        Ride ride = rideRepository.findById(request.getRideId())
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found"));

        if (ride.getStatus() != RideStatus.BOOKED) {
            throw new BusinessException("Only booked rides can be accepted.");
        }

        // Only the assigned driver can accept
        if (!ride.getDriver().getId().equals(driver.getId())) {
            throw new BusinessException("This ride is assigned to another driver.");
        }

        if (!Boolean.TRUE.equals(driver.getAvailable())) {
            throw new BusinessException("Driver is unavailable.");
        }

        boolean hasActiveRide = rideRepository.existsByDriverIdAndStatusIn(
                driver.getId(),
                List.of(RideStatus.ACCEPTED, RideStatus.STARTED));

        if (hasActiveRide) {
            throw new BusinessException("Driver already has an active ride.");
        }

        ride.setStatus(RideStatus.ACCEPTED);
        ride.setAcceptedAt(LocalDateTime.now());
        driver.setAvailable(false);
        driverRepository.save(driver);
        Ride updatedRide = rideRepository.save(ride);
        return mapToRideResponse(updatedRide);
    }

    @Override
    public RideResponse startRide(Long driverId, Long rideId) {

        Ride ride = getRide(rideId);
        if (ride.getDriver() == null) {
            throw new BusinessException("No driver assigned to this ride.");
        }

        if (!ride.getDriver().getId().equals(driverId)) {
            throw new BusinessException("You are not authorized to start this ride.");
        }

        if (ride.getStatus() != RideStatus.ACCEPTED) {
            throw new BusinessException("Only accepted rides can be started.");
        }

        ride.setStatus(RideStatus.STARTED);
        ride.setStartedAt(LocalDateTime.now());
        Ride updatedRide = rideRepository.save(ride);
        return mapToRideResponse(updatedRide);
    }
    @Override
    @Transactional
    public RideResponse completeRide(Long driverId, Long rideId) {

        Ride ride = getRide(rideId);
        if (ride.getDriver() == null) {
            throw new BusinessException("No driver assigned to this ride.");
        }

        if (!ride.getDriver().getId().equals(driverId)) {
            throw new AuthenticationException("You are not authorized to complete this ride.");
        }

        if (ride.getStatus() != RideStatus.STARTED) {
            throw new BusinessException("Ride cannot be completed because its current status is " + ride.getStatus());
        }

        Double fare = fareCalculationService.calculateFare(ride.getVehicleType(), ride.getDistance());
        ride.setFare(fare);
        ride.setStatus(RideStatus.COMPLETED);
        ride.setCompletedAt(LocalDateTime.now());

        Driver driver = ride.getDriver();
        driver.setTotalEarnings(driver.getTotalEarnings() + fare);
        driver.setAvailable(true);
        driverRepository.save(driver);
        Ride updatedRide = rideRepository.save(ride);
        return mapToRideResponse(updatedRide);
    }

    @Override
    public RideResponse cancelRide(Long userId, Long rideId) {

        Ride ride = getRide(rideId);

        if (ride.getStatus() != RideStatus.BOOKED) {
            throw new BusinessException("Ride cannot be cancelled because its current status is " + ride.getStatus());
        }

        ride.setStatus(RideStatus.CANCELLED);
        Driver driver = ride.getDriver();
        if (driver != null) {
            driver.setAvailable(true);
            driverRepository.save(driver);
        }
        Ride updatedRide = rideRepository.save(ride);
        return mapToRideResponse(updatedRide);
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Driver getDriver(Long driverId) {
        return driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));
    }

    private Ride getRide(Long rideId) {
        return rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found"));
    }

    private RideResponse mapToRideResponse(Ride ride) {
        return RideResponse.builder()
                .rideId(ride.getId())
                .userId(ride.getUser().getId())
                .driverId(ride.getDriver() != null ? ride.getDriver().getId() : null)
                .pickupAddress(ride.getPickupAddress())
                .dropAddress(ride.getDropAddress())
                .vehicleType(ride.getVehicleType())
                .fare(ride.getFare())
                .status(ride.getStatus().name())
                .bookedAt(ride.getBookedAt())
                .startedAt(ride.getStartedAt())
                .completedAt(ride.getCompletedAt())
                .build();
    }
}