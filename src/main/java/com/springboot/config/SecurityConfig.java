package com.springboot.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import com.springboot.entity.Books;
import com.springboot.entity.User;
import com.springboot.repositry.bookrepositry;
import com.springboot.repositry.userrepositry;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	@Autowired 
    userrepositry repo;
    
    @Autowired  // Add this annotation
    bookrepositry brepo;
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/signup", "/login", "/css/**", "/js/**", "/images/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/home/**").hasRole("USER")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .loginProcessingUrl("/login") // Spring Security will handle POST /login
                .usernameParameter("email")     // 👈 accept email instead of "username"
                .passwordParameter("password")
                .successHandler(customAuthenticationSuccessHandler()) 
                .failureUrl("/login?error=true")
                .permitAll()
            )
            .logout(logout -> logout.permitAll())
            .csrf(csrf -> csrf.disable());
            
        return http.build();
    }
    

    @Bean
    public UserDetailsService userDetailsService(userrepositry repo) {
        return username -> {
            System.out.println("Attempting to authenticate user: " + username);
            User user = repo.findByEmail(username);
            if (user == null) {
                System.out.println("User not found: " + username);
                throw new UsernameNotFoundException("User not found");
            }
            System.out.println("User found: " + user.getEmail() + ", Role: " + user.getRole());
            return org.springframework.security.core.userdetails.User
                    .withUsername(user.getEmail())
                    .password(user.getPassword())
                    .roles(user.getRole())
                    .build();
            
        };
    }

    @Bean
    public AuthenticationSuccessHandler customAuthenticationSuccessHandler() {
        return (request, response, authentication) -> {
            String selectedRole = request.getParameter("role");
            String userRole = authentication.getAuthorities().iterator().next().getAuthority();
            
            System.out.println("Selected role: " + selectedRole);
            System.out.println("User actual role: " + userRole);
            
            // Validate role selection if provided
            if (selectedRole != null && !selectedRole.isEmpty()) {
                String expectedRole = "ROLE_" + selectedRole.toUpperCase();
                
                if (!expectedRole.equals(userRole)) {
                    response.sendRedirect("/login?roleError=true");
                    return;
                }
            }
            
            // Redirect based on actual role
            if ("ROLE_ADMIN".equals(userRole)) {
                response.sendRedirect("/admin");
            } else if ("ROLE_USER".equals(userRole)) {
                response.sendRedirect("/home");
            } else {
                response.sendRedirect("/login?roleError=true");
            }
        };
    }
    
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    public List<Books> getallbooksdata() {
        return brepo.findAll();
    }
}
