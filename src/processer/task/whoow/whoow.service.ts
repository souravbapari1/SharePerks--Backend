import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WhoowService {
  private clientId: string;
  private clientSecret: string;
  private host: string;
  private userName: string;
  private password: string;

  constructor(private readonly httpService: HttpService) {
    this.clientId = '9d073d6c0c9de11e0cf36d4e1dfb4f1c';
    this.clientSecret = 'd17cb30ea3a00be6cf6f05f86b7d4c38';
    this.host = 'https://sandbox.woohoo.in';
    this.userName = 'shareperksapisandboxb2b@woohoo.in';
    this.password = 'shareperksapisandboxb2b@1234';
  }

  async getCategories(): Promise<any> {
    try {
      const token = await this.newTokenRequest();
      const req = await this.httpService.axiosRef.get(
        `${this.host}/rest/v3/catalog/categories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(req.data);

      return req.data;
    } catch (error: any) {
      console.log(error?.response?.data);
    }
  }

  private async newTokenRequest(): Promise<string> {
    const req = await this.httpService.axiosRef.post<{
      authorizationCode: string;
    }>(`${this.host}/oauth2/verify`, {
      clientId: this.clientId,
      username: this.userName,
      password: this.password,
    });

    const code = req.data.authorizationCode;

    const tokenReq = await this.httpService.axiosRef.post<{
      token: string;
    }>(`${this.host}/oauth2/token`, {
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      authorizationCode: code,
    });

    return tokenReq.data.token;
  }
}
