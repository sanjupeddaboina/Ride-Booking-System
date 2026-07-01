package com.ridebooking.controller;

import com.ridebooking.dto.request.PaymentRequest;
import com.ridebooking.dto.response.PaymentResponse;
import com.ridebooking.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public PaymentResponse makePayment(@RequestBody PaymentRequest request) {
        return paymentService.makePayment(request);
    }
    @GetMapping("ride/{rideId}")
    public PaymentResponse getPaymentByRideId(@PathVariable Long rideId) {
        return paymentService.getPaymentByRideId(rideId);
    }

}
