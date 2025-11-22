package br.edu.atitus.cart_service.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.atitus.cart_service.entities.CartEntity;

@Repository
public interface CartRepository extends JpaRepository<CartEntity, UUID> {
	Optional<CartEntity> findByUserId(UUID userId);
}

