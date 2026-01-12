package ma.sieger.productservice.service;

import ma.sieger.productservice.dtos.ProductRequestDTO;
import ma.sieger.productservice.dtos.ProductResponseDTO;

import java.util.List;

public interface ProductService {
    ProductResponseDTO createProduct(ProductRequestDTO productRequestDTO);
    List<ProductResponseDTO> getAllProducts();
    ProductResponseDTO getProductById(String id);
    ProductResponseDTO updateProduct(String id, ProductRequestDTO productRequestDTO);
    void deleteProduct(String id);
    ProductResponseDTO decreaseStock(String id, int quantity);
}