package com.springboot.repositry;

import org.springframework.data.jpa.repository.JpaRepository;

import com.springboot.entity.Books;
import com.springboot.entity.User;

public interface userrepositry extends JpaRepository<User,Long> {
	User findByEmail(String email);

	void save(Books bk);
}
