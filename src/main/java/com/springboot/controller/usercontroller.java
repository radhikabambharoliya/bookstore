package com.springboot.controller;

import java.util.List;
import java.util.Map;
import com.razorpay.*;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.springboot.entity.Books;
import com.springboot.entity.User;
import com.springboot.repositry.userrepositry;
import com.springboot.service.userservice;


@Controller
public class usercontroller {
	@Autowired
    userservice service;
	
	@Autowired
	userrepositry ur;
	
	
	// ========== USER AUTHENTICATION ENDPOINTS ==========
	
	 @GetMapping("/signup")
	    public String showSignupForm() {
	        return "signup";
	    }

	    @PostMapping("/signup")
	    public String signup(User user, Model model) {
	        String msg = service.register(user);
	        model.addAttribute("message", msg);
	        if (msg.toLowerCase().contains("success")) {
	            return "redirect:/login"; // Use redirect
	        }
	        return "signup";
	    }

	    @GetMapping("/login")
	    public String showLoginForm(@RequestParam(value = "error", required = false) String error,
	                               @RequestParam(value = "roleError", required = false) String roleError,
	                               Model model) {
	        if (error != null) {
	            model.addAttribute("message", "Invalid email or password!");
	        }
	        if (roleError != null) {
	            model.addAttribute("message", "Role mismatch! Please select the correct role.");
	        }
	        return "login";
	    }

	    @PostMapping("/login")
	    public String login(@RequestParam String email,
	                        @RequestParam String password,
						    @RequestParam String role,
	                        Model model, 
	                        RedirectAttributes redirectAttributes) {
	        
	        User user = service.authenticateUser(email, password, role);
	        
	        if (user == null) {
	            model.addAttribute("message", "Invalid email or password!");
	            return "redirect:/login";
	        }
	        if (!user.getRole().equalsIgnoreCase(role)) {
	            model.addAttribute("message", "Role mismatch! You are registered as " + user.getRole());
	            System.out.println("no match role");
	            return "redirect:/login";
	           
	        }
	        
	        // Add user info to model
	        model.addAttribute("username", user.getUsername());
	        
	        if ("ADMIN".equalsIgnoreCase(role)) {
	            return "redirect:/admin";
	        } else if ("USER".equalsIgnoreCase(role)) {
	            return "redirect:/home";
	        }
	        
	        model.addAttribute("message", "Invalid role!");
	        return "login";
	    }
	 // ========== DASHBOARD ENDPOINTS ==========
	    
	    @GetMapping("/home")
	    public String showUserDashboard() {
	        return "home";
	    }
	    
	    @GetMapping("/admin")
	    public String showAdminDashboard() {
	        return "admin";
	    }
	    
	    // ========== PAYMENT ENDPOINTS ==========
	    
	    @PostMapping("/home/create_order")
		@ResponseBody
		public String createorder(@RequestBody Map<String,Object> data) throws Exception {
//			System.out.println("something happen");
			System.out.println(data);
			
			String amountStr = data.get("amount").toString().replaceAll("[^0-9.]", "");
		    Double amt = Double.parseDouble(amountStr);
			
			var client = new RazorpayClient("rzp_test_R9T8RmakvWjomW", "3S4KnKQxZUCKucvfvsoy0ejx");

			
			JSONObject ob = new JSONObject(); 
			ob.put("amount", amt * 100); 
			ob.put("currency", "INR"); 
			ob.put("receipt", "txn_123456"); 
			
			//creating a order means oder pass in razorpay account 
			Order order = client.Orders.create(ob); 
			System.out.println("orders:"+ order);
			
		    return order.toString();
		}
	    @PostMapping("/home/save_cod_order")
	    @ResponseBody
	    public String saveCODOrder(@RequestBody Map<String, Object> data) {
	        System.out.println("Saving COD order...");
	        System.out.println(data);

	        try {
	            // Extract order details
	            String orderId = data.get("orderId").toString();
	            String name = data.get("name").toString();
	            String email = data.get("email").toString();
	            String phone = data.get("phone").toString();
	            String address = data.get("address").toString();
	            String paymentMethod = data.get("paymentMethod").toString();
	            Double amount = Double.parseDouble(data.get("amount").toString());
	            String paymentStatus = data.get("paymentStatus").toString();
	            String orderStatus = data.get("orderStatus").toString();

	            // Create Books entity for COD order
	            Books codOrder = new Books();
	            codOrder.setOrderid(orderId);
	            codOrder.setName(name);
	            codOrder.setEmail(email);
	            codOrder.setPhone(phone);  // You'll need to add this field to Books entity
	            codOrder.setAddress(address);
	            codOrder.setAmount(amount);
	            codOrder.setPaymentMethod(paymentMethod);  // You'll need to add this field
	            codOrder.setPaymentStatus(paymentStatus);  // You'll need to add this field
	            codOrder.setOrderStatus(orderStatus);      // You'll need to add this field
	            
	            // For COD orders, payment ID will be null
	            codOrder.setPayid("COD_" + orderId);
	            codOrder.setSignature("COD_ORDER");

	            // Save to database
	            ur.save(codOrder);

	            return "COD Order placed successfully";
	            
	        } catch (Exception e) {
	            System.out.println("Error saving COD order: " + e.getMessage());
	            return "Error placing COD order";
	        }
	    }

	    // Also update your existing save_payment method to include phone and items
	    @PostMapping("/home/save_payment")
	    @ResponseBody
	    public String savePayment(@RequestBody Map<String, Object> data) {
	        System.out.println("Saving payment...");
	        System.out.println(data);

	        try {
	            // Extract details
	            String paymentId = data.get("razorpay_payment_id").toString();
	            String orderId = data.get("razorpay_order_id").toString();
	            String signature = data.get("razorpay_signature").toString();
	            String name = data.get("name").toString();
	            String email = data.get("email").toString();
	            String phone = data.get("phone").toString();
	            String address = data.get("address").toString();
	            Double amount = Double.parseDouble(data.get("amount").toString());

	            Books bk = new Books();
	            bk.setPayid(paymentId);
	            bk.setOrderid(orderId);
	            bk.setSignature(signature);
	            bk.setName(name);
	            bk.setEmail(email);
	            bk.setPhone(phone);
	            bk.setAddress(address);
	            bk.setAmount(amount);
	            bk.setPaymentMethod("Online Payment");
	            bk.setPaymentStatus("Paid");
	            bk.setOrderStatus("Confirmed");
	            
	            ur.save(bk);

	            return "Payment stored successfully";
	            
	        } catch (Exception e) {
	            System.out.println("Error saving payment: " + e.getMessage());
	            return "Error saving payment";
	        }
	    }
	    
	    // ========== ORDERS DISPLAY ENDPOINTS ==========

	 // Shows simple orders page with server-side rendering
	 // Shows simple orders page with server-side rendering
	    @GetMapping("/show")
	    public String getallbook(Model model) {
	        List<Books> book = service.getallbooksdata();
	        model.addAttribute("books", book); 
	        return "showdata"; // Shows showdata.html with orders
	    }
	    
	    // Shows fancy orders management page
	    @GetMapping("/orders")
	    public String showOrdersPage() {
	        return "orders"; // Shows orders.html (your fancy page)
	    }
	    
	    // ========== API ENDPOINTS (Return JSON Data) ==========
	    
	    // Main API endpoint for your fancy orders page
	    @GetMapping("/api/orders/all")
	    @ResponseBody
	    public List<Books> getAllOrders() {
	        return service.getallbooksdata(); // Returns JSON data
	    }
	    
	    // Backup API endpoint
	    @GetMapping("/all")
	    @ResponseBody
	    public List<Books> getAllOrdersOld() {
	        return service.getallbooksdata(); // Returns JSON data
	    }
    
}
