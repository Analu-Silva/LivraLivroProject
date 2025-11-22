package br.edu.atitus.user_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.atitus.user_service.entities.UserProfileGenreEntity;

@Repository
public interface UserGenreRepository extends JpaRepository<UserProfileGenreEntity, Integer> {

}
