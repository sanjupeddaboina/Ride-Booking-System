package com.ridebooking.dto.request.ride;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AcceptRideRequest {

    @NotNull(message = "Driver ID is required")
    private Long driverId;
}