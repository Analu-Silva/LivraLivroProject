package br.edu.atitus.cart_service.controllers;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.edu.atitus.cart_service.dtos.CartItemDTO;
import br.edu.atitus.cart_service.dtos.CartResponseDTO;
import br.edu.atitus.cart_service.services.CartService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/ws/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<CartResponseDTO> getCart(@RequestParam(required = false) String targetCurrency,
                                                  @RequestHeader("X-User-Id") UUID userId, 
                                                  @RequestHeader("X-User-Email") String userEmail,
                                                  @RequestHeader("X-User-Type") Integer userType) {
        CartResponseDTO cart = cartService.getCartWithDetails(userId, targetCurrency);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponseDTO> addItemToCart(@Valid @RequestBody CartItemDTO itemDTO,
                                                        @RequestHeader("X-User-Id") UUID userId, 
                                                        @RequestHeader("X-User-Email") String userEmail,
                                                        @RequestHeader("X-User-Type") Integer userType) {
        CartResponseDTO cart = cartService.addItemToCart(userId, itemDTO.bookId(), itemDTO.quantity());
        return ResponseEntity.status(HttpStatus.CREATED).body(cart);
    }

    @PatchMapping("/items/{itemId}")
    public ResponseEntity<CartResponseDTO> updateItemQuantity(@PathVariable UUID itemId,
                                                             @RequestParam @Valid Integer quantity, 
                                                             @RequestHeader("X-User-Id") UUID userId,
                                                             @RequestHeader("X-User-Email") String userEmail,
                                                             @RequestHeader("X-User-Type") Integer userType) {
        CartResponseDTO cart = cartService.updateItemQuantity(userId, itemId, quantity);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<String> removeItemFromCart(@PathVariable UUID itemId,
                                                    @RequestHeader("X-User-Id") UUID userId, 
                                                    @RequestHeader("X-User-Email") String userEmail,
                                                    @RequestHeader("X-User-Type") Integer userType) {
        cartService.removeItemFromCart(userId, itemId);
        return ResponseEntity.ok("Item removido do carrinho");
    }

    @DeleteMapping
    public ResponseEntity<String> clearCart(@RequestHeader("X-User-Id") UUID userId,
                                           @RequestHeader("X-User-Email") String userEmail, 
                                           @RequestHeader("X-User-Type") Integer userType) {
        cartService.clearCart(userId);
        return ResponseEntity.ok("Carrinho limpo");
    }
}