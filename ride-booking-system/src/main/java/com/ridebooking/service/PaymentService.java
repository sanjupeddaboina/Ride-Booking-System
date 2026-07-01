package com.ridebooking.service;

import com.ridebooking.dto.request.PaymentRequest;
import com.ridebooking.dto.response.PaymentResponse;
import org.springframework.stereotype.Service;

@Service
public interface PaymentService {
    PaymentResponse makePayment(PaymentRequest request);
    PaymentResponse getPaymentByRideId(Long rideId);
}
