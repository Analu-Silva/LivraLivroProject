package br.edu.atitus.wishlist_service.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.atitus.wishlist_service.entities.WishlistItemEntity;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItemEntity, UUID> {
	Optional<WishlistItemEntity> findByBookIdAndWishlistId(UUID bookId, UUID wishlistId);
	Page<WishlistItemEntity> findByWishlistId(UUID wishlistId, Pageable pageable);
	List<WishlistItemEntity> findByWishlistId(UUID wishlistId);
}

