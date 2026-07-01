package com.ridebooking.service;

import com.ridebooking.dto.request.UserLoginRequest;
import com.ridebooking.dto.request.UserRegistrationRequest;
import com.ridebooking.dto.response.UserResponse;
import org.springframework.stereotype.Service;

@Service
public interface UserService {
    UserResponse registerUser(UserRegistrationRequest request);
    UserResponse loginUser(UserLoginRequest request);
}
