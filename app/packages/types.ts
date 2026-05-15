export type LocationType =
  | 'airport'
  | 'hotel'
  | 'restaurant'
  | 'beach'
  | 'amenity'
  | 'yate'
  | 'atraccion';

export interface Location {
  id: number;
  type: LocationType;
  name: string;
}

export interface Vehicle {
  id: number;
  name: string;
  type: string;
  capacity: number;
  image?: string;
}

export interface Driver {
  id: number;
  name: string;
  photo?: string;
  phone?: string;
}

export interface PackageItem {
  id: number;
  type: string;
  name: string;
}

export interface Owner {
  name?: string;
  email?: string;
  role?: string;
}

export interface TourPackage {
  id: number;
  name: string;
  description: string;
  image: string;
  duration: string;
  startTime: string;
  price: number;
  maxPassengers: number;

  pickup: Location;
  dropoff: Location;

  vehicle: Vehicle;
  driver: Driver;
  owner?: Owner;

  items: PackageItem[];
}

export interface Booking {
  id: string;
  packageId: number;
  packageName: string;
  reservationDate: string;
  reservationTime: string;
  passengers: number;
  totalPrice: number;
  status: 'pending' | 'awaiting_payment' | 'confirmed' | 'cancelled';

  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
  };

  snapshot: {
    packageName: string;
    vehicle: string;
    driver: string;
    pickup: string;
    dropoff: string;
    items: string[];
    price: number;
  };

  notes?: string;
}
