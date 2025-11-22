package br.edu.atitus.cart_service.dtos;

public class BookConditionDTO {
    private Long id;
    private String condition;

    // Getters e setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getCondition() {
        return condition;
    }
    public void setCondition(String condition) {
        this.condition = condition;
    }
}