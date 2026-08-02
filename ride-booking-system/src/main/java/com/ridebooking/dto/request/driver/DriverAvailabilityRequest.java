package com.ridebooking.dto.request.driver;

import com.ridebooking.enums.DriverStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverAvailabilityRequest {

    @NotNull(message = "Driver status is required")
    private DriverStatus status;
}