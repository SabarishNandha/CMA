import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ContactListComponent } from './contact-list.component';
import { ContactService } from '../Services/contact.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CreateContactComponent } from '../create-contact/create-contact.component';
import { ContactDto } from '../Modal/ContactDto';

class MockContactService {
  getContact() {
    return of([{ contactId: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' } as ContactDto]);
  }

  DeleteContact(contactId: number) {
    return of(true);
  }
}

describe('ContactListComponent', () => {
  let component: ContactListComponent;
  let fixture: ComponentFixture<ContactListComponent>;
  let contactService: ContactService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactListComponent, ModalDirective, CreateContactComponent],
      providers: [
        { provide: ContactService, useClass: MockContactService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactListComponent);
    component = fixture.componentInstance;
    contactService = TestBed.inject(ContactService);

    // Mock the deleteContactModal to avoid using the real ModalDirective
    component.deleteContactModal = {
      show: jasmine.createSpy('show'),
      hide: jasmine.createSpy('hide')
    } as unknown as ModalDirective;

    // Mock the contactComponent
    component.contactComponent = {
      openModal: jasmine.createSpy('openModal')
    } as unknown as CreateContactComponent;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getContactListOnload on init', () => {
    spyOn(component, 'getContactListOnload');
    component.ngOnInit();
    expect(component.getContactListOnload).toHaveBeenCalled();
  });

  it('should load contacts on getContactListOnload', () => {
    component.getContactListOnload();
    expect(component.contacts.length).toBeGreaterThan(0);
    expect(component.contacts[0].firstName).toEqual('John');
  });

  it('should open contact modal when createContact is called', () => {
    component.createContact();
    expect(component.contactComponent.openModal).toHaveBeenCalled();
  });

  it('should update selectedContactId when updateContact is called', () => {
    const contactId = 5;
    component.updateContact(contactId);
    expect(component.selectedContactId).toBe(contactId);
  });

  it('should open delete modal when openDeleteContactModal is called', () => {
    const contactId = 2;
    component.openDeleteContactModal(contactId);
    expect(component.isDeleteMode).toBeTrue();
    expect(component.selectedContactId).toBe(contactId);
    expect(component.deleteContactModal.show).toHaveBeenCalled();
  });

  it('should call deleteContact on service when deleteContact is called', () => {
    spyOn(contactService, 'DeleteContact').and.callThrough();
    component.selectedContactId = 1;
    component.deleteContact();
    expect(contactService.DeleteContact).toHaveBeenCalledWith(1);
  });

  it('should reload contact list and close delete modal after deleting contact', () => {
    spyOn(contactService, 'DeleteContact').and.returnValue(of(true));
    spyOn(component, 'getContactListOnload');

    component.selectedContactId = 1;
    component.deleteContact();

    expect(component.getContactListOnload).toHaveBeenCalled();
    expect(component.deleteContactModal.hide).toHaveBeenCalled();
  });

  it('should reset modal state when closeDeleteModal is called', () => {
    component.isDeleteMode = true;
    component.selectedContactId = 5;
    component.closeDeleteModal();
    expect(component.isDeleteMode).toBeFalse();
    expect(component.selectedContactId).toBe(0);
    expect(component.deleteContactModal.hide).toHaveBeenCalled();
  });

  it('should reset modal state when resetModal is called', () => {
    component.isDeleteMode = true;
    component.selectedContactId = 5;
    component.resetModal();
    expect(component.isDeleteMode).toBeFalse();
    expect(component.selectedContactId).toBe(0);
  });
});
