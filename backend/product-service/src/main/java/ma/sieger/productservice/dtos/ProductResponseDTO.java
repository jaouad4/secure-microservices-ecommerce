package ma.sieger.productservice.dtos;

public record ProductResponseDTO(
    String id,
    String name,
    String description,
    double price,
    int quantity
) {}