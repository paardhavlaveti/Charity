package com.charitybridge.backend.repository;

import com.charitybridge.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    // Spring automatically generates the SQL to find a user by their exact email
    Optional<User> findByEmail(String email);
    
    // Find all users who are registered as NGOs
    List<User> findByRole(User.Role role);
    

}