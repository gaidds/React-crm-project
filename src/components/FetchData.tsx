import { SERVER } from '../services/ApiUrls'

export const Header = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: localStorage.getItem('Token'),
  org: localStorage.getItem('org')
}

export const Header1 = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: localStorage.getItem('Token')
}

export function fetchData(url: any, method: any, data = '', header: any) {
  return fetch(`${SERVER}${url}`, {
    method,
    headers: header,
    body: data
  }).then((response) => response.json())
}

export const getHeadersWithoutOrg = () => {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('Token') || ''
  };
}
