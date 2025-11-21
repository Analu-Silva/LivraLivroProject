package br.edu.atitus.wishlist_service.services;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import br.edu.atitus.wishlist_service.clients.BookClient;
import br.edu.atitus.wishlist_service.clients.BookResponse;
import br.edu.atitus.wishlist_service.clients.CurrencyClient;
import br.edu.atitus.wishlist_service.clients.CurrencyResponse;
import br.edu.atitus.wishlist_service.entities.WishlistEntity;
import br.edu.atitus.wishlist_service.entities.WishlistItemEntity;
import br.edu.atitus.wishlist_service.repositories.WishlistItemRepository;
import br.edu.atitus.wishlist_service.repositories.WishlistRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final BookClient bookClient;
    private final CurrencyClient currencyClient;

    @PersistenceContext
    private EntityManager entityManager;

    public WishlistService(WishlistRepository wishlistRepository,
            WishlistItemRepository wishlistItemRepository,
            BookClient bookClient, CurrencyClient currencyClient) {
        this.wishlistRepository = wishlistRepository;
        this.wishlistItemRepository = wishlistItemRepository;
        this.bookClient = bookClient;
        this.currencyClient = currencyClient;
    }

    @Transactional
    public WishlistEntity getOrCreateWishlist(UUID userId) {
        Optional<WishlistEntity> existingWishlist = wishlistRepository.findByUserId(userId);
        if (existingWishlist.isPresent()) {
            return existingWishlist.get();
        }

        WishlistEntity newWishlist = new WishlistEntity();
        newWishlist.setUserId(userId);
        newWishlist.setItems(new java.util.ArrayList<>());
        return wishlistRepository.save(newWishlist);
    }

    @Transactional
    public WishlistEntity addItemToWishlist(UUID userId, UUID bookId) {
        BookResponse book;
        try {
            book = bookClient.getBookById(bookId);
        } catch (Exception e) {
            throw new IllegalArgumentException("Livro com ID " + bookId + " não encontrado.");
        }

        if (book == null) {
            throw new IllegalArgumentException("Livro com ID " + bookId + " não encontrado.");
        }

        WishlistEntity wishlist = getOrCreateWishlist(userId);
        boolean alreadyExists = wishlistItemRepository.findByBookIdAndWishlistId(bookId, wishlist.getId()).isPresent();
        if (alreadyExists) {
            throw new IllegalArgumentException("O livro já está na lista de desejos.");
        }

        WishlistItemEntity newItem = new WishlistItemEntity();
        newItem.setBookId(bookId);
        newItem.setWishlist(wishlist);

        if (wishlist.getItems() == null) {
            wishlist.setItems(new java.util.ArrayList<>());
        }

        wishlist.getItems().add(newItem);
        return wishlistRepository.save(wishlist);
    }

    @Transactional
    public void removeItemFromWishlist(UUID userId, UUID itemId) {
        WishlistEntity wishlist = getOrCreateWishlist(userId);
        if (wishlist.getItems() == null || wishlist.getItems().isEmpty()) {
            throw new RuntimeException("Wishlist está vazia");
        }

        WishlistItemEntity item = wishlist.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item não encontrado na wishlist"));

        wishlistItemRepository.delete(item);
        wishlist.getItems().remove(item);
        wishlistRepository.save(wishlist);
    }

    @Transactional
    public void removeItemByBookId(UUID userId, UUID bookId) {
        WishlistEntity wishlist = getOrCreateWishlist(userId);
        if (wishlist.getItems() == null || wishlist.getItems().isEmpty()) {
            throw new RuntimeException("Wishlist está vazia");
        }

        WishlistItemEntity item = wishlist.getItems().stream()
                .filter(i -> i.getBookId().equals(bookId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Livro não encontrado na wishlist"));

        wishlistItemRepository.delete(item);
        wishlist.getItems().remove(item);
        wishlistRepository.save(wishlist);
    }

    @Transactional
    public void clearWishlist(UUID userId) {
        try {
            Optional<WishlistEntity> wishlistOpt = wishlistRepository.findByUserId(userId);
            
            if (wishlistOpt.isPresent()) {
                UUID wishlistId = wishlistOpt.get().getId();
                wishlistItemRepository.deleteByWishlistId(wishlistId);
                wishlistItemRepository.flush();
                entityManager.flush();
            }
            
        } catch (Exception e) {
            throw new RuntimeException("Erro ao limpar lista de desejos", e);
        }
    }

    @Transactional
    public WishlistEntity getWishlistWithDetails(UUID userId, String targetCurrency) {
        WishlistEntity wishlist = getOrCreateWishlist(userId);
        List<WishlistItemEntity> items = wishlist.getItems();

        if (items != null && !items.isEmpty()) {
            for (WishlistItemEntity item : items) {
                if (item.getBookId() != null) {
                    try {
                        BookResponse book = bookClient.getBookById(item.getBookId());
                        item.setBook(book);
                        if (book != null && book.price() != null) {
                            CurrencyResponse currencyResponse = currencyClient.getCurrency(
                                book.price().doubleValue(),
                                book.currency(),
                                targetCurrency
                            );
                            item.setConvertedPrice(currencyResponse.getConvertedValue());
                        }
                    } catch (Exception e) {
                        continue;
                    }
                }
            }
        }
        return wishlist;
    }

    public Page<WishlistItemEntity> getWishlistItemsPaginated(UUID userId, String targetCurrency, Pageable pageable) {
        WishlistEntity wishlist = getOrCreateWishlist(userId);
        Page<WishlistItemEntity> items = wishlistItemRepository.findByWishlistId(wishlist.getId(), pageable);

        for (WishlistItemEntity item : items) {
            try {
                BookResponse book = bookClient.getBookById(item.getBookId());
                item.setBook(book);
                if (book != null && book.price() != null) {
                    CurrencyResponse currencyResponse = currencyClient.getCurrency(
                        book.price().doubleValue(),
                        book.currency(),
                        targetCurrency
                    );
                    item.setConvertedPrice(currencyResponse.getConvertedValue());
                }
            } catch (Exception e) {
                continue;
            }
        }
        return items;
    }

    public boolean isBookInWishlist(UUID userId, UUID bookId) {
        WishlistEntity wishlist = getOrCreateWishlist(userId);
        if (wishlist.getItems() == null || wishlist.getItems().isEmpty()) {
            return false;
        }
        return wishlist.getItems().stream()
                .anyMatch(item -> item.getBookId().equals(bookId));
    }
}