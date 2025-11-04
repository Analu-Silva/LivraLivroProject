package br.edu.atitus.auth_service.dtos;

import br.edu.atitus.auth_service.entities.UserAuthEntity;

public record SigninResponseDTO(UserAuthEntity user, String token) {

}
