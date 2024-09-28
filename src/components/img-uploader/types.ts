import { ChangeEvent } from "react";

export interface ImgUploaderProps {
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    defaultValue?: string;
    externalError?: string;
  }