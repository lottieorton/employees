package io.nology.employees.common;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import io.nology.employees.common.dtos.ApiErrorResponse;
import io.nology.employees.common.exceptions.NotFoundException;
import io.nology.employees.common.exceptions.UnprocessableContentException;
import jakarta.servlet.http.HttpServletRequest;

@ControllerAdvice
public class GlobalExceptionHandler {
    private final Logger log = LogManager.getLogger(GlobalExceptionHandler.class);
    
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNotFoundException(NotFoundException ex, HttpServletRequest req) {
        ApiErrorResponse response = ApiErrorResponse.of(HttpStatus.NOT_FOUND, ex.getMessage(), req.getRequestURI());
        log.warn("Resource not found at {}: {}",req.getRequestURI(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UnprocessableContentException.class)
    public ResponseEntity<ApiErrorResponse> handleUnprocessableContentException(UnprocessableContentException ex, HttpServletRequest req) {
        ApiErrorResponse response = ApiErrorResponse.of(HttpStatus.UNPROCESSABLE_CONTENT, ex.getMessage(), req.getRequestURI());
        log.warn("Unprocessable content at {}: {}",req.getRequestURI(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.UNPROCESSABLE_CONTENT);
    }
    
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiErrorResponse> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException ex, HttpServletRequest req) {
        ApiErrorResponse response = ApiErrorResponse.of(HttpStatus.BAD_REQUEST, ex.getMessage(), req.getRequestURI());
        log.warn("Method argument type mismatch at {}: {}",req.getRequestURI(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex, HttpServletRequest req) {
        ApiErrorResponse response = ApiErrorResponse.of(HttpStatus.BAD_REQUEST, ex.getMessage(), req.getRequestURI());
        log.warn("Method argument not valid at {}: {}",req.getRequestURI(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex, HttpServletRequest req) {
        ApiErrorResponse response = ApiErrorResponse.of(HttpStatus.BAD_REQUEST, ex.getMessage(), req.getRequestURI());
        log.warn("Http message not readable at {}: {}",req.getRequestURI(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleDataIntegrityViolationException(DataIntegrityViolationException ex, HttpServletRequest req) {
        ApiErrorResponse response = ApiErrorResponse.of(HttpStatus.BAD_REQUEST, ex.getMessage(), req.getRequestURI());
        log.warn("Data integrity violation at {}: {}",req.getRequestURI(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalStateException(IllegalStateException ex, HttpServletRequest req) {
        ApiErrorResponse response = ApiErrorResponse.of(HttpStatus.BAD_REQUEST, ex.getMessage(), req.getRequestURI());
        log.warn("Illegal state at {}: {}",req.getRequestURI(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGenericException(Exception ex, HttpServletRequest req) {
        ApiErrorResponse response = ApiErrorResponse.of(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred", req.getRequestURI());
        log.error("Unexpected internal server error occurred at {}: {}", req.getRequestURI(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
