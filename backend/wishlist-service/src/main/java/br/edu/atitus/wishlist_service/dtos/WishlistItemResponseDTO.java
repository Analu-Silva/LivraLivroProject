package br.edu.atitus.wishlist_service.dtos;

import java.math.BigDecimal;
import java.util.UUID;

public class WishlistItemResponseDTO {
    private UUID id;
    private UUID bookId;
    private BookDTO book;
    private BigDecimal convertedPrice;

    // Getters e setters
    public UUID getId() {
        return id;
    }
    public void setId(UUID id) {
        this.id = id;
    }
    public UUID getBookId() {
        return bookId;
    }
    public void setBookId(UUID bookId) {
        this.bookId = bookId;
    }
    public BookDTO getBook() {
        return book;
    }
    public void setBook(BookDTO book) {
        this.book = book;
    }
    public BigDecimal getConvertedPrice() {
        return convertedPrice;
    }
    public void setConvertedPrice(BigDecimal convertedPrice) {
        this.convertedPrice = convertedPrice;
    }
}