package com.ridebooking.controller;

import com.ridebooking.dto.request.payement.PaymentRequest;
import com.ridebooking.dto.response.payement.PaymentResponse;
import com.ridebooking.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final PaymentService paymentService;
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<PaymentResponse> makePayment(@Valid @RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.makePayment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/rides/{rideId}")
    public ResponseEntity<PaymentResponse> getPaymentByRideId(@PathVariable Long rideId) {
        PaymentResponse paymentResponse = paymentService.getPaymentByRideId(rideId);
        return ResponseEntity.ok(paymentResponse);
    }

}
