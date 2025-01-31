package com.example.stockproject.Web;

import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

public interface WebSocketConfigurer {
    void registerWebSocketHandlers(WebSocketHandlerRegistry registry);
}
