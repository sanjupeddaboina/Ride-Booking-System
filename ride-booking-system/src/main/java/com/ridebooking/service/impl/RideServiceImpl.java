package com.ridebooking.service.impl;

import com.ridebooking.dto.request.AcceptRideRequest;
import com.ridebooking.dto.request.BookingRideRequest;
import com.ridebooking.dto.response.RideResponse;
import com.ridebooking.exception.BusinessException;
import com.ridebooking.repository.DriverRepository;
import com.ridebooking.repository.RideRepository;
import com.ridebooking.repository.UserRepository;
import com.ridebooking.service.RideService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.ridebooking.entity.Ride;
import com.ridebooking.entity.User;
import com.ridebooking.enums.RideStatus;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RideServiceImpl implements RideService {
    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final DriverRepository driverRepository;

    @Override
    public RideResponse bookRide(BookingRideRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new BusinessException("User not found"));
        boolean activeRideExists = rideRepository.existsByUserIdAndStatusIn(
                user.getId(),
                List.of(
                        RideStatus.REQUESTED,
                        RideStatus.ACCEPTED,
                        RideStatus.STARTED
                )
        );

        if (activeRideExists) {
            throw new BusinessException("You already have an active ride.");
        }
        Ride ride = Ride.builder()
                .user(user)
                .pickupAddress(request.getPickupLocation())
                .dropAddress(request.getDropoutLocation())
                .status(RideStatus.REQUESTED)
                .bookedAt(LocalDateTime.now())
                .build();
        Ride savedRide = rideRepository.save(ride);
        return mapToRideResponse(savedRide);
    }

    @Override
    public RideResponse acceptRide(AcceptRideRequest request) {
        Ride ride = rideRepository.findById(request.getRideId())
                .orElseThrow(() -> new BusinessException("Ride not found"));
        if (ride.getStatus() != RideStatus.REQUESTED) {
            throw new RuntimeException("Ride is not available for acceptance");
        }
        ride.setDriver(driverRepository.findById(request.getDriverId())
                .orElseThrow(() -> new BusinessException("Driver not found")));
        ride.setStatus(RideStatus.ACCEPTED);
        Ride updatedRide = rideRepository.save(ride);
        return mapToRideResponse(updatedRide);
    }

    @Override
    public RideResponse startRide(Long rideId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new BusinessException("Ride not found"));
        if (ride.getStatus() != RideStatus.ACCEPTED) {
            throw new BusinessException("Ride is not accepted yet");
        }
        ride.setStatus(RideStatus.STARTED);
        ride.setStartedAt(LocalDateTime.now());
        Ride updatedRide = rideRepository.save(ride);
        return mapToRideResponse(updatedRide);
    }

    @Override
    public RideResponse completeRide(Long rideId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new BusinessException("Ride not found"));
        if(ride.getStatus() != RideStatus.STARTED){
            throw new BusinessException("Ride is not completed because its current status is "+ride.getStatus());
        }
        ride.setStatus(RideStatus.COMPLETED);
        ride.setCompletedAt(LocalDateTime.now());
        Ride updatedRide = rideRepository.save(ride);
        return mapToRideResponse(updatedRide);
    }

    @Override
    public RideResponse getRideById(Long rideId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new BusinessException("Ride not found"));
        return mapToRideResponse(ride);
    }

    private RideResponse mapToRideResponse(Ride ride) {
        return RideResponse.builder()
                .rideId(ride.getId())
                .pickupAddress(ride.getPickupAddress())
                .dropAddress(ride.getDropAddress())
                .status(ride.getStatus().name())
                .driverId(ride.getDriver() != null ? ride.getDriver().getId() : null)
                .userId(ride.getUser().getId())
                .build();
    }
    
    @Override
    public RideResponse getCurrentRide(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("User not found"));
        Ride currentRide = rideRepository.findFirstByUserIdAndStatusInOrderByBookedAtDesc(
                user.getId(),
                List.of(
                        RideStatus.REQUESTED,
                        RideStatus.ACCEPTED,
                        RideStatus.STARTED
                )
        ).orElseThrow(() -> new BusinessException("No active ride found for the user"));
        return mapToRideResponse(currentRide);
    }

    @Override
    public RideResponse cancelRide(Long rideId) {

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new BusinessException("Ride not found"));

        if(ride.getStatus() != RideStatus.REQUESTED){
            if(ride.getStatus() == RideStatus.ACCEPTED) {
                throw new BusinessException("Ride is already accepted cannot be cancelled.");
            }
            if(ride.getStatus() == RideStatus.STARTED) {
                throw new BusinessException("Ride is started cannot be cancelled.");
            }
            if(ride.getStatus() == RideStatus.COMPLETED){
                throw new BusinessException("Ride is already completed cannot be cancelled.");
            }
            if(ride.getStatus() == RideStatus.CANCELLED){
                throw new BusinessException("Ride is already cancelled");
            }
        }

        ride.setStatus(RideStatus.CANCELLED);
        Ride updatedRide = rideRepository.save(ride);
        return mapToRideResponse(updatedRide);
    }

    @Override
    public List<RideResponse> getRideHistory(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(("User not found")));
        List<Ride> rides = rideRepository.findByUserIdAndStatus(user.getId(), RideStatus.COMPLETED);
        return rides.stream()
                .map(this::mapToRideResponse)
                .toList();
    }
}