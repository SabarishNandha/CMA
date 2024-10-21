import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactListComponent } from './contact-list.component';
import { ContactService } from '../Services/contact.service';
import { CreateContactComponent } from '../create-contact/create-contact.component';
import { BsModalService, ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import { ContactDto } from '../Modal/ContactDto'; // Import your ContactDto
import { By } from '@angular/platform-browser';
import { ElementRef } from '@angular/core';

describe('ContactListComponent', () => {
  let component: ContactListComponent;
  let fixture: ComponentFixture<ContactListComponent>;
  let mockContactService: jasmine.SpyObj<ContactService>; 

  beforeEach(async () => {
    mockContactService = jasmine.createSpyObj('ContactService', ['getContact', 'DeleteContact']);
    await TestBed.configureTestingModule({
      imports: [ // Import ModalModule
        ModalModule.forRoot(), // Add this line to provide the modal functionality
      ],
      declarations: [ContactListComponent, CreateContactComponent, ModalDirective],
      providers: [
        { provide: ContactService, useValue: mockContactService },
        BsModalService

      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load contacts on initialization', () => {
    mockContactService.getContact.and.returnValue(of([] as ContactDto[])); // Adjusted for ContactDto[]
    component.ngOnInit();

    expect(mockContactService.getContact).toHaveBeenCalledWith(1, 10);
  });

  it('should load more contacts', () => {
    const mockContacts: ContactDto[] = [{ contactId: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' }];
    mockContactService.getContact.and.returnValue(of(mockContacts)); // Return a mock array of ContactDto

    component.loadMoreContacts();

    expect(mockContactService.getContact).toHaveBeenCalledWith(1, 10);
    expect(component.contacts.length).toBe(0);
    expect(component.currentPage).toBe(2);
  });

  it('should handle error when loading more contacts', () => {
    mockContactService.getContact.and.returnValue(throwError('Error loading contacts'));
    spyOn(console, 'error'); // Spy on console.error to verify it's called

    component.loadMoreContacts();

    expect(component.loading).toBe(false);
    expect(console.error).toHaveBeenCalledWith('Error loading more contacts:', 'Error loading contacts');
  });

  it('should open create contact modal', () => {
    spyOn(component.contactComponent, 'openModal');
    component.createContact();

    expect(component.contactComponent.openModal).toHaveBeenCalled();
  });

  it('should update contact and open modal', () => {
    spyOn(component.contactComponent, 'openModal');
    component.updateContact(1);

    expect(component.selectedContactId).toBe(1);
    expect(component.contactComponent.openModal).toHaveBeenCalled();
  });

 

  it('should delete contact and refresh contact list', () => {
    mockContactService.DeleteContact.and.returnValue(of(null));
    spyOn(component, 'getContactListOnload');

    component.selectedContactId = 1;
    component.deleteContact();

    expect(mockContactService.DeleteContact).toHaveBeenCalledWith(1);
    expect(component.getContactListOnload).toHaveBeenCalled();
  });

  it('should close delete contact modal', () => {
    // Assuming that deleteContactModal is a ViewChild in your component
    spyOn(component.deleteContactModal, 'hide'); // Set up the spy on the hide method

    // Call the method that triggers the modal to hide
    component.closeDeleteModal(); // Adjust this to your actual method

    expect(component.deleteContactModal.hide).toHaveBeenCalled(); // Expect the hide method to have been called
  });

  it('should reset modal state', () => {
    component.resetModal();

    expect(component.isDeleteMode).toBe(false);
    expect(component.selectedContactId).toBe(0);
  });

  it('should not load more contacts on scroll if loading', () => {
    const mockElement = {
      scrollHeight: 1000,
      scrollTop: 900,
      clientHeight: 100,
    };

    // Mock the scrollableContainer to return the mockElement
    component.scrollableContainer = new ElementRef(mockElement);
    component.loading = true; // Set loading state to true

    spyOn(component, 'loadMoreContacts'); // Spy on the loadMoreContacts method

    // Simulate scrolling
    component.onScroll();

    // Check that loadMoreContacts was NOT called
    expect(component.loadMoreContacts).not.toHaveBeenCalled();
  });

  it('should load more contacts on scroll when not loading', () => {
    const mockElement = {
      scrollHeight: 1000,
      scrollTop: 900,
      clientHeight: 100,
    };

    // Mock the scrollableContainer to return the mockElement
    component.scrollableContainer = new ElementRef(mockElement);
    component.loading = false; // Set loading state to false

    spyOn(component, 'loadMoreContacts'); // Spy on the loadMoreContacts method

    // Simulate scrolling
    component.onScroll();

    // Check that loadMoreContacts was called
    expect(component.loadMoreContacts).toHaveBeenCalled();
  });
});
