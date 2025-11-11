package br.edu.atitus.auth_service.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.atitus.auth_service.services.UserAuthService;

@RestController
@RequestMapping("/internal")
public class InternalController {

	private UserAuthService userAuthService;

	public InternalController(UserAuthService userAuthService) {
		super();
		this.userAuthService = userAuthService;
	}
	
	@GetMapping("/sellers")
	public ResponseEntity<List<UUID>> getFinalSellerList(){
		List<UUID> sellerIds = userAuthService.getActiveDistinctSellers();
		
		return ResponseEntity.ok(sellerIds);
	}
}
