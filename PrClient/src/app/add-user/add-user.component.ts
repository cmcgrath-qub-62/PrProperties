import { Component, OnInit } from '@angular/core';
import { ClientsService } from '../services/clients.service';
import { ClientType } from '../models/ClientType';
import { Client } from '../models/client';
import { FormGroup } from '@angular/forms';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  @ViewChild('addUserForm') form;

  clientTypes: ClientType[];
  saveSuccess: boolean;
  userMessage: string = null;
  client: Client;
  uploadSuccess: number;

  constructor(private clientService: ClientsService) { }

  ngOnInit() {
    this.clientService.getClientTypes()
    .subscribe(response => this.clientTypes = response);
    this.client = new Client();
  }

  addUser(client: Client) {
    if(this.form.invalid){
      this.saveSuccess = false;
      this.userMessage = 'Please Check Details and Try Again';
    }
    else {
      this.userMessage = null;
      this.client.imagePath = "default/defaultImage.jpg";
      this.client.clientTypeId = +this.client.clientTypeId;
      this.clientService.postClient(client)
        .subscribe( res => {
            this.saveSuccess = true;
            this.userMessage = 'Client Details Saved';
        },
        err => {
            this.saveSuccess = false;
            this.userMessage = 'Error Saving Client Details';
        }
       );
    }
   
  }


}
