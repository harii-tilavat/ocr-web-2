import { Component,OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CreditListModel } from 'src/app/_model';
import { AuthService, FileUploadService } from 'src/app/_services';
import { AlertBoxComponent } from 'src/app/shared/basic/alert-box/alert-box.component';
import { NgbModal } from 'src/app/shared/ng-modal';
import { UserDetailComponent } from '../users-list/user-detail/user-detail.component';
import { CreditDetailComponent } from './credit-detail/credit-detail.component';
@Component({
  selector: 'app-credit-list',
  templateUrl: './credit-list.component.html',
  styleUrls: ['./credit-list.component.scss']
})
export class CreditListComponent implements OnInit, OnDestroy {
  public isLoading = false;
  public pagination = {
    currentPage: 1,
    totalPage: 15,
    itemsPerPage: 10
  }
  public itemList: Array<CreditListModel> = [];
  public subscription: Array<Subscription> = [];
  public displayList: Array<CreditListModel> = [];

  constructor(private authService: AuthService, private toastrService: ToastrService, private router: Router, private modalService: NgbModal, private fileUploadService: FileUploadService) { }
  ngOnInit(): void {
    this.isLoading = true;
    this.subscription.push(
      this.fileUploadService.getCreditList().subscribe({
        next: (res) => {
          this.itemList = res.data;
          this.getPaginatedData();
          console.log("Response => ", res);
          this.isLoading = false;
        },
        error: (err) => {
          console.log("Users list error => ", err);
          this.isLoading = false;
        }
      })
    );
  }
  async viewItem(item: CreditListModel): Promise<any> {
    if (!this.modalService.hasOpenModals()) {
      const modalRef = this.modalService.open(CreditDetailComponent, { size: 'xl', keyboard: false });
      modalRef.componentInstance.creditDetail = item;
    }
  }
  async editItem(item: CreditListModel): Promise<any> {
    if (!this.modalService.hasOpenModals()) {
      const modalRef = this.modalService.open(CreditDetailComponent, { size: 'xl', keyboard: false });
      modalRef.componentInstance.creditDetail = item;
    }
  }
  async deleteItem(item: CreditListModel): Promise<any> {
    if (!this.modalService.hasOpenModals()) {
      const modalRef = this.modalService.open(AlertBoxComponent, { size: 'sm', backdrop: 'static', keyboard: false, centered: true, windowClass: 'alertbox', container: '#alertbox' });
      modalRef.componentInstance.title = 'Are you sure?';
      modalRef.componentInstance.message = 'Do you want to Delete this user!';
      modalRef.componentInstance.icon = { name: 'bx bx-trash' };
      modalRef.componentInstance.type = 'danger';
      modalRef.componentInstance.primeBtn = 'Delete user';
      const result = await modalRef.result;
      // if (result) {
      // }
    }
  }
  getPaginatedData() {
    if(this.itemList && this.itemList.length){
      const startIndex = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
      const endIndex = startIndex + this.pagination.itemsPerPage;
      this.displayList = this.itemList.slice(startIndex, endIndex);
    }
  }
  onPageChange(page: number): void {
    this.pagination.currentPage = page;
  }
  get totalPages(): number {
    const totalPages = Math.floor(this.itemList.length / this.pagination.itemsPerPage) + (this.itemList.length % this.pagination.itemsPerPage === 0 ? 0 : 1);
    return totalPages;
  }
  ngOnDestroy(): void {
    this.subscription.forEach(i => i.unsubscribe());
  }
}
