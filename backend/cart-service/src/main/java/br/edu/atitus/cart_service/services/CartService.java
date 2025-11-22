package br.edu.atitus.cart_service.services;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import br.edu.atitus.cart_service.clients.BookClient;
import br.edu.atitus.cart_service.clients.BookResponse;
import br.edu.atitus.cart_service.clients.CurrencyClient;
import br.edu.atitus.cart_service.clients.CurrencyResponse;
import br.edu.atitus.cart_service.entities.CartEntity;
import br.edu.atitus.cart_service.entities.CartItemEntity;
import br.edu.atitus.cart_service.repositories.CartRepository;
import jakarta.transaction.Transactional;

@Service
public class CartService {

	private final CartRepository cartRepository;
	private final BookClient bookClient;
	private final CurrencyClient currencyClient;

	public CartService(CartRepository cartRepository, BookClient bookClient, CurrencyClient currencyClient) {
		this.cartRepository = cartRepository;
		this.bookClient = bookClient;
		this.currencyClient = currencyClient;
	}

	@Transactional
	public CartEntity getOrCreateCart(UUID userId) {
		Optional<CartEntity> existingCart = cartRepository.findByUserId(userId);
		if (existingCart.isPresent()) {
			return existingCart.get();
		}
		CartEntity newCart = new CartEntity();
		newCart.setUserId(userId);
		return cartRepository.save(newCart);
	}

	@Transactional
	public CartEntity addItemToCart(UUID userId, UUID bookId, Integer quantity) {
		CartEntity cart = getOrCreateCart(userId);
		if (cart.getItems() == null) {
			cart.setItems(new java.util.ArrayList<>());
		}
		Optional<CartItemEntity> existingItem = cart.getItems().stream()
				.filter(item -> item.getBookId().equals(bookId)).findFirst();
		if (existingItem.isPresent()) {
			CartItemEntity item = existingItem.get();
			item.setQuantity(item.getQuantity() + quantity);
		} else {
			CartItemEntity newItem = new CartItemEntity();
			newItem.setBookId(bookId);
			newItem.setQuantity(quantity);
			newItem.setCart(cart);
			cart.getItems().add(newItem);
		}
		return cartRepository.save(cart);
	}

	@Transactional
	public CartEntity updateItemQuantity(UUID userId, UUID itemId, Integer quantity) {
		CartEntity cart = getOrCreateCart(userId);
		if (cart.getItems() == null || cart.getItems().isEmpty()) {
			throw new RuntimeException("Cart is empty");
		}
		CartItemEntity item = cart.getItems().stream().filter(i -> i.getId().equals(itemId)).findFirst()
				.orElseThrow(() -> new RuntimeException("Item not found in cart"));
		if (quantity <= 0) {
			cart.getItems().remove(item);
		} else {
			item.setQuantity(quantity);
		}
		return cartRepository.save(cart);
	}

	@Transactional
	public void removeItemFromCart(UUID userId, UUID itemId) {
		CartEntity cart = getOrCreateCart(userId);
		if (cart.getItems() == null || cart.getItems().isEmpty()) {
			throw new RuntimeException("Cart is empty");
		}
		CartItemEntity item = cart.getItems().stream().filter(i -> i.getId().equals(itemId)).findFirst()
				.orElseThrow(() -> new RuntimeException("Item not found in cart"));
		cart.getItems().remove(item);
		cartRepository.save(cart);
	}

	@Transactional
	public void clearCart(UUID userId) {
		CartEntity cart = getOrCreateCart(userId);
		if (cart.getItems() == null) {
			cart.setItems(new java.util.ArrayList<>());
		}
		cart.getItems().clear();
		cartRepository.save(cart);
	}

	public CartEntity getCartWithDetails(UUID userId, String targetCurrency) {
		CartEntity cart = getOrCreateCart(userId);
		if (cart.getItems() == null) {
			cart.setItems(new java.util.ArrayList<>());
		}
		BigDecimal totalPrice = BigDecimal.ZERO;
		BigDecimal totalConvertedPrice = BigDecimal.ZERO;
		for (CartItemEntity item : cart.getItems()) {
			try {
				BookResponse book = bookClient.getBookByIdWithCurrency(item.getBookId(), targetCurrency);
				item.setBook(book);
				if (book != null) {
					BigDecimal quantity = new BigDecimal(item.getQuantity());
					BigDecimal itemTotalPrice = book.price().multiply(quantity);
					totalPrice = totalPrice.add(itemTotalPrice);
					if (book.convertedPrice() != null && book.convertedPrice().compareTo(BigDecimal.ONE.negate()) != 0) {
						BigDecimal convertedItemPrice = book.convertedPrice().multiply(quantity);
						item.setConvertedPrice(convertedItemPrice);
						totalConvertedPrice = totalConvertedPrice.add(convertedItemPrice);
					}
				}
			} catch (Exception e) {
				continue;
			}
		}
		cart.setTotalPrice(totalPrice);
		cart.setTotalConvertedPrice(totalConvertedPrice);
		return cart;
	}
}

