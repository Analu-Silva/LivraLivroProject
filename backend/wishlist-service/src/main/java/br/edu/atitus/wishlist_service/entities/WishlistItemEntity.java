package br.edu.atitus.wishlist_service.entities;

import java.math.BigDecimal;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

import br.edu.atitus.wishlist_service.clients.BookResponse;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "tb_wishlist_item")
public class WishlistItemEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@Column(nullable = false, unique = false)
	private UUID bookId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "wishlist_id")
	@JsonIgnore
	private WishlistEntity wishlist;

	@Transient
	private BookResponse book;

	@Transient
	private BigDecimal convertedPrice;

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

	public WishlistEntity getWishlist() {
		return wishlist;
	}

	public void setWishlist(WishlistEntity wishlist) {
		this.wishlist = wishlist;
	}

	public BookResponse getBook() {
		return book;
	}

	public void setBook(BookResponse book) {
		this.book = book;
	}

	public BigDecimal getConvertedPrice() {
		return convertedPrice;
	}

	public void setConvertedPrice(BigDecimal convertedPrice) {
		this.convertedPrice = convertedPrice;
	}

}

