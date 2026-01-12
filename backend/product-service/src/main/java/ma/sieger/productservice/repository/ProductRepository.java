package ma.sieger.productservice.repository;

import ma.sieger.productservice.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, String> {
    boolean existsByName(String name);
}