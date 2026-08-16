package com.ridebooking.service.impl;

import com.ridebooking.entity.Driver;
import com.ridebooking.entity.User;
import com.ridebooking.repository.DriverRepository;
import com.ridebooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final DriverRepository driverRepository;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        // First check User
        User user = userRepository.findByEmail(email).orElse(null);

        if (user != null) {
            return org.springframework.security.core.userdetails.User
                    .withUsername(user.getEmail())
                    .password(user.getPassword())
                    .roles("USER")
                    .build();
        }

        // Then check Driver
        Driver driver = driverRepository.findByEmail(email).orElse(null);

        if (driver != null) {
            return org.springframework.security.core.userdetails.User
                    .withUsername(driver.getEmail())
                    .password(driver.getPassword())
                    .roles("DRIVER")
                    .build();
        }

        throw new UsernameNotFoundException(
                "Account not found with email: " + email);
    }
}