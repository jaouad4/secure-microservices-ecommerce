package ma.sieger.productservice.mappers;

import ma.sieger.productservice.dtos.ProductRequestDTO;
import ma.sieger.productservice.dtos.ProductResponseDTO;
import ma.sieger.productservice.entities.Product;
import org.springframework.stereotype.Service;

@Service
public class ProductMapper {

    // Entity -> ResponseDTO
    public ProductResponseDTO fromEntity(Product product) {
        return new ProductResponseDTO(
            product.getId(),
            product.getName(),
            product.getDescription(),
            product.getPrice(),
            product.getQuantity(),
            product.getImageUrl()
        );
    }

    // RequestDTO -> Entity
    public Product toEntity(ProductRequestDTO productRequestDTO) {
        return Product.builder()
            .name(productRequestDTO.name())
            .description(productRequestDTO.description())
            .price(productRequestDTO.price())
            .quantity(productRequestDTO.quantity())
            .imageUrl(productRequestDTO.imageUrl())
            .build();
    }
}