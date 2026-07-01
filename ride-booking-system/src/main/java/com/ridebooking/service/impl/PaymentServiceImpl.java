package com.ridebooking.service.impl;

import com.ridebooking.dto.request.PaymentRequest;
import com.ridebooking.dto.response.PaymentResponse;
import com.ridebooking.enums.PaymentMethod;
import com.ridebooking.enums.RideStatus;
import com.ridebooking.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.ridebooking.entity.Payment;
import com.ridebooking.entity.Ride;
import com.ridebooking.enums.PaymentStatus;
import com.ridebooking.repository.PaymentRepository;
import com.ridebooking.repository.RideRepository;

import java.time.LocalDateTime;
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final RideRepository rideRepository;

    @Override
    public PaymentResponse makePayment(PaymentRequest request) {
        Ride ride = rideRepository.findById(request.getRideId())
                .orElseThrow(() -> new RuntimeException("Ride not found"));
        if (ride.getStatus() != RideStatus.COMPLETED) {
            throw new RuntimeException("Payment can only be made for completed rides");
        }
        Payment payment = Payment.builder()
                .amount(request.getAmount())
                .paymentMethod(PaymentMethod.valueOf(request.getPaymentMethod()))
                .paymentStatus(PaymentStatus.SUCCESS)
                .paidAt(LocalDateTime.now())
                .ride(ride)
                .build();
        Payment savedPayment = paymentRepository.save(payment);
        return mapToPaymentResponse(savedPayment);
    }

    @Override
    public PaymentResponse getPaymentByRideId(Long rideId) {
        Payment payment = paymentRepository.findByRideId(rideId)
                .orElseThrow(() -> new RuntimeException("Payment not found for the given ride ID"));
        return mapToPaymentResponse(payment);
    }
    private PaymentResponse mapToPaymentResponse(Payment payment) {

        return PaymentResponse.builder()
                .paymentId(payment.getId())
                .rideId(payment.getRide().getId())
                .amount(payment.getAmount())
                .status(payment.getPaymentStatus().name())
                .build();
    }
}
