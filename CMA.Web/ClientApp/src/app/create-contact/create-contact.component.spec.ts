import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateContactComponent } from './create-contact.component';
import { ContactService } from '../Services/contact.service';
import { FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { BsModalService, ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { By } from '@angular/platform-browser';

describe('CreateContactComponent', () => {
  let component: CreateContactComponent;
  let fixture: ComponentFixture<CreateContactComponent>;
  let mockContactService: jasmine.SpyObj<ContactService>;

  beforeEach(async () => {
    mockContactService = jasmine.createSpyObj('ContactService', ['getContactsById', 'createContact', 'UpdateContact']);
    await TestBed.configureTestingModule({
      imports: [ModalModule.forRoot()],
      declarations: [CreateContactComponent, ModalDirective],
      providers: [
        { provide: ContactService, useValue: mockContactService },
        BsModalService,
        FormBuilder
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the contact form', () => {
    expect(component.contactForm).toBeDefined();
    expect(component.contactForm.controls['email'].value).toBe('');
    expect(component.contactForm.controls['firstName'].value).toBe('');
    expect(component.contactForm.controls['lastName'].value).toBe('');
  });

  it('should open the modal and reset the form', () => {
    spyOn(component.contactModal, 'show');
    component.openModal();

    expect(component.contactModal.show).toHaveBeenCalled();
    expect(component.contactForm.value).toEqual({
      contactId: null,
      email: '',
      firstName: '',
      lastName: ''
    });
  });

  it('should close the modal and emit close event', () => {
    spyOn(component.contactModal, 'hide');
    spyOn(component.closeClick, 'emit');

    component.closeModal();

    expect(component.contactModal.hide).toHaveBeenCalled();
    expect(component.closeClick.emit).toHaveBeenCalledWith(true);
  });

  it('should reset the form state', () => {
    component.selectedContactId = 1;
    component.isDeleteMode = true;
    component.submitted = true;

    component.resetForm();

    expect(component.selectedContactId).toBe(0);
    expect(component.isDeleteMode).toBe(false);
    expect(component.submitted).toBe(false);
    expect(component.contactForm.value).toEqual({
      contactId: null,
      email: '',
      firstName: '',
      lastName: ''
    });
  });

  it('should load contact data when selectedContactId changes', () => {
    const mockContact = {
      contactId: 1,
      email: 'test.example@example.com',
      firstName: 'test',
      lastName: 'example'
    };

    mockContactService.getContactsById.and.returnValue(of(mockContact));
    component.selectedContactId = 1;
    component.ngOnChanges({
      selectedContactId: { currentValue: 1, previousValue: null, firstChange: true, isFirstChange: () => true }
    });

    expect(mockContactService.getContactsById).toHaveBeenCalledWith(1);
    expect(component.contactForm.value).toEqual(mockContact);
  });

 

  it('should save contact form successfully', () => {
    const contactDto = {
      contactId: 0,
      email: 'test.example@example.com',
      firstName: 'test',
      lastName: 'example'
    };

    mockContactService.createContact.and.returnValue(of(null));
    component.contactForm.setValue(contactDto);
    spyOn(component.saveClick, 'emit');
    spyOn(component.contactModal, 'hide'); // Add this spy

    component.saveContactForm();

    expect(component.submitted).toBe(false);
    expect(mockContactService.createContact).toHaveBeenCalledWith(contactDto);
    expect(component.saveClick.emit).toHaveBeenCalledWith(true);
    expect(component.contactModal.hide).toHaveBeenCalled(); // Ensure modal is hidden
  });

  it('should update contact form successfully', () => {
    const contactDto = {
      contactId: 1,
      email: 'test.example@example.com',
      firstName: 'test',
      lastName: 'example'
    };

    mockContactService.UpdateContact.and.returnValue(of(null));
    component.contactForm.setValue(contactDto);
    spyOn(component.saveClick, 'emit');
    spyOn(component.contactModal, 'hide'); // Add this spy

    component.selectedContactId = 1; // Ensure that we're in update mode

    component.saveContactForm();

    expect(component.submitted).toBe(false);
    expect(mockContactService.UpdateContact).toHaveBeenCalledWith(contactDto);
    expect(component.saveClick.emit).toHaveBeenCalledWith(true);
    expect(component.contactModal.hide).toHaveBeenCalled(); // Ensure modal is hidden
  });

  it('should not save invalid form', () => {
    component.contactForm.controls['email'].setValue(''); // Set email to invalid
    component.saveContactForm();

    expect(component.submitted).toBe(true);
    expect(mockContactService.createContact).not.toHaveBeenCalled();
    expect(mockContactService.UpdateContact).not.toHaveBeenCalled();
  });
});
