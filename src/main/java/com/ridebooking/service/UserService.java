package com.ridebooking.service;

import com.ridebooking.dto.request.user.UserLoginRequest;
import com.ridebooking.dto.request.user.UserRegistrationRequest;
import com.ridebooking.dto.response.ride.RideResponse;
import com.ridebooking.dto.response.user.UserResponse;
import org.springframework.stereotype.Service;

import java.util.List;

public interface UserService {
    UserResponse registerUser(UserRegistrationRequest request);
    UserResponse loginUser(UserLoginRequest request);
    RideResponse getCurrentRide(Long userId);
    List<RideResponse> getRideHistory(Long userId);
    UserResponse getByUserId(Long userId);
}
