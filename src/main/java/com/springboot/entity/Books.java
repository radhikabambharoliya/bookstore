package com.springboot.entity;

import jakarta.persistence.*;

@Entity
@Table(name="infobook")
public class Books {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(name="pid")
	private String payid;
	
	@Column(name="oid")
	private String orderid;
	
	@Column(name="sign")
	private String signature;
	
	@Column(name="name")
	private String name;
	
	@Column(name="email")
	private String email;
	
	@Column(name="address")
	private String address;
	
	@Column(name="amount")
	private Double amount;
	private String phone;
    private String paymentMethod;
    private String paymentStatus;
    private String orderStatus;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getPayid() {
		return payid;
	}
	public void setPayid(String payid) {
		this.payid = payid;
	}
	public String getOrderid() {
		return orderid;
	}
	public void setOrderid(String orderid) {
		this.orderid = orderid;
	}
	public String getSignature() {
		return signature;
	}
	public void setSignature(String signature) {
		this.signature = signature;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public Double getAmount() {
		return amount;
	}
	public void setAmount(Double amount) {
		this.amount = amount;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getPaymentMethod() {
		return paymentMethod;
	}
	public void setPaymentMethod(String paymentMethod) {
		this.paymentMethod = paymentMethod;
	}
	public String getPaymentStatus() {
		return paymentStatus;
	}
	public void setPaymentStatus(String paymentStatus) {
		this.paymentStatus = paymentStatus;
	}
	public String getOrderStatus() {
		return orderStatus;
	}
	public void setOrderStatus(String orderStatus) {
		this.orderStatus = orderStatus;
	}
	public Books(int id, String payid, String orderid, String signature, String name, String email, String address,
			Double amount, String phone, String paymentMethod, String paymentStatus, String orderStatus) {
		super();
		this.id = id;
		this.payid = payid;
		this.orderid = orderid;
		this.signature = signature;
		this.name = name;
		this.email = email;
		this.address = address;
		this.amount = amount;
		this.phone = phone;
		this.paymentMethod = paymentMethod;
		this.paymentStatus = paymentStatus;
		this.orderStatus = orderStatus;
	}
	public Books() {
		super();
	}
	@Override
	public String toString() {
		return "Books [id=" + id + ", payid=" + payid + ", orderid=" + orderid + ", signature=" + signature + ", name="
				+ name + ", email=" + email + ", address=" + address + ", amount=" + amount + ", phone=" + phone
				+ ", paymentMethod=" + paymentMethod + ", paymentStatus=" + paymentStatus + ", orderStatus="
				+ orderStatus + "]";
	}

	
	
}
