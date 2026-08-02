package com.ridebooking.service;

import com.ridebooking.dto.request.payement.PaymentRequest;
import com.ridebooking.dto.response.payement.PaymentResponse;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

public interface PaymentService {
    PaymentResponse makePayment(@Valid PaymentRequest request);
    PaymentResponse getPaymentByRideId(Long rideId);
}
