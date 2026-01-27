package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "order_date")
    private LocalDate orderDate;

    @Column(name = "order_status")
    private String orderStatus;

    @Column(name = "total_amount")
    private Double totalAmount;

    @Column(name = "payment_id")
    private Long paymentId;

    // ===== NEW FIELDS (Matching Database Schema) =====

    @Column(name = "address", length = 500)
    private String address;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "phone")
    private String phone;

    // MoMo Payment Fields
    @Column(name = "momo_order_id")
    private String momoOrderId;

    @Column(name = "momo_result_code")
    private Integer momoResultCode;

    @Column(name = "momo_trans_id")
    private Long momoTransId;

    @Column(name = "payment_status")
    private String paymentStatus;

    // Other Fields
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "cancellation_reason")
    private String cancellationReason;

    @Column(name = "discount_amount")
    private Double discountAmount;

    @Column(name = "shipping_fee")
    private Double shippingFee;

    // 1 Order có nhiều OrderItem
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;

    // ===== Getter & Setter =====
    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    // ===== NEW GETTERS & SETTERS =====

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getMomoOrderId() {
        return momoOrderId;
    }

    public void setMomoOrderId(String momoOrderId) {
        this.momoOrderId = momoOrderId;
    }

    public Integer getMomoResultCode() {
        return momoResultCode;
    }

    public void setMomoResultCode(Integer momoResultCode) {
        this.momoResultCode = momoResultCode;
    }

    public Long getMomoTransId() {
        return momoTransId;
    }

    public void setMomoTransId(Long momoTransId) {
        this.momoTransId = momoTransId;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getCancellationReason() {
        return cancellationReason;
    }

    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
    }

    public Double getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(Double discountAmount) {
        this.discountAmount = discountAmount;
    }

    public Double getShippingFee() {
        return shippingFee;
    }

    public void setShippingFee(Double shippingFee) {
        this.shippingFee = shippingFee;
    }
}
