import {
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup
} from '@angular/forms'; 
export class ValidationHelper {
   

  static zeroValueValidator(control: UntypedFormControl) {
    const zeroValue =
      control.value === null ||
      control.value === undefined ||
      control.value === '0' ||
      control.value === 0 ||
      (control.value.toString() || '').trim().length === 0;
    return !zeroValue ? null : { zeroValue: true };
  }

  static createFormArray(dataList: any[], formBuilder: UntypedFormBuilder) {
    if (dataList != null) {
      const formGroupList = dataList.map(item => formBuilder.group(item));
      return formBuilder.array(formGroupList);
    } else {
      return formBuilder.array([]);
    }
  }

  static validateAllFormFields(formGroup: UntypedFormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof UntypedFormControl) { 
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof UntypedFormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  static applyTabHighLight(tabName: string, isValid: boolean) {
    let tabLink = document.getElementById(tabName + '-link');
    let tabBody = document.getElementById(tabName);
    let tabChildBody = document.getElementById(tabName + '-Child');
    if (tabBody != null) {
      isValid ? tabBody.classList.remove("errorTab") : tabBody.classList.add("errorTab");
    }
    if (tabChildBody != null) {
      isValid ? tabChildBody.classList.remove("errorTab") : tabChildBody.classList.add("errorTab");
    }
    if (tabLink != null) {
      isValid ? tabLink.classList.remove("errorTab") : tabLink.classList.add("errorTab");
    }
  }

  static getFormValueByFormControl(formControl: any, controlName: string) {
    return formControl.get([controlName]).value;
  }
  static setFormControlError(formControl: any, controlName: string) {
    formControl.get([controlName]).setErrors({ 'required': true });
    formControl.get([controlName]).markAllAsTouched();
  }
  static clearFormControlError(formControl: any, controlName: string) {
    formControl.get([controlName]).setErrors(null);
  }

  private constructor() { }
}
