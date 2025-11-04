package br.edu.atitus.auth_service.dtos;

import java.time.LocalDate;

public record SignupDTO(String name, String email, String password, String phoneNumber, String cpf, LocalDate dateOfBirth) {

}
