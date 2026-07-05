package com.ridebooking.dto.request;
import com.ridebooking.enums.PaymentMethod;


import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class PaymentRequest {

    @NotNull(message = "Ride ID is required")
    private Long rideId;

    @NotNull(message = "Amount is required")
    private Double amount;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;
}
