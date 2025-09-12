package com.springboot.repositry;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.springboot.entity.Books;

@Repository        
public interface bookrepositry extends JpaRepository<Books,Integer> {

}
