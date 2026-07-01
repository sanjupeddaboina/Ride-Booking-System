package com.ridebooking.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class PaymentResponse {
    private Long paymentId;
    private Long rideId;
    private Double amount;
    private String status;
}
