import { Component, OnInit } from '@angular/core';
import { Address, AddressService } from '../services/address.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cart = {
    id: "94573bc74fda432093c98726131a41e0",
    subtotal: 150,
    shipping: 10,
    tax: 16,
    total: 95.00,
    discount: 16.50,
    paymentMethod: "CreditCard",
    shippingAddress: {
      id: "c7d81604a62b4bb59b3b7f89c9dd4099",
      addressLine1: "test",
      addressLine2: "test",
      city: "Yavne",
      state: "Israel",
      zipCode: "8103908",
      country: "Israel",
      saved: true
    },
    paymentInfo: {
      id: "afbb2d26aeb947c6afa49c94b407696f"
    },
    items: [
      {
        id: "3fad817301db46eca4eaec4c53b31220",
        product: {
          name: "T-Shirt",
          sku: "TSHIRT001",
          sizeColor: "M/Red",
          imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a",
          price: 20,
          discountedPrice: 18
        },
        quantity: 1
      },
      {
        id: "a8f1664da4b9446abe9a72e28d0a79fb",
        product: {
          name: "Jeans",
          sku: "JEANS001",
          sizeColor: "32/Blue",
          imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
          price: 50,
          discountedPrice: 45
        },
        quantity: 1
      },
      {
        id: "67b13e4a4b0747b7a60e4cfec93e08aa",
        product: {
          name: "Shoes",
          sku: "SHOES001",
          sizeColor: "42/Black",
          imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
          price: 80,
          discountedPrice: 72
        },
        quantity: 1
      }
    ],
    appliedCouponCode: null
  };

  addresses: any[] = []

  constructor(private addressService: AddressService) { }

  ngOnInit(): void {
    this.addressService.getAddresses().subscribe(addresses => {
      this.addresses = addresses
    });
  }

  displayedColumns: string[] = ['label', 'value'];

  summaryData = [
    { label: 'Subtotal', value: this.cart.subtotal },
    { label: 'Shipping', value: this.cart.shipping },
    { label: 'Tax', value: this.cart.tax },
    { label: 'Discount', value: this.cart.discount }
  ];

  changeAddress = (address: Address) => {
    this.cart.shippingAddress = address
  }
}
