package com.ridebooking.dto.request;
import com.ridebooking.enums.VehicleType;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverRegistrationRequest {
    private String name;
    private String email;
    private String password;
    private String phoneNumber;
    private String vehicleNumber;
    private VehicleType vehicleType;
    private String licenseNumber;
}
