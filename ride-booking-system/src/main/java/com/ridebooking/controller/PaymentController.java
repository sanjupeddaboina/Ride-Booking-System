package com.ridebooking.controller;

import com.ridebooking.dto.request.PaymentRequest;
import com.ridebooking.dto.response.PaymentResponse;
import com.ridebooking.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/pay")
    public ResponseEntity<PaymentResponse> makePayment(@Valid @RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.makePayment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    @GetMapping("rides/{rideId}")
    public PaymentResponse getPaymentByRideId(@PathVariable Long rideId) {
        return paymentService.getPaymentByRideId(rideId);
    }

}
