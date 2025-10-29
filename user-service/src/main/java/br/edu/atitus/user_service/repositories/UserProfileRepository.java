package br.edu.atitus.user_service.repositories;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import br.edu.atitus.user_service.entities.UserProfileEntity;

public interface UserProfileRepository extends JpaRepository<UserProfileEntity, UUID> {

}
