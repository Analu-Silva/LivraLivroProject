package br.edu.atitus.wishlist_service.controllers;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.edu.atitus.wishlist_service.dtos.WishlistItemRequestDTO;
import br.edu.atitus.wishlist_service.entities.WishlistEntity;
import br.edu.atitus.wishlist_service.entities.WishlistItemEntity;
import br.edu.atitus.wishlist_service.services.WishlistService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/ws/wishlist")
public class WishlistController {

	private final WishlistService wishlistService;

	public WishlistController(WishlistService wishlistService) {
		this.wishlistService = wishlistService;
	}

	@GetMapping
	public ResponseEntity<WishlistEntity> getWishlist(
			@RequestParam(defaultValue = "USD") String currency,
			@RequestHeader("X-User-Id") UUID userId,
			@RequestHeader("X-User-Email") String userEmail,
			@RequestHeader("X-User-Type") Integer userType) {
		
		WishlistEntity wishlist = wishlistService.getWishlistWithDetails(userId, currency.toUpperCase());
		return ResponseEntity.ok(wishlist);
	}

	@GetMapping("/items")
	public ResponseEntity<Page<WishlistItemEntity>> getWishlistItems(
			@PageableDefault(page = 0, size = 10, sort = "id", direction = Direction.ASC) Pageable pageable,
			@RequestParam(defaultValue = "USD") String currency,
			@RequestHeader("X-User-Id") UUID userId,
			@RequestHeader("X-User-Email") String userEmail,
			@RequestHeader("X-User-Type") Integer userType) {
		
		Page<WishlistItemEntity> items = wishlistService.getWishlistItemsPaginated(
				userId, currency.toUpperCase(), pageable);
		return ResponseEntity.ok(items);
	}

	@GetMapping("/check/{bookId}")
	public ResponseEntity<Boolean> checkBookInWishlist(
			@PathVariable UUID bookId,
			@RequestHeader("X-User-Id") UUID userId,
			@RequestHeader("X-User-Email") String userEmail,
			@RequestHeader("X-User-Type") Integer userType) {
		
		boolean isInWishlist = wishlistService.isBookInWishlist(userId, bookId);
		return ResponseEntity.ok(isInWishlist);
	}

	@PostMapping("/items")
	public ResponseEntity<WishlistEntity> addItemToWishlist(
			@Valid @RequestBody WishlistItemRequestDTO itemDTO,
			@RequestHeader("X-User-Id") UUID userId,
			@RequestHeader("X-User-Email") String userEmail,
			@RequestHeader("X-User-Type") Integer userType) {
		
		WishlistEntity wishlist = wishlistService.addItemToWishlist(userId, itemDTO.getBookId());
		return ResponseEntity.status(HttpStatus.CREATED).body(wishlist);
	}

	@DeleteMapping("/items/{itemId}")
	public ResponseEntity<String> removeItemFromWishlist(
			@PathVariable UUID itemId,
			@RequestHeader("X-User-Id") UUID userId,
			@RequestHeader("X-User-Email") String userEmail,
			@RequestHeader("X-User-Type") Integer userType) {
		
		wishlistService.removeItemFromWishlist(userId, itemId);
		return ResponseEntity.ok("Item removido da lista de desejos");
	}

	@DeleteMapping("/items/book/{bookId}")
	public ResponseEntity<String> removeItemByBookId(
			@PathVariable UUID bookId,
			@RequestHeader("X-User-Id") UUID userId,
			@RequestHeader("X-User-Email") String userEmail,
			@RequestHeader("X-User-Type") Integer userType) {
		
		wishlistService.removeItemByBookId(userId, bookId);
		return ResponseEntity.ok("Livro removido da lista de desejos");
	}

	@DeleteMapping
	public ResponseEntity<String> clearWishlist(
			@RequestHeader("X-User-Id") UUID userId,
			@RequestHeader("X-User-Email") String userEmail,
			@RequestHeader("X-User-Type") Integer userType) {
		
		wishlistService.clearWishlist(userId);
		return ResponseEntity.ok("Lista de desejos limpa");
	}
}
