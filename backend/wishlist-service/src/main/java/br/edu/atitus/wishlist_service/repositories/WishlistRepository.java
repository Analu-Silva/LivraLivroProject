package br.edu.atitus.wishlist_service.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.atitus.wishlist_service.entities.WishlistEntity;

@Repository
public interface WishlistRepository extends JpaRepository<WishlistEntity, UUID> {
	Optional<WishlistEntity> findByUserId(UUID userId);
}

