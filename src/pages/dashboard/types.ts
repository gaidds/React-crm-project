export type Deal = {
  id: string;
  name: string;
  assigned_to: { id: string; name: string }[];
  account_id: string | null;
  account_name: string | null;
  value: string;
  closed_by: string | null;
  close_date: string;
};

export interface Mapdeals {
  id: string;
  name: string;
  value: number;
}

export interface DealsByCountry {
  [countryCode: string]: Mapdeals[];  // country code as key, array of deals as value
}

export interface DealsByCountryProps {
  dealsByCountry: DealsByCountry;  // dealsByCountry is now the object of countries with deals
}

export interface DashboardResponse {
  deals_count: number;
  deals_change_trendline: number;
  win_ratio: number;
  percentage_change_closed_won: number;
  total_revenue_in_euros: number;
  net_income_growth_trendline: number;
  deal_sources_count: Record<string, number>;
  deal_stage_counts: Record<string, number>;
  top_five_deals: Deal[];
  deals_group_by_country: DealsByCountry;  // This is the actual object you need to pass
}

  export type DealStage = {
    state: string;
    count: number; 
    color: string;
  };
