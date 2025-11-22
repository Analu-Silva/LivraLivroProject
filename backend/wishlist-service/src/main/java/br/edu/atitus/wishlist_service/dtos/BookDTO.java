package br.edu.atitus.wishlist_service.dtos;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class BookDTO {

    private UUID id;
    private List<String> imageUrls;
    private String title;
    private String description;
    private BigDecimal price;
    private String currency;
    private Integer numberOfPages;
    private List<GenreDTO> genre;
    private BookConditionDTO bookCondition;
    private Integer numberOfYears;
    private String isbn;
    private BookLanguageDTO bookLanguage;
    private String publisher;
    private Integer stock;
    private UUID seller;
    private String enviroment;
    private BigDecimal convertedPrice;

    // Getters e setters
    public UUID getId() {
        return id;
    }
    public void setId(UUID id) {
        this.id = id;
    }
    public List<String> getImageUrls() {
        return imageUrls;
    }
    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
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
    public List<GenreDTO> getGenre() {
        return genre;
    }
    public void setGenre(List<GenreDTO> genre) {
        this.genre = genre;
    }
    public BookConditionDTO getBookCondition() {
        return bookCondition;
    }
    public void setBookCondition(BookConditionDTO bookCondition) {
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
    public BookLanguageDTO getBookLanguage() {
        return bookLanguage;
    }
    public void setBookLanguage(BookLanguageDTO bookLanguage) {
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
    public UUID getSeller() {
        return seller;
    }
    public void setSeller(UUID seller) {
        this.seller = seller;
    }
    public String getEnviroment() {
        return enviroment;
    }
    public void setEnviroment(String enviroment) {
        this.enviroment = enviroment;
    }
    public BigDecimal getConvertedPrice() {
        return convertedPrice;
    }
    public void setConvertedPrice(BigDecimal convertedPrice) {
        this.convertedPrice = convertedPrice;
    }
}