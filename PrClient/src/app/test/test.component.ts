import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { FileService } from '../services/file.service';
import { Papa } from 'ngx-papaparse';
import { Payment } from '../models/payment';
import { ContractsService } from '../services/contracts.service';
import { Client } from '../models/client';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],

})


export class TestComponent implements OnInit {

  public progress: number;
  public message: string;
  csvFile: File;
  payments: Payment[] = [];
  dataList: Payment[];
  path: String;
  client: Client;

  ngOnInit(): void {
  }

  constructor(private http: HttpClient, private papa: Papa, private fileService: FileService, private contractService: ContractsService ) { }

  upload(files, path) {
    if (files.length === 0) {
      return;
    }
    console.log(files);


    const formData = new FormData();

    formData.append('propertyId', 'john');

    for (const file of files) {
      formData.append(file.name, file);
    }

    this.fileService.uploadFiles(formData)
      .subscribe(response => {
        path = response;
        console.log(path);
      });

    // this.http.request(uploadReq).subscribe(event => {
    //   if (event.type === HttpEventType.UploadProgress)
    //     this.progress = Math.round(100 * event.loaded / event.total);
    //   else if (event.type === HttpEventType.Response)
    //     this.message = event.body.toString();
    // });
  }


  onChange(files: File[], payments) {
    if (files[0]) {
      this.payments = [];
      console.log(files[0]);
      this.papa.parse(files[0], {
        header: true,
        skipEmptyLines: true,
        complete: (result, file) => {
          console.table(result.data);
          this.payments = result.data as Payment[];
        }
      });
    }
  }

  postPayments(payments){
    this.contractService.postPayments(payments);
    console.log(payments);
  }

  add(isValid: boolean){
    if(isValid){
        //do something
    }
 }
}
