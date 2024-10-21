 
import { DataService } from "./data.service";
import { Observable } from 'rxjs'; 
import { Injectable } from "@angular/core";

@Injectable()
export class TokenService  { 
  

  updateToken(authenticationResult: any) { 
    this.setTokenData(
      authenticationResult.tokenResult
    ); 
  }
  setTokenData(tokenData: any) {
     
    this.setAccessToken(tokenData.token); 
    this.setExpiresIn(tokenData.expiresIn);
  }
  setAccessToken(value: string): void {
    this.setItem("accessToken", value);
  }
  setExpiresIn(value: string): void {
    this.setItem("expiresin", value);
  }
  getAccessToken(): string {
    return this.getItem("accessToken");
  }

  public setItem(key: string, value: any) {
    value = JSON.stringify(value); 
    localStorage.setItem(key, value);
  }
  public getItem(key:any): string {
    var value = localStorage.getItem(key);
    
    return value ? JSON.parse(value) : null;
  }
 
}
 
