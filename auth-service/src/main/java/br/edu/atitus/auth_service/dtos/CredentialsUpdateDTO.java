package br.edu.atitus.auth_service.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public record CredentialsUpdateDTO(String email,
		@JsonProperty(access = JsonProperty.Access.WRITE_ONLY) String password) {

}
