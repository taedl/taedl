package com.erkoa.adhocapi.web;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class AppControllerAdvice extends ResponseEntityExceptionHandler {
    @ExceptionHandler(value = {ClassNotFoundException.class})
    protected ResponseEntity<Object> handleClassNotFoundException(ClassNotFoundException ex) {
        return new ResponseEntity<Object>("Class not found: ".concat(ex.getMessage()), HttpStatus.FAILED_DEPENDENCY);
    }
}
