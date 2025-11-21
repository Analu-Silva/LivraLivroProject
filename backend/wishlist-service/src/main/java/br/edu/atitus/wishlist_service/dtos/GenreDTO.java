package br.edu.atitus.wishlist_service.dtos;

public class GenreDTO {
    private Long id;
    private String genre;

    // Getters e setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getGenre() {
        return genre;
    }
    public void setGenre(String genre) {
        this.genre = genre;
    }
}