package br.edu.atitus.cart_service.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.atitus.cart_service.entities.CartItemEntity;

@Repository
public interface CartItemRepository extends JpaRepository<CartItemEntity, UUID> {
}

