package com.ridebooking.service.impl;

import com.ridebooking.dto.request.payement.PaymentRequest;
import com.ridebooking.dto.response.payement.PaymentResponse;
import com.ridebooking.enums.RideStatus;
import com.ridebooking.exception.BusinessException;
import com.ridebooking.exception.ResourceNotFoundException;
import com.ridebooking.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ridebooking.entity.Payment;
import com.ridebooking.entity.Ride;
import com.ridebooking.enums.PaymentStatus;
import com.ridebooking.repository.PaymentRepository;
import com.ridebooking.repository.RideRepository;

import java.time.LocalDateTime;
@Service
@Transactional(readOnly = true)
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final RideRepository rideRepository;

    public PaymentServiceImpl(
            PaymentRepository paymentRepository,
            RideRepository rideRepository) {

        this.paymentRepository = paymentRepository;
        this.rideRepository = rideRepository;
    }

    @Override
    @Transactional
    public PaymentResponse makePayment(@Valid PaymentRequest request) {

        Ride ride = getRideById(request.getRideId());

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
                .ride(ride)
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        return mapToPaymentResponse(savedPayment);
    }

    @Transactional
    public Ride getRideById(Long RideId) {
        return rideRepository.findById(RideId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Ride not found with id: " + RideId));
    }

    @Override
    public PaymentResponse getPaymentByRideId(Long rideId) {
        Payment payment = paymentRepository.findByRideId(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for the given ride ID"));
        return mapToPaymentResponse(payment);
    }
    private PaymentResponse mapToPaymentResponse(Payment payment) {

        return PaymentResponse.builder()
                .id(payment.getId())
                .rideId(payment.getRide().getId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .paymentStatus(payment.getPaymentStatus())
                .paymentTime(payment.getPaymentTime())
                .build();
    }
}
