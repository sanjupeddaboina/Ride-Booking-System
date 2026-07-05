package com.ridebooking.dto.request;

import com.ridebooking.entity.Ride;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompleteRideRequest {

    @NotNull(message = "Driver ID is required")
    private Long driverId;
}
