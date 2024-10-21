import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CreateContactComponent } from './create-contact.component';
import { ContactService } from '../Services/contact.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ContactDto } from '../Modal/ContactDto';
import { ValidationHelper } from '../Utility/validation-helper';

class MockContactService {
  getContactsById(id: number) {
    return of({ contactId: id, email: 'test@example.com', firstName: 'Test', lastName: 'User' } as ContactDto);
  }

  createContact(contact: ContactDto) {
    return of(contact);
  }

  UpdateContact(contact: ContactDto) {
    return of(contact);
  }
}

describe('CreateContactComponent', () => {
  let component: CreateContactComponent;
  let fixture: ComponentFixture<CreateContactComponent>;
  let contactService: ContactService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateContactComponent, ModalDirective],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ContactService, useClass: MockContactService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateContactComponent);
    component = fixture.componentInstance;
    contactService = TestBed.inject(ContactService);

    // Mock the contactModal to avoid using the real ModalDirective
    component.contactModal = {
      show: jasmine.createSpy('show'),
      hide: jasmine.createSpy('hide')
    } as unknown as ModalDirective;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.contactForm).toBeDefined();
    expect(component.contactForm.get('contactId')?.value).toBe(0);
    expect(component.contactForm.get('email')?.value).toBe('');
    expect(component.contactForm.get('firstName')?.value).toBe('');
    expect(component.contactForm.get('lastName')?.value).toBe('');
  });

  it('should open the modal and reset the form when openModal is called', () => {
    component.openModal();
    expect(component.contactForm.get('contactId')?.value).toBeNull();
    expect(component.contactForm.get('email')?.value).toBe('');
    expect(component.contactForm.get('firstName')?.value).toBe('');
    expect(component.contactForm.get('lastName')?.value).toBe('');
    expect(component.contactModal.show).toHaveBeenCalled();
  });

  it('should hide the modal and emit closeClick when closeModal is called', () => {
    spyOn(component.closeClick, 'emit');

    component.closeModal();

    expect(component.contactModal.hide).toHaveBeenCalled();
    expect(component.closeClick.emit).toHaveBeenCalledWith(true);
    expect(component.submitted).toBeFalse();
  });

  it('should load contact details when selectedContactId changes and show the modal', () => {
    spyOn(contactService, 'getContactsById').and.callThrough();
    component.selectedContactId = 1;

    component.ngOnChanges({
      selectedContactId: {
        currentValue: 1,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(contactService.getContactsById).toHaveBeenCalledWith(1);
    expect(component.contactForm.get('email')?.value).toBe('test@example.com');
    expect(component.contactModal.show).toHaveBeenCalled();
  });

  it('should validate the form and show validation errors if invalid on saveContactForm', () => {
    spyOn(ValidationHelper, 'validateAllFormFields');

    component.contactForm.get('email')?.setValue('');
    component.saveContactForm();

    expect(component.submitted).toBeTrue();
    expect(ValidationHelper.validateAllFormFields).toHaveBeenCalledWith(component.contactForm);
    expect(component.contactForm.invalid).toBeTrue();
  });

  it('should call createContact if contactId is 0 and form is valid', () => {
    spyOn(contactService, 'createContact').and.callThrough();
    spyOn(component, 'handleSaveSuccess').and.callThrough();

    component.contactForm.setValue({
      contactId: 0,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    });

    component.saveContactForm();

    expect(contactService.createContact).toHaveBeenCalled();
    expect(component.handleSaveSuccess).toHaveBeenCalled();
  });

  it('should call UpdateContact if contactId is greater than 0 and form is valid', () => {
    spyOn(contactService, 'UpdateContact').and.callThrough();
    spyOn(component, 'handleSaveSuccess').and.callThrough();

    component.contactForm.setValue({
      contactId: 1,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    });

    component.saveContactForm();

    expect(contactService.UpdateContact).toHaveBeenCalled();
    expect(component.handleSaveSuccess).toHaveBeenCalled();
  });

  it('should reset form and hide modal on successful save', () => {
    spyOn(component.saveClick, 'emit');

    component.handleSaveSuccess();

    expect(component.contactModal.hide).toHaveBeenCalled();
    expect(component.saveClick.emit).toHaveBeenCalledWith(true);
    expect(component.submitted).toBeFalse();
    expect(component.contactForm.get('contactId')?.value).toBe(0);
  });
});
