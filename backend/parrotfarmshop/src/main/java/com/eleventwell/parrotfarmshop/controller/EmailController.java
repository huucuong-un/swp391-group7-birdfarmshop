package com.eleventwell.parrotfarmshop.controller;

import com.eleventwell.parrotfarmshop.entity.EmailDetailsEntity;
import com.eleventwell.parrotfarmshop.service.impl.EmailService;
import org.apache.catalina.core.ApplicationContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.thymeleaf.TemplateEngine;

@RestController
@CrossOrigin
public class EmailController {
    @Autowired
    private EmailService emailService;


    // Sending a simple Email
    @PostMapping("/api/send-mail")
    public String sendMail(@RequestBody EmailDetailsEntity details)
    {
        String status = emailService.sendSimpleMail(details);
        return status;
    }

    @PostMapping("/api/send-mail/forgot-password")
    public String sendMailForgotPassword(@RequestBody EmailDetailsEntity details)
    {
        String status = emailService.sendSimpleMail(details);
        return status;
    }
    //ko xai cai nay



    //======================================
    // Sending email with attachment
    @PostMapping("/api/send-mail-with-attachment")
    public String sendMailWithAttachment(@RequestBody EmailDetailsEntity details)
    {
        String status = emailService.sendMailWithAttachment(details);
        return status;
    }
}
