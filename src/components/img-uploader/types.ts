import { ChangeEvent, ReactNode } from "react";

export interface ImgUploaderProps {
    id?:string;
    name:string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    defaultValue?: string;
    externalError?: string;
    customWidget?: ReactNode;
  }