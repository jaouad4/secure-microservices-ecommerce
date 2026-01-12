package ma.sieger.orderservice.services;

import ma.sieger.orderservice.clients.ProductRestClient;
import ma.sieger.orderservice.dtos.OrderLineItemDTO;
import ma.sieger.orderservice.dtos.OrderRequestDTO;
import ma.sieger.orderservice.dtos.OrderResponseDTO;
import ma.sieger.orderservice.entities.Order;
import ma.sieger.orderservice.entities.OrderLine;
import ma.sieger.orderservice.enums.OrderStatus;
import ma.sieger.orderservice.mappers.OrderMapper;
import ma.sieger.orderservice.model.Product;
import ma.sieger.orderservice.repositories.OrderLineRepository;
import ma.sieger.orderservice.repositories.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderLineRepository orderLineRepository;
    private final ProductRestClient productRestClient;
    private final OrderMapper orderMapper;

    public OrderServiceImpl(OrderRepository orderRepository,
                            OrderLineRepository orderLineRepository,
                            ProductRestClient productRestClient,
                            OrderMapper orderMapper) {
        this.orderRepository = orderRepository;
        this.orderLineRepository = orderLineRepository;
        this.productRestClient = productRestClient;
        this.orderMapper = orderMapper;
    }

    @Override
    public OrderResponseDTO placeOrder(OrderRequestDTO orderRequest, String userId) {
        Order order = new Order();
        order.setUserId(userId);
        order.setDate(LocalDate.now());
        order.setStatus(OrderStatus.CREATED);

        order.setOrderLines(new ArrayList<>());

        Order savedOrder = orderRepository.save(order);

        orderRequest.getProducts().forEach((productId, quantity) -> {
            Product product = productRestClient.findProductById(productId);

            // Verify stock availability
            if (product.getQuantity() < quantity) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName() + 
                    ". Available: " + product.getQuantity() + ", Requested: " + quantity);
            }

            // Decrease stock in product service
            productRestClient.decreaseStock(productId, quantity);

            OrderLine orderLine = new OrderLine();
            orderLine.setProductId(productId);
            orderLine.setPrice(product.getPrice());
            orderLine.setQuantity(quantity);
            orderLine.setOrder(savedOrder);

            orderLineRepository.save(orderLine);
            savedOrder.getOrderLines().add(orderLine);
        });

        return getOrderById(savedOrder.getId());
    }

    @Override
    public OrderResponseDTO getOrderById(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderResponseDTO response = orderMapper.fromOrder(order);

        if (order.getOrderLines() != null) {
            List<OrderLineItemDTO> lineItems = order.getOrderLines().stream().map(line -> {
                Product product = productRestClient.findProductById(line.getProductId());
                return orderMapper.fromOrderLine(line, product);
            }).collect(Collectors.toList());
            response.setOrderLines(lineItems);
        } else {
            response.setOrderLines(new ArrayList<>());
        }

        return response;
    }

    @Override
    public List<OrderResponseDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(order -> getOrderById(order.getId()))
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponseDTO> getOrdersByUserId(String userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream()
                .map(order -> getOrderById(order.getId()))
                .collect(Collectors.toList());
    }
}