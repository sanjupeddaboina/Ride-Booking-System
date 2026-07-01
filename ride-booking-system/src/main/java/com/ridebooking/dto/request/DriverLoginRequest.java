package com.ridebooking.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverLoginRequest {
    private String email;
    private String password;
}
