import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DealUrl } from '../../services/ApiUrls';
import { fetchData } from '../../components/FetchData';

interface Deal {
  name: string;
  account: string;
  assigned_to: [{
    user_details:{ 
      email:string;}
  }];
  contacts: [{
    first_name:string;
    last_name: string;
  }];
  website: string;
  stage: string;
  deal_source: string;
  industry: string;
  currency: string;
  country: string;
  value: string;
  probability: number;
  close_date: string;
  description: string;
  tags: string[];
}

const DealDetails: React.FC = () => {
  const { dealId } = useParams<{ dealId: string }>(); 
  const [deal, setDeal] = useState<Deal | null>(null);

  useEffect(() => {     if (dealId) {
    fetchDeal();
  }
}, [dealId]);

    const fetchDeal = async () => {
        const Header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Token'),
            org: localStorage.getItem('org')
        };
        try {
            await fetchData(
                `${DealUrl}/${dealId}`,
                'GET',
                null as any,
                Header
            ).then((res) => {
                console.log(res, 'DEAL');
                if (!res.error) {
                    setDeal(res?.deal_obj);
                }
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


  if (!deal) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Deal Details</h1>
      <p><strong>Name:</strong> {deal.name}</p>
      <p><strong>Account:</strong> {deal.account}</p>
      <p><strong>Assigned To:</strong> {deal.assigned_to.map(user => user.user_details.email).join(', ')}</p>
      <p><strong>Contacts:</strong> {deal.contacts[0].first_name} {deal.contacts[0].last_name}</p>
      <p><strong>Website:</strong> {deal.website}</p>
      <p><strong>Stage:</strong> {deal.stage}</p>
      <p><strong>Deal Source:</strong> {deal.deal_source}</p>
      <p><strong>Industry:</strong> {deal.industry}</p>
      <p><strong>Currency:</strong> {deal.currency}</p>
      <p><strong>Country:</strong> {deal.country}</p>
      <p><strong>Value:</strong> {deal.value}</p>
      <p><strong>Probability:</strong> {deal.probability}%</p>
      <p><strong>Close Date:</strong> {new Date(deal.close_date).toLocaleDateString()}</p>
      <p><strong>Description:</strong> {deal.description}</p>
      <p><strong>Tags:</strong> {deal.tags.join(', ')}</p>
    </div>
  );
};

export default DealDetails;
