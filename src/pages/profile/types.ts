export interface UserDataProps {
    userData: {
        date_of_joining: string;
        address:{
            address_line:string;
            city: string; 
            country: string; 
            postcode: string; 
            state: string; 
            street: string; 
        }
        has_marketing_access: boolean;
        has_sales_access: boolean;
        id: string;
        is_active: boolean;
        phone: string | null;
        role: string;
        user_details : {
            email: string;
            first_name: string |null;
            id: string;
            is_active: boolean;
            last_name: string | null;
            profile_pic: string
        }
    }
   
}