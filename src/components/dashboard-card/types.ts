import { ReactElement } from "react";
export interface DashboardCardProps {
    title: string;
    content?: string | ReactElement;
    subContent?: string | ReactElement;
    subContentColor?: 'red' | 'green'
}