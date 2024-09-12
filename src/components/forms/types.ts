import { DealFormData } from "../modal/types";
import { SelectChangeEvent } from "@mui/material";

export type DealsFormProps = {
    mode: 'add' | 'edit';
    handleInputChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<any>
    ) => void;
    formData: DealFormData ;
    data: {
      accounts_list: any[];
      contacts_list: any[];
      currency: any[];
      countries: any[];
      deal_source: any[];
      industries: any[];
      stage: any[];
      users: any[];
    };
  }; 