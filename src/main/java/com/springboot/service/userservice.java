package com.springboot.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.springboot.entity.Books;
import com.springboot.entity.User;
import com.springboot.repositry.bookrepositry;
import com.springboot.repositry.userrepositry;

@Service
public class userservice {
	
	@Autowired 
	userrepositry repo;
	
	@Autowired
	bookrepositry brepo;
	
	private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

	 public String register(User user) {
	        if (repo.findByEmail(user.getEmail()) != null) {
	            return "Email already registered!";
	        }
	        if (user.getRole() == null || user.getRole().isEmpty()) {
	            user.setRole("USER"); // default role should be uppercase
	        }
	        // Encode password before saving
	        user.setPassword(encoder.encode(user.getPassword()));
	        repo.save(user);
	     
	        if("ADMIN".equalsIgnoreCase(user.getRole())) {
	            return "Admin registered successfully";
	        } else {
	            return "User registered successfully!";
	        }
	    }
	    
	    // New method for authentication
	    public User authenticateUser(String email, String password, String role) {
	        User user = repo.findByEmail(email);
	        if (user != null && encoder.matches(password, user.getPassword())) {
	            return user;
	        }
	        return null;
	    }
	    
	    // Keep the old method for backward compatibility
	    public String login(String email, String password, String role) {
	        User user = repo.findByEmail(email);
	        if (user != null && encoder.matches(password, user.getPassword())) {
	            if (user.getRole().equalsIgnoreCase(role)) {
	                return "Login successful as " + role + "!";
	            } else {
	                return "Role mismatch! You are registered as " + user.getRole();
	            }
	        }
	        return "Invalid email or password!";
	    }

		public List<Books> getallbooksdata() {
			// TODO Auto-generated method stub
			return brepo.findAll();
		}
	   

}
