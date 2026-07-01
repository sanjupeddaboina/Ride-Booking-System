package com.ridebooking.dto.request;
import com.ridebooking.enums.PaymentMethod;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class PaymentRequest {
    private Long rideId;
    private String paymentMethod;
    private Double amount;
}
