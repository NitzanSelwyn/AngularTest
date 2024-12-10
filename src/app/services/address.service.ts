import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Address {
  id: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  saved: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private apiUrl = 'https://du-mock-checkout-7d42d0a76fbf.herokuapp.com/';

  constructor(private http: HttpClient) { }

  getAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(this.apiUrl + 'api/address');
  }

  addNewAddress(address: Address): Observable<Address> {
    return this.http.post<Address>(this.apiUrl + 'api/address', address);
  }
}