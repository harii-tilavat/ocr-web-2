import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { DocumentModel } from 'src/app/_model';
import { AuthService, FileUploadService } from 'src/app/_services';
import { NgbModal } from 'src/app/shared/ng-modal';

@Component({
  selector: 'app-dashboard',

  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public documentList: Array<DocumentModel> = [];
  public totalFiles = {
    totalPdf:0,
    totalPng:0,
    totalJpeg:0
  };
  public username!: string;
  public isLoading!: boolean;
  public subscription: Array<Subscription> = [];
  constructor(private authService: AuthService, private toastrService: ToastrService, private router: Router, private modalService: NgbModal, private fileUploadService: FileUploadService, private route: Router) { }
  ngOnInit(): void {
    const userdata = this.authService.getUserData();
    this.username = userdata.username;
    this.getAllDocs();
  }
  goToRoute(): void {

  }
  getAllDocs(): void {
    this.subscription.push(this.fileUploadService.getAllDocsForAdmin().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.documentList = res.data;
          // this.loaderService.hide();
          this.isLoading = false;
          console.log(this.documentList);
          this.totalFiles.totalPdf = this.documentList.filter(i=>i.file_type === 'application/pdf').length;
          this.totalFiles.totalPng = this.documentList.filter(i=>i.file_type === 'image/png').length;
          this.totalFiles.totalJpeg = this.documentList.filter(i=>i.file_type === 'image/jpeg').length;
        }
      }, error: (err) => {
        console.log("File getting error ==>> ", err);
        this.isLoading = false;
        // this.removeSelectedFile();
      }
    }));
  }
  ngOnDestroy(): void {
    this.subscription.forEach(i => i.unsubscribe());
  }
}
