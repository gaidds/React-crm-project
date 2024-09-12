export interface DealFormData {
    name: string;
    account: string;
    assigned_to: string[];
    contacts: string[];
    website: string;
    stage: string;
    deal_source: string;
    industry: string;
    currency: string;
    country: string;
    value: number;
    probability: number;
    close_date: string;
    description: string;
    tags: string[];
  }


  export interface ContactFormData{
    name: string;
  }

  export interface AccountFormData{
    name: string;
  }

  export interface UserFormData{
    name: string;
  }

  export type ModalProps = {
    mode: 'add' | 'edit';
    page: 'Users' | 'Contacts' | 'Accounts' | 'Deals';
    id?: string;
    data: any;
    icon?: boolean;
    text?: boolean;
  };
  