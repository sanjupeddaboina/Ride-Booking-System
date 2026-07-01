package com.ridebooking.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class UserRegistrationRequest {
    private String name;
    private String email;
    private String phoneNumber;
    private String password;
}
