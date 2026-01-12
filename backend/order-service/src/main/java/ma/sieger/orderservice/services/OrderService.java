package ma.sieger.orderservice.services;

import ma.sieger.orderservice.dtos.OrderRequestDTO;
import ma.sieger.orderservice.dtos.OrderResponseDTO;

import java.util.List;

public interface OrderService {
    OrderResponseDTO placeOrder(OrderRequestDTO orderRequest, String userId);
    OrderResponseDTO getOrderById(String id);
    List<OrderResponseDTO> getAllOrders();
    List<OrderResponseDTO> getOrdersByUserId(String userId);
}