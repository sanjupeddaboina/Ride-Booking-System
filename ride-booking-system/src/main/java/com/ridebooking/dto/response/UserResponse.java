package com.ridebooking.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private LocalDateTime createdAt;
}
