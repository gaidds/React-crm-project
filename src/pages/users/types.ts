export interface HeadCell {
    disablePadding: boolean;
    id: any;
    label: string;
    numeric: boolean;
}

export type Item = {
    id: string;
};

export type response = {
    user_details: {
      email: string;
      id: string;
      is_active: boolean;
      profile_pic: string;
    };
    role: string;
    address: {
      address_line: string;
      street: string;
      city: string;
      state: string;
      postcode: string;
      country: string;
    };
    is_organization_admin: boolean;
    has_marketing_access: boolean;
    has_sales_access: boolean;
    phone: string;
    alternate_phone: string;
    date_of_joining: string;
    is_active: boolean;
};