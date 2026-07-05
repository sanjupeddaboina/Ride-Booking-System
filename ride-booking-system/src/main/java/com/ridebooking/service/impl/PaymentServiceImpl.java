package com.ridebooking.service.impl;

import com.ridebooking.dto.request.PaymentRequest;
import com.ridebooking.dto.response.PaymentResponse;
import com.ridebooking.entity.Driver;
import com.ridebooking.enums.PaymentMethod;
import com.ridebooking.enums.RideStatus;
import com.ridebooking.exception.BusinessException;
import com.ridebooking.exception.ResourceNotFoundException;
import com.ridebooking.repository.DriverRepository;
import com.ridebooking.service.PaymentService;
import jakarta.transaction.Transactional;
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
@Transactional
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final RideRepository rideRepository;
    private final DriverRepository driverRepository;

    @Override
    @Transactional
    public PaymentResponse makePayment(PaymentRequest request) {

        Ride ride = rideRepository.findById(request.getRideId())
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found"));

        if (ride.getStatus() != RideStatus.COMPLETED) {
            throw new BusinessException("Payment can only be made for completed rides.");
        }

        if (paymentRepository.existsByRideId(request.getRideId())) {
            throw new BusinessException("Payment has already been completed for this ride.");
        }

        if (!request.getAmount().equals(ride.getFare())) {
            throw new BusinessException("Payment amount does not match the fare.");
        }
        Payment payment = Payment.builder()
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
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
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for the given ride ID"));
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
