import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address, AddressService } from '../services/address.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css'],
})
export class AddressComponent implements OnInit {

  addressForm!: FormGroup;
  isEditMode = false;
  editIndex: number | null = null;
  openChange: boolean = false;

  @Input() selectedAddress: Address = {
    addressLine1: "", addressLine2: "", city: "", country: "", id: "", saved: true,
    state: "", zipCode: ""
  };
  @Input() addresses: Address[] = [];
  @Output() selectDiffrentAddress = new EventEmitter<Address>();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    console.log(this.selectedAddress)
  }

  initForm(): void {
    this.addressForm = this.fb.group({
      id: [],
      addressLine1: ['', [Validators.required]],
      addressLine2: [''],
      city: ['', [Validators.required]],
      state: ['', []],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      country: ['', [Validators.required]],
      saved: [true],
    });
  }

  newAddress = () => {
    this.isEditMode = false;
    this.resetForm();
    this.openChange = true;
  }

  selectAddress = (address: any) => {
    this.selectDiffrentAddress.emit(address)
  }

  onSubmit(): void {
    if (this.addressForm.valid) {
      const formData = this.addressForm.value;
      if (this.isEditMode && this.editIndex !== null) {
        this.addresses[this.editIndex] = formData;
        this.isEditMode = false;
        this.editIndex = null;
      } else {
        this.addresses.push(formData);
      }
      this.openChange = false;
      this.selectAddress(formData)
      this.resetForm();
    }
  }

  onEdit(index: number): void {
    this.openChange = true;
    this.isEditMode = true;
    this.editIndex = index;
    const address = this.addresses[index];
    this.addressForm.patchValue(address);
  }

  onDelete(index: number): void {
    const tempAddress = this.addresses[index];
    this.addresses.splice(index, 1);

    if (this.addresses.length != 0) {
      if (this.selectedAddress.id == tempAddress.id) {
        this.selectAddress(this.addresses[0])
      }
    }
  }

  resetForm(): void {
    this.openChange = false;
    this.addressForm.reset({
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      saved: true,
    });
  }
}
