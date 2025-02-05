package com.example.stockproject.controller;

import com.example.stockproject.dto.AccountResponseOutput;
import com.example.stockproject.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
public class AccountController {
    private AccountService accountService;

    @Autowired
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    //모의투자 계좌자산조회를 위한 controller
    @GetMapping("/account")
    public Mono<List<AccountResponseOutput>> getAccountInform(){
        return accountService.getAccountInformation();
    }
}
