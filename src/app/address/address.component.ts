import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Address, AddressService } from '../services/address.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css'],
})
export class AddressComponent implements OnInit, OnDestroy {

  addressForm!: FormGroup;
  isEditMode = false;
  editIndex: number | null = null;
  openChange: boolean = false;
  countriesList: string[] = [];
  statesList: string[] = [];
  subAdd: Subscription = new Subscription();
  subCountriesLst: Subscription = new Subscription();

  @Input() selectedAddress: Address = {
    addressLine1: "", addressLine2: "", city: "", country: "", id: "", saved: true,
    state: "", zipCode: ""
  };
  @Input() addresses: Address[] = [];
  @Output() selectDiffrentAddress = new EventEmitter<Address>();

  constructor(private fb: FormBuilder, private addressService: AddressService) { }

  ngOnInit(): void {
    this.initForm();
    this.getCountriesList();
  }

  ngOnDestroy(): void {
    this.subAdd.unsubscribe();
    this.subCountriesLst.unsubscribe();
  }

  initForm(): void {
    this.addressForm = this.fb.group({
      id: [''],
      addressLine1: ['', [Validators.required]],
      addressLine2: [''],
      city: ['', [Validators.required]],
      state: [{ value: '', disabled: true }],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      country: ['', [Validators.required]],
      saved: [true],
    });
  }

  newAddress = (): void => {
    this.isEditMode = false;
    this.resetForm();
    this.openChange = true;
  }

  onCountryChange(selectedCountry: string): void {
    const stateControl = this.addressForm.get('state');
    if (selectedCountry === 'Canada' || selectedCountry === 'USA') {
      stateControl?.enable();
      this.addressService.getStateList(selectedCountry).subscribe((states) => {
        this.statesList = states;
      });
    } else {
      stateControl?.disable();
      this.statesList = [];
      stateControl?.reset();
    }
  }

  selectAddress = (address: Address): void => {
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

      this.subAdd = this.addressService.addNewAddress(formData).subscribe(address => {
        this.openChange = false;
        this.selectAddress(address);
        this.resetForm();
      }, (error) => {
        console.log(error)
      });

    }
  }

  getCountriesList(): void {
    this.subCountriesLst = this.addressService.getCountriesList().subscribe(countries => {
      this.countriesList = countries
    }, error => {

    })
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
    this.addressForm.get('state')?.disable();
  }
}
