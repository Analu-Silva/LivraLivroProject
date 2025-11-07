package br.edu.atitus.user_service.dtos;

import br.edu.atitus.user_service.entities.UserProfileGenreEntity;

public record UserDetailsResponseDTO(String userImageUrl, UserProfileGenreEntity userGenre, String description) {

}
