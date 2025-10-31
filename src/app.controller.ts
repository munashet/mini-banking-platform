// src/app.controller.ts
import { Controller, Post, Body } from '@nestjs/common';

@Controller('api/auth')
export class AppController {
  @Post('login')
  login(@Body() body: any) {
    return {
      message: 'LOGIN WORKS!',
      email: body.email,
      password: body.password,
    };
  }
}