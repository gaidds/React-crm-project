export interface HeadCell {
    disablePadding: boolean;
    id: any;
    label: string;
    numeric: boolean;
  }

export type Item = {
    id: string;
  };

export interface Account {
  deals: string;
  contacts: [
    {
      first_name: string;
      last_name: string;
      primary_email: string;
      mobile_number: string;
      department: string;
      profile_pic: string;
      address: {
        street: string;
        city: string;
        state: string;
        postcode: string;
        country: string;
      };
    }
  ];
  description: string;
  name: string;
  website: string;
  industry: string;
  org: {
    name: string;
  };
  assigned_to: [
    {
      user_details: {
        email: string;
      };
    }
  ];
  tags: string[];
  created_by: { id: string };
}

export interface Data {
  deals: any[];
}