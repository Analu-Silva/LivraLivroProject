package br.edu.atitus.auth_service.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.atitus.auth_service.entities.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {

	boolean existsByEmail(String email);

	boolean existsByEmailAndIdNot(String email, UUID id);

	Optional<UserEntity> findByEmail(String email);

}
