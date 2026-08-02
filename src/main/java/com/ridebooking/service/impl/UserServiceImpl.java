package com.ridebooking.service.impl;

import com.ridebooking.dto.request.user.UserLoginRequest;
import com.ridebooking.dto.request.user.UserRegistrationRequest;
import com.ridebooking.dto.response.ride.RideResponse;
import com.ridebooking.dto.response.user.UserResponse;
import com.ridebooking.entity.Ride;
import com.ridebooking.enums.RideStatus;
import com.ridebooking.exception.AuthenticationException;
import com.ridebooking.exception.BusinessException;
import com.ridebooking.exception.ResourceNotFoundException;
import com.ridebooking.repository.RideRepository;
import com.ridebooking.repository.UserRepository;
import com.ridebooking.service.UserService;
import org.springframework.transaction.annotation.Transactional;import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.ridebooking.entity.User;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RideRepository rideRepository;

    public UserServiceImpl(UserRepository userRepository,
                           RideRepository rideRepository) {
        this.userRepository = userRepository;
        this.rideRepository = rideRepository;
    }

    @Override
    public UserResponse registerUser(UserRegistrationRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email already exists");
        }

        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new BusinessException("Phone number already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword())   // Encode later using BCrypt
                .phoneNumber(request.getPhoneNumber())
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);

        return mapToUserResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse loginUser(UserLoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthenticationException("User not found"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new AuthenticationException("Invalid email or password");
        }

        return mapToUserResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getByUserId(Long userId) {

        User user = getUserById(userId);

        return mapToUserResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RideResponse> getRideHistory(Long userId) {

        User user = getUserById(userId);

        List<Ride> rides = rideRepository.findByUserIdAndStatus(
                user.getId(),
                RideStatus.COMPLETED
        );

        return rides.stream()
                .map(this::mapToRideResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public RideResponse getCurrentRide(Long userId) {

        User user = getUserById(userId);

        Ride currentRide = rideRepository
                .findFirstByUserIdAndStatusInOrderByBookedAtDesc(
                        user.getId(),
                        List.of(
                                RideStatus.BOOKED,
                                RideStatus.ACCEPTED,
                                RideStatus.STARTED
                        )
                )
                .orElseThrow(() ->
                        new BusinessException("No active ride found"));

        return mapToRideResponse(currentRide);
    }

    private User getUserById(Long userId) {

        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + userId));
    }

    private UserResponse mapToUserResponse(User user) {

        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private RideResponse mapToRideResponse(Ride ride) {

        return RideResponse.builder()
                .rideId(ride.getId())
                .pickupAddress(ride.getPickupAddress())
                .dropAddress(ride.getDropAddress())
                .vehicleType(ride.getVehicleType())
                .fare(ride.getFare())
                .status(ride.getStatus().name())
                .driverId(ride.getDriver() != null ? ride.getDriver().getId() : null)
                .userId(ride.getUser().getId())
                .bookedAt(ride.getBookedAt())
                .startedAt(ride.getStartedAt())
                .completedAt(ride.getCompletedAt())
                .build();
    }
}
