package br.edu.atitus.order_service.repositories;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.atitus.order_service.entities.OrderEntity;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, UUID>{
	Page<OrderEntity> findByCustomerId(UUID customerId, Pageable pageable);
}
