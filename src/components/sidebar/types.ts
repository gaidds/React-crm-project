import { ReactNode } from "react";

export interface NavProps{
  screen: string,
  open: boolean,
  name: string,
  icone: ReactNode,
  handleClick: (name: string) => void
}