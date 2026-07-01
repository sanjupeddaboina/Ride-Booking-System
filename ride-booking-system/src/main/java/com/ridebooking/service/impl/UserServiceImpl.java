package com.ridebooking.service.impl;

import com.ridebooking.dto.request.UserLoginRequest;
import com.ridebooking.dto.request.UserRegistrationRequest;
import com.ridebooking.dto.response.UserResponse;
import com.ridebooking.repository.UserRepository;
import com.ridebooking.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.ridebooking.entity.User;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor

public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    public UserResponse registerUser(UserRegistrationRequest request) {
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword()) // In real applications, hashes the password
                .phoneNumber(request.getPhoneNumber())
                .createdAt(LocalDateTime.now())
                .build();

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
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
