package ma.sieger.productservice.service.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import ma.sieger.productservice.dtos.ProductRequestDTO;
import ma.sieger.productservice.dtos.ProductResponseDTO;
import ma.sieger.productservice.entities.Product;
import ma.sieger.productservice.mappers.ProductMapper;
import ma.sieger.productservice.repository.ProductRepository;
import ma.sieger.productservice.service.ProductService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    public ProductResponseDTO createProduct(ProductRequestDTO productRequestDTO) {
        Product product = productMapper.toEntity(productRequestDTO);
        Product savedProduct = productRepository.save(product);
        return productMapper.fromEntity(savedProduct);
    }

    @Override
    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(productMapper::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponseDTO getProductById(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with ID: " + id));
        return productMapper.fromEntity(product);
    }

    @Override
    public ProductResponseDTO updateProduct(String id, ProductRequestDTO productRequestDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with ID: " + id));

        product.setName(productRequestDTO.name());
        product.setDescription(productRequestDTO.description());
        product.setPrice(productRequestDTO.price());
        product.setQuantity(productRequestDTO.quantity());
        product.setImageUrl(productRequestDTO.imageUrl());

        Product updatedProduct = productRepository.save(product);
        return productMapper.fromEntity(updatedProduct);
    }

    @Override
    public void deleteProduct(String id) {
        if (!productRepository.existsById(id)) {
            throw new EntityNotFoundException("Product not found with ID: " + id);
        }
        productRepository.deleteById(id);
    }

    @Override
    public ProductResponseDTO decreaseStock(String id, int quantity) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with ID: " + id));
        
        if (product.getQuantity() < quantity) {
            throw new IllegalArgumentException("Insufficient stock. Available: " + product.getQuantity() + ", Requested: " + quantity);
        }
        
        product.setQuantity(product.getQuantity() - quantity);
        Product updatedProduct = productRepository.save(product);
        return productMapper.fromEntity(updatedProduct);
    }
}