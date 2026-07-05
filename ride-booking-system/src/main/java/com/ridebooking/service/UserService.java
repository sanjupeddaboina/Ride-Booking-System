package com.ridebooking.service;

import com.ridebooking.dto.request.UserLoginRequest;
import com.ridebooking.dto.request.UserRegistrationRequest;
import com.ridebooking.dto.response.RideResponse;
import com.ridebooking.dto.response.UserResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {
    UserResponse registerUser(UserRegistrationRequest request);
    UserResponse loginUser(UserLoginRequest request);
    RideResponse getCurrentRide(Long userId);
    List<RideResponse> getRideHistory(Long userId);
    UserResponse getByUserId(Long userId);
}
