package com.ridebooking.service.impl;

import com.ridebooking.dto.request.UserLoginRequest;
import com.ridebooking.dto.request.UserRegistrationRequest;
import com.ridebooking.dto.response.RideResponse;
import com.ridebooking.dto.response.UserResponse;
import com.ridebooking.entity.Ride;
import com.ridebooking.enums.RideStatus;
import com.ridebooking.exception.AuthenticationException;
import com.ridebooking.exception.BusinessException;
import com.ridebooking.exception.ResourceNotFoundException;
import com.ridebooking.repository.RideRepository;
import com.ridebooking.repository.UserRepository;
import com.ridebooking.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.ridebooking.entity.User;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional

public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RideRepository rideRepository;

    @Override
    public UserResponse registerUser(UserRegistrationRequest request) {
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword()) // In real applications, hashes the password
                .phoneNumber(request.getPhoneNumber())
                .createdAt(LocalDateTime.now())
                .build();
        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            throw new AuthenticationException("Email already exists");
        }
        if(userRepository.findByPhoneNumber(request.getPhoneNumber()).isPresent()){
            throw new AuthenticationException("Phone number already exists");
        }

        User savedUser = userRepository.save(user);

        return UserResponse.builder()
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .phoneNumber(savedUser.getPhoneNumber())
                .createdAt(savedUser.getCreatedAt())
                .build();
    }

    @Override
    public UserResponse loginUser(UserLoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthenticationException("User not found"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new AuthenticationException("Invalid password or email");
        }

        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Override
    public UserResponse getByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Override
    public List<RideResponse> getRideHistory(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(("User not found")));
        List<Ride> rides = rideRepository.findByUserIdAndStatus(user.getId(), RideStatus.COMPLETED);

        return rides.stream()
                .map(this::mapToRideResponse)
                .toList();
    }

    @Override
    public RideResponse getCurrentRide(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Ride currentRide = rideRepository.findFirstByUserIdAndStatusInOrderByBookedAtDesc(
                user.getId(),
                List.of(
                        RideStatus.BOOKED,
                        RideStatus.ACCEPTED,
                        RideStatus.STARTED
                )
        ).orElseThrow(() -> new BusinessException("No active ride found for the user"));
        return mapToRideResponse(currentRide);
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
}
