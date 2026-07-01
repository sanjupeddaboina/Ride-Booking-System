package com.ridebooking.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class UserLoginRequest {
    private String email;
    private String password;
}
