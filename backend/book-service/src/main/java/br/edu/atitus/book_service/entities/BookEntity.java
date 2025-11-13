package br.edu.atitus.book_service.entities;

import jakarta.persistence.Transient;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_book")
public class BookEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonManagedReference
	private List<BookImageUrlEntity> imagesUrls = new ArrayList<>();

	@Column()
	private String title;

	@Column()
	private BigDecimal price;

	@Column(length = 3)
	private String currency;

	@Column(name = "number_of_pages")
	private Integer numberOfPages;

	@ManyToMany
	@JoinTable(name = "tb_book_genres", joinColumns = @JoinColumn(name = "book_id"), 
	inverseJoinColumns = @JoinColumn(name = "genre_id"))
	private List<BookGenreEntity> genre;

	@ManyToOne
	@JoinColumn(name = "book_condition_id")
	private BookConditionEntity bookCondition;

	@Column(name = "number_of_years")
	private Integer numberOfYears;

	@Column()
	private String isbn;
	
	@ManyToOne
	@JoinColumn(name = "book_language_id")
	private BookLanguageEntity bookLanguage;

	@Column()
	private String publisher;

	@Column()
	private Integer stock;

	@Column()
	private String author;

	@Column()
	private UUID seller;

	@Column()
	private String description;

	@Transient
	private String environment;

	@Transient
	private BigDecimal convertedPrice;

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public List<BookImageUrlEntity> getImagesUrls() {
		return imagesUrls;
	}

	public void setImagesUrls(List<BookImageUrlEntity> imagesUrls) {
		this.imagesUrls = imagesUrls;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	public Integer getNumberOfPages() {
		return numberOfPages;
	}

	public void setNumberOfPages(Integer numberOfPages) {
		this.numberOfPages = numberOfPages;
	}

	public List<BookGenreEntity> getGenre() {
		return genre;
	}

	public void setGenre(List<BookGenreEntity> genre) {
		this.genre = genre;
	}

	public BookConditionEntity getBookCondition() {
		return bookCondition;
	}

	public void setBookCondition(BookConditionEntity bookCondition) {
		this.bookCondition = bookCondition;
	}

	public Integer getNumberOfYears() {
		return numberOfYears;
	}

	public void setNumberOfYears(Integer numberOfYears) {
		this.numberOfYears = numberOfYears;
	}

	public String getIsbn() {
		return isbn;
	}

	public void setIsbn(String isbn) {
		this.isbn = isbn;
	}

	public BookLanguageEntity getBookLanguage() {
		return bookLanguage;
	}

	public void setBookLanguage(BookLanguageEntity bookLanguage) {
		this.bookLanguage = bookLanguage;
	}

	public String getPublisher() {
		return publisher;
	}

	public void setPublisher(String publisher) {
		this.publisher = publisher;
	}

	public Integer getStock() {
		return stock;
	}

	public void setStock(Integer stock) {
		this.stock = stock;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public UUID getSeller() {
		return seller;
	}

	public void setSeller(UUID seller) {
		this.seller = seller;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getEnvironment() {
		return environment;
	}

	public void setEnvironment(String environment) {
		this.environment = environment;
	}

	public BigDecimal getConvertedPrice() {
		return convertedPrice;
	}

	public void setConvertedPrice(BigDecimal convertedPrice) {
		this.convertedPrice = convertedPrice;
	}
}
