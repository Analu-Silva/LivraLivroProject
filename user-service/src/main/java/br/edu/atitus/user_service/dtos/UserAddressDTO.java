package br.edu.atitus.user_service.dtos;

public record UserAddressDTO(String cep, String city, String state, String neighborhood, String street, String streetNumber, String complement) {

}
