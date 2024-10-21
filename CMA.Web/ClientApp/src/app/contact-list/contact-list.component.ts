import { Component, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ContactDto } from '../Modal/ContactDto';
import { ContactService } from '../Services/contact.service';
import { CreateContactComponent } from '../create-contact/create-contact.component';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent {
  public contacts: ContactDto[] = [];
  selectedContactId: number | null = null;
  @ViewChild('deleteContactModal', { static: true }) deleteContactModal!: ModalDirective;
  @ViewChild('contactComponent', { static: true }) contactComponent!: CreateContactComponent;
  @ViewChild('scrollableContainer', { static: false }) scrollableContainer!: ElementRef;
  isDeleteMode: boolean = false;
  loading = false;
  currentPage = 1;
  pageSize = 10;
  hasMoreContacts = true;

  constructor(private readonly contactService: ContactService) { }

  ngOnInit() {
    this.getContactListOnload();
  }

  loadMoreContacts() {
    if (!this.hasMoreContacts) return;

    this.loading = true;
    this.contactService.getContact(this.currentPage, this.pageSize).subscribe(
      (response: any) => {
        const newContacts = Array.isArray(response.contacts) ? response.contacts : [];
        this.contacts = [...this.contacts, ...newContacts];
        this.hasMoreContacts = newContacts.length === this.pageSize;
        this.currentPage++;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        console.error('Error loading more contacts:', error);
      }
    );
  }


  getContactListOnload() {
    this.hasMoreContacts=true;
    this.selectedContactId = 0;
    this.currentPage = 1;
    this.contacts = [];
    this.loadMoreContacts();
  }

  createContact() {
    if (this.contactComponent != undefined) {
      this.contactComponent.openModal();
    }
  }

  updateContact(contactId: number) {
    this.selectedContactId = contactId;
    if (this.contactComponent != undefined) {
      this.contactComponent.openModal();
    }
  }

  openDeleteContactModal(contactId: number) {
    this.isDeleteMode = true;
    this.selectedContactId = contactId;
    this.deleteContactModal.show();
  }

  deleteContact() {
    if (this.selectedContactId! > 0) {
      this.contactService.DeleteContact(this.selectedContactId!).subscribe(x => {
        this.getContactListOnload();
        this.closeDeleteModal();
      });
    }
  }

  closeDeleteModal() {
    this.resetModal();
    this.deleteContactModal.hide();
  }

  resetModal() {
    this.isDeleteMode = false;
    this.selectedContactId = 0;
  }

  onScroll() {
    const element = this.scrollableContainer?.nativeElement;
    if (element.scrollHeight - element.scrollTop <= element.clientHeight + 100 && !this.loading) {
      this.loadMoreContacts();
    }
  }

 
}
