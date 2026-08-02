package com.ridebooking.service.impl;

import com.ridebooking.dto.request.driver.DriverAvailabilityRequest;
import com.ridebooking.dto.request.driver.DriverLoginRequest;
import com.ridebooking.dto.request.driver.DriverRegistrationRequest;
import com.ridebooking.dto.response.driver.DriverResponse;
import com.ridebooking.dto.response.ride.RideResponse;
import com.ridebooking.entity.Ride;
import com.ridebooking.enums.DriverStatus;
import com.ridebooking.enums.RideStatus;
import com.ridebooking.exception.AuthenticationException;
import com.ridebooking.exception.BusinessException;
import com.ridebooking.exception.ResourceNotFoundException;
import com.ridebooking.repository.DriverRepository;
import com.ridebooking.repository.RideRepository;
import com.ridebooking.service.DriverService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import com.ridebooking.entity.Driver;
import java.util.List;

@Service
@Transactional
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepository;
    private final RideRepository rideRepository;

    public DriverServiceImpl(DriverRepository driverRepository,RideRepository rideRepository){
        this.driverRepository = driverRepository;
        this.rideRepository = rideRepository;
    }

    @Override
    @Transactional
    public DriverResponse registerDriver(DriverRegistrationRequest request) {
        if (driverRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email is already registered");
        }
        if (driverRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new BusinessException("Phone number is already registered");
        }
        if (driverRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            throw new BusinessException("License number is already registered");
        }
        if (driverRepository.existsByVehicleNumber(request.getVehicleNumber())) {
            throw new BusinessException("Vehicle number is already registered");
        }
        Driver driver = Driver.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword())
                .phoneNumber(request.getPhoneNumber())
                .vehicleNumber(request.getVehicleNumber())
                .vehicleType(request.getVehicleType())
                .licenseNumber(request.getLicenseNumber())
                .available(true)
                .status(DriverStatus.ONLINE)
                .rating(0.0)
                .totalEarnings(0.0)
                .build();
        Driver savedDriver = driverRepository.save(driver);
        return mapToDriverResponse(savedDriver);
    }

    @Override
    @Transactional(readOnly = true)
    public DriverResponse loginDriver(DriverLoginRequest request) {
        // Both "no such email" and "wrong password" now return the same 401
        // Unauthorized via AuthenticationException, matching UserServiceImpl and
        // avoiding leaking which part of the credentials was wrong.
        Driver driver = driverRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthenticationException("Invalid email or password."));

        if (!driver.getPassword().equals(request.getPassword())) {
            throw new AuthenticationException("Invalid email or password.");
        }

        return mapToDriverResponse(driver);
    }

    @Override
    @Transactional
    public DriverResponse updateDriverStatus(Long driverId,
                                             DriverAvailabilityRequest request) {
        Driver driver = getDriverById(driverId);

        if (request.getStatus() == DriverStatus.OFFLINE) {
            boolean hasActiveRide = rideRepository.existsByDriverIdAndStatusIn(
                    driverId,
                    List.of(
                            RideStatus.BOOKED,
                            RideStatus.ACCEPTED,
                            RideStatus.STARTED
                    ));
            if (hasActiveRide) {
                throw new BusinessException(
                        "Driver cannot go offline while on an active ride.");
            }
            driver.setStatus(DriverStatus.OFFLINE);
            driver.setAvailable(false);

        } else {
            driver.setStatus(DriverStatus.ONLINE);
            // Driver becomes available only when not already assigned to a ride
            boolean hasActiveRide = rideRepository.existsByDriverIdAndStatusIn(
                    driverId,
                    List.of(
                            RideStatus.BOOKED,
                            RideStatus.ACCEPTED,
                            RideStatus.STARTED
                    ));
            driver.setAvailable(!hasActiveRide);
        }
        Driver updatedDriver = driverRepository.save(driver);
        return mapToDriverResponse(updatedDriver);
    }

    private Driver getDriverById(Long driverId) {
        return driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Driver not found with id: " + driverId));
    }

    @Override
    @Transactional(readOnly = true)
    public RideResponse getCurrentRide(Long driverId) {
        driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

        Ride ride = rideRepository.findFirstByDriverIdAndStatusInOrderByBookedAtDesc(driverId,
                        List.of(RideStatus.ACCEPTED, RideStatus.STARTED))
                .orElseThrow(() -> new ResourceNotFoundException("No active ride is found"));

        return mapToRideResponse(ride);
    }

    @Override
    @Transactional(readOnly = true)
    public RideResponse getPendingRide(Long driverId) {
        driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

        Ride ride = rideRepository.findByDriverIdAndStatus(driverId, RideStatus.BOOKED)
                .orElseThrow(() -> new ResourceNotFoundException("No pending ride request found"));

        return mapToRideResponse(ride);
    }

    @Override
    @Transactional(readOnly = true)
    public Double getDriverEarnings(Long driverId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));
        return driver.getTotalEarnings();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RideResponse> getDriverRideHistory(Long driverId) {
        driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found."));

        // Only finished rides count as "history" - mirrors UserServiceImpl's
        // getRideHistory, which likewise only returns COMPLETED rides. Previously
        // this returned every ride regardless of status, which was inconsistent.
        return rideRepository.findByDriverIdAndStatusOrderByBookedAtDesc(driverId, RideStatus.COMPLETED)
                .stream()
                .map(this::mapToRideResponse)
                .toList();
    }

    private DriverResponse mapToDriverResponse(Driver driver) {
        return DriverResponse.builder()
                .id(driver.getId())
                .name(driver.getName())
                .email(driver.getEmail())
                .phoneNumber(driver.getPhoneNumber())
                .vehicleNumber(driver.getVehicleNumber())
                .vehicleType(driver.getVehicleType())
                .status(driver.getStatus())
                .available(driver.getAvailable())
                .rating(driver.getRating())
                .totalEarnings(driver.getTotalEarnings())
                .build();
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
