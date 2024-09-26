import { DealFormData, ContactFormData } from "../modal/types";
import { SelectChangeEvent } from "@mui/material";
import { FormErrors } from "../modal/types";
import { Deal } from "../../pages/deals/Deals";

export type DealsFormProps = {
    mode: 'add' | 'edit';
    handleInputChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<any>
    ) => void;
    handleAutocompleteChange: (
      event: React.ChangeEvent<{}>,
      newValue: User[]
    ) => void;
    formData: DealFormData ;
    errors?: FormErrors;
    data: {
      accounts_list: any[];
      contacts_list: any[];
      currency: any[];
      countries: any[];
      deal_source: any[];
      industries: any[];
      stage: any[];
      users: any[];
      deals: Deal[];
    };
  }; 


  export type User={
    id: string;
    user__email: string;
  };

  export type ContactFormProps = {
    mode: 'add' | 'edit';
    handleInputChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<any>
    ) => void;
    formData: ContactFormData;
    data: {
      countries: any[];
      accounts: any[];
    };
    errors?: FormErrors;
  }; 