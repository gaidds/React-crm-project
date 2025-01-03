export type FormErrors = {
  // DealFormErrors fields
  name?: string[];
  account?: string[];
  assigned_to?: string[];
  account_name?: string[];
  phone?: string[];
  email?: string[];
  value?: string[];
  lead_attachment?: string[];
  opportunity_amount?: string[];
  website?: string[];
  description?: string[];
  contacts?: string[];
  stage?: string[];
  deal_source?: string[];
  industry?: string[];
  currency?: string[];
  country?: string[];
  close_date?: string[];
  probability?: number[];
  file?: string[];

  // UserFormErrors fields
  first_name?: string[];
  last_name?: string[];
  role?: string[];
  alternate_phone?: string[];
  address_line?: string[];
  street?: string[];
  city?: string[];
  state?: string[];
  postcode?: string[];
  profile_pic?: string[];
  salutation?: string[];
  language?: string[];
  mobile_number?:string[];
  primary_email?:string[];
  department?: string[];
  has_sales_access?: string[];
  has_marketing_access?: string[];
  is_organization_admin?: string[];
  deal?:string[],
};

export interface DealFormData {
    name: string;
    account: string;
    assigned_to:any[];
    contacts: any[];
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

  export interface Deals{
    deals: DealFormData[];
  }

  export interface ContactFormData{
      salutation: string;
      first_name: string;
      last_name: string;
      organization: string | null;
      title: string;
      website: string;
      profile_pic: string;
      primary_email: string;
      secondary_email?: string; // Optional as some contacts might not have a secondary email
      mobile_number: string;
      secondary_number?: string; // Optional as some contacts might not have a secondary number
      department: string; // Optional as department might not be applicable for all contacts
      country: string;
      language?: string; // Optional as language might not always be provided
      do_not_call?: boolean;
      description?: string; // Optional as description might not always be provided
      linked_in_url?: string; // Optional as not all contacts may have a LinkedIn URL
      facebook_url?: string; // Optional as not all contacts may have a Facebook URL
      twitter_username?: string; // Optional as not all contacts may have a Twitter username
      address_line: string;
      street: string;
      city: string;
      state: string;
      postcode: string;
    }

export interface ContactProfile{
  salutation: string;
  first_name: string;
  last_name: string;
  organization: string | null;
  title: string;
  website: string;
  profile_pic: string;
  primary_email: string;
  secondary_email?: string; // Optional as some contacts might not have a secondary email
  mobile_number: string;
  secondary_number?: string; // Optional as some contacts might not have a secondary number
  department: string; // Optional as department might not be applicable for all contacts
  country: string;
  language?: string; // Optional as language might not always be provided
  do_not_call?: boolean;
  description?: string; // Optional as description might not always be provided
  linked_in_url?: string; // Optional as not all contacts may have a LinkedIn URL
  facebook_url?: string; // Optional as not all contacts may have a Facebook URL
  twitter_username?: string; // Optional as not all contacts may have a Twitter username
  address: Address;
}

    export interface Address {
      address_line: string;
      street: string;
      city: string;
      state: string;
      postcode: string;
      country: string;
    }
    
  export interface AccountFormData{
    name: string;
    phone: string;
    email: string;
    billing_address_line: string;
    billing_street: string;
    billing_city: string;
    billing_state: string;
    billing_postcode: string;
    billing_country: string;
    industry: string;
    contacts: any[];
    teams: string[];
    assigned_to: any[];
    tags: string[];
    account_attachment: string[];
    website: string;
    status: 'open' | 'closed';
    deal: string;
    description?: string;
  }
  

  export interface UserDetails {
    first_name: string;
    last_name: string;
    email: string;
    id?: string;
    is_active?: boolean;
    profile_pic: string | null;
  }
  
  export interface Address {
    address_line: string;
    street: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  }
  
  export interface Profile {
    id?: string;
    user_details: UserDetails;
    role: string;
    address: Address;
    has_marketing_access: boolean;
    has_sales_access: boolean;
    phone: string;
    alternate_phone?: string;
    date_of_joining?: string;
    is_active?: boolean;
  }

  export interface UserFormData{
    id?: string;
    profile_id?: string,
    is_active?:boolean,
    first_name: string,
    last_name: string,
    email: string,
    role: string,
    phone: string,
    alternate_phone?: string,
    address_line: string,
    street: string,
    city: string,
    state: string,
    postcode: string,
    country: string,
    profile_pic: string | null,
    has_sales_access?: boolean,
    has_marketing_access?: boolean,
    is_organization_admin?: boolean
}

  export type ModalProps = {
    mode: 'add' | 'edit';
    page: 'Users' | 'Contacts' | 'Accounts' | 'Deals';
    id?: string;
    data: any;
    icon?: boolean;
    text?: boolean;
    onSaveSuccess: () => Promise<void>;
  };

  export const roleOptions = [
    { label: 'ADMIN', value: 'ADMIN' },
    { label: 'SALES MANAGER', value: 'SALES MANAGER' },
    { label: 'SALES REPRESENTATIVE', value: 'SALES REP' },
    { label: 'USER', value: 'USER' }
];


  const countryMapping: { [key: string]: string } = {
      "United Kingdom": "GB",
      "Afghanistan": "AF",
      "Aland Islands": "AX",
      "Albania": "AL",
      "Algeria": "DZ",
      "American Samoa": "AS",
      "Andorra": "AD",
      "Angola": "AO",
      "Anguilla": "AI",
      "Antarctica": "AQ",
      "Antigua and Barbuda": "AG",
      "Argentina": "AR",
      "Armenia": "AM",
      "Aruba": "AW",
      "Australia": "AU",
      "Austria": "AT",
      "Azerbaijan": "AZ",
      "Bahamas": "BS",
      "Bahrain": "BH",
      "Bangladesh": "BD",
      "Barbados": "BB",
      "Belarus": "BY",
      "Belgium": "BE",
      "Belize": "BZ",
      "Benin": "BJ",
      "Bermuda": "BM",
      "Bhutan": "BT",
      "Bolivia": "BO",
      "Bosnia and Herzegovina": "BA",
      "Botswana": "BW",
      "Bouvet Island": "BV",
      "Brazil": "BR",
      "British Indian Ocean Territory": "IO",
      "Brunei Darussalam": "BN",
      "Bulgaria": "BG",
      "Burkina Faso": "BF",
      "Burundi": "BI",
      "Cambodia": "KH",
      "Cameroon": "CM",
      "Canada": "CA",
      "Cape Verde": "CV",
      "Cayman Islands": "KY",
      "Central African Republic": "CF",
      "Chad": "TD",
      "Chile": "CL",
      "China": "CN",
      "Christmas Island": "CX",
      "Cocos (Keeling) Islands": "CC",
      "Colombia": "CO",
      "Comoros": "KM",
      "Congo": "CG",
      "Congo, The Democratic Republic of the": "CD",
      "Cook Islands": "CK",
      "Costa Rica": "CR",
      "Cote d'Ivoire": "CI",
      "Croatia": "HR",
      "Cuba": "CU",
      "Cyprus": "CY",
      "Czech Republic": "CZ",
      "Denmark": "DK",
      "Djibouti": "DJ",
      "Dominica": "DM",
      "Dominican Republic": "DO",
      "Ecuador": "EC",
      "Egypt": "EG",
      "El Salvador": "SV",
      "Equatorial Guinea": "GQ",
      "Eritrea": "ER",
      "Estonia": "EE",
      "Ethiopia": "ET",
      "Falkland Islands (Malvinas)": "FK",
      "Faroe Islands": "FO",
      "Fiji": "FJ",
      "Finland": "FI",
      "France": "FR",
      "French Guiana": "GF",
      "French Polynesia": "PF",
      "French Southern Territories": "TF",
      "Gabon": "GA",
      "Gambia": "GM",
      "Georgia": "GE",
      "Germany": "DE",
      "Ghana": "GH",
      "Gibraltar": "GI",
      "Greece": "GR",
      "Greenland": "GL",
      "Grenada": "GD",
      "Guadeloupe": "GP",
      "Guam": "GU",
      "Guatemala": "GT",
      "Guernsey": "GG",
      "Guinea": "GN",
      "Guinea-Bissau": "GW",
      "Guyana": "GY",
      "Haiti": "HT",
      "Heard Island and McDonald Islands": "HM",
      "Holy See (Vatican City State)": "VA",
      "Honduras": "HN",
      "Hong Kong": "HK",
      "Hungary": "HU",
      "Iceland": "IS",
      "India": "IN",
      "Indonesia": "ID",
      "Iran, Islamic Republic of": "IR",
      "Iraq": "IQ",
      "Ireland": "IE",
      "Isle of Man": "IM",
      "Israel": "IL",
      "Italy": "IT",
      "Jamaica": "JM",
      "Japan": "JP",
      "Jersey": "JE",
      "Jordan": "JO",
      "Kazakhstan": "KZ",
      "Kenya": "KE",
      "Kiribati": "KI",
      "Korea, Democratic People's Republic of": "KP",
      "Korea, Republic of": "KR",
      "Kuwait": "KW",
      "Kyrgyzstan": "KG",
      "Lao People's Democratic Republic": "LA",
      "Latvia": "LV",
      "Lebanon": "LB",
      "Lesotho": "LS",
      "Liberia": "LR",
      "Libyan Arab Jamahiriya": "LY",
      "Liechtenstein": "LI",
      "Lithuania": "LT",
      "Luxembourg": "LU",
      "Macao": "MO",
      "Macedonia, The Former Yugoslav Republic of": "MK",
      "Madagascar": "MG",
      "Malawi": "MW",
      "Malaysia": "MY",
      "Maldives": "MV",
      "Mali": "ML",
      "Malta": "MT",
      "Marshall Islands": "MH",
      "Martinique": "MQ",
      "Mauritania": "MR",
      "Mauritius": "MU",
      "Mayotte": "YT",
      "Mexico": "MX",
      "Micronesia, Federated States of": "FM",
      "Moldova": "MD",
      "Monaco": "MC",
      "Mongolia": "MN",
      "Montenegro": "ME",
      "Montserrat": "MS",
      "Morocco": "MA",
      "Mozambique": "MZ",
      "Myanmar": "MM",
      "Namibia": "NA",
      "Nauru": "NR",
      "Nepal": "NP",
      "Netherlands": "NL",
      "Netherlands Antilles": "AN",
      "New Caledonia": "NC",
      "New Zealand": "NZ",
      "Nicaragua": "NI",
      "Niger": "NE",
      "Nigeria": "NG",
      "Niue": "NU",
      "Norfolk Island": "NF",
      "Northern Mariana Islands": "MP",
      "Norway": "NO",
      "Oman": "OM",
      "Pakistan": "PK",
      "Palau": "PW",
      "Palestinian Territory, Occupied": "PS",
      "Panama": "PA",
      "Papua New Guinea": "PG",
      "Paraguay": "PY",
      "Peru": "PE",
      "Philippines": "PH",
      "Pitcairn": "PN",
      "Poland": "PL",
      "Portugal": "PT",
      "Puerto Rico": "PR",
      "Qatar": "QA",
      "Reunion": "RE",
      "Romania": "RO",
      "Russian Federation": "RU",
      "Rwanda": "RW",
      "Saint Barthelemy": "BL",
      "Saint Helena": "SH",
      "Saint Kitts and Nevis": "KN",
      "Saint Lucia": "LC",
      "Saint Martin": "MF",
      "Saint Pierre and Miquelon": "PM",
      "Saint Vincent and the Grenadines": "VC",
      "Samoa": "WS",
      "San Marino": "SM",
      "Sao Tome and Principe": "ST",
      "Saudi Arabia": "SA",
      "Senegal": "SN",
      "Serbia": "RS",
      "Seychelles": "SC",
      "Sierra Leone": "SL",
      "Singapore": "SG",
      "Slovakia": "SK",
      "Slovenia": "SI",
      "Solomon Islands": "SB",
      "Somalia": "SO",
      "South Africa": "ZA",
      "South Georgia and the South Sandwich Islands": "GS",
      "Spain": "ES",
      "Sri Lanka": "LK",
      "Sudan": "SD",
      "Suriname": "SR",
      "Svalbard and Jan Mayen": "SJ",
      "Swaziland": "SZ",
      "Sweden": "SE",
      "Switzerland": "CH",
      "Syrian Arab Republic": "SY",
      "Taiwan, Province of China": "TW",
      "Tajikistan": "TJ",
      "Tanzania, United Republic of": "TZ",
      "Thailand": "TH",
      "Timor-Leste": "TL",
      "Togo": "TG",
      "Tokelau": "TK",
      "Tonga": "TO",
      "Trinidad and Tobago": "TT",
      "Tunisia": "TN",
      "Turkey": "TR",
      "Turkmenistan": "TM",
      "Turks and Caicos Islands": "TC",
      "Tuvalu": "TV",
      "Uganda": "UG",
      "Ukraine": "UA",
      "United Arab Emirates": "AE",
      "United States": "US",
      "United States Minor Outlying Islands": "UM",
      "Uruguay": "UY",
      "Uzbekistan": "UZ",
      "Vanuatu": "VU",
      "Venezuela": "VE",
      "Viet Nam": "VN",
      "Virgin Islands, British": "VG",
      "Virgin Islands, U.S.": "VI",
      "Wallis and Futuna": "WF",
      "Western Sahara": "EH",
      "Yemen": "YE",
      "Zambia": "ZM",
      "Zimbabwe": "ZW"
  };
  
  export const convertCountryNameToCode = (countryName: string): string => {
    return countryMapping[countryName] || '';
  };
  
  
