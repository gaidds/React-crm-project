export interface registerErrorsType{
        email?: string[];
        password?: string[];
}


export interface RegisterResponseType{
    error: boolean; 
    message?: string;
    errors?: registerErrorsType | string;
    username?: string;
    access_token?: string;
    refresh_token?: string;
    user_id?: string
}