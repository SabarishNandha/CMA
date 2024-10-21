import { Component, OnInit } from '@angular/core';
import { TokenService } from './Services/token.service';
import { ContactService } from './Services/contact.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'app';
  static userPreferences = `/${'contact-list'}`;
  constructor(public contactService: ContactService, private readonly router: Router, public token: TokenService) { }

  ngOnInit() {


     
      let userCredential = {
        email: "Sabarishnandha1@gmail.com",
        password: "123",
      };

      this.contactService
        .validateUserAndGetToken(userCredential)
        .subscribe(result => {

          if (result.status) {
            this.token.updateToken(result);
            this.router.navigate(['/contact-list'])
          }  
        });
    
  }

   
}
