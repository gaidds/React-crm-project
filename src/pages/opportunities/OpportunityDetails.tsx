import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Card,
    Link,
    Avatar,
    Box,
    Snackbar,
    Alert,
    Stack,
    Button,
    Chip
} from '@mui/material';
import { fetchData } from '../../components/FetchData';
import { OpportunityUrl } from '../../services/ApiUrls';
import { Tags } from '../../components/Tags';
import { CustomAppBar } from '../../components/CustomAppBar';
import { FaPlus } from 'react-icons/fa';
import FormateTime from '../../components/FormateTime';
import { Label } from '../../components/Label';
import MyContext, { useMyContext } from '../../context/Context'

export const formatDate = (dateString: any) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

type Response = {
    created_by: {
        email: string;
        id: string;
        profile_pic: string | null;
    };
    user_details: {
        email: string;
        id: string;
        profile_pic: string | null;
    };
    org: { name: string };
    lead: { account_name: string } | null;
    account_attachment: [];
    assigned_to: Array<{ user_details: { email: string; id: string; profile_pic: string | null; } }>;
    billing_address_line: string;
    billing_city: string;
    billing_country: string;
    billing_state: string;
    billing_postcode: string;
    billing_street: string;
    contact_name: string;
    name: string;
    created_at: string;
    created_on: string;
    created_on_arrow: string;
    date_of_birth: string;
    title: string;
    first_name: string;
    last_name: string;
    account_name: string;
    phone: string;
    email: string;
    lead_attachment: string;
    opportunity_amount: string;
    website: string;
    description: string | null;
    contacts: [];
    status: string;
    source: string;
    address_line: string;
    street: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    tags: Array<any>;
    company: string;
    probability: string;
    industry: string;
    skype_ID: string;
    file: string;
    close_date: string;
    organization: string;
    created_from_site: boolean;
    id: string;
    teams: string[];
    leads: string[];
    lead_source: string;
    amount: string;
    currency: string;
    users: Array<{ user_details: { email: string; id: string; profile_pic: string | null; }; }>;
    stage: string;
    closed_on: string;
    opportunity_attachment: Array<string>;
    account: { id: string; name: string };
};

export const OpportunityDetails = (props: any) => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { userRole , profileId, userId} = useMyContext();
    const [opportunityDetails, setOpportunityDetails] = useState<Response | null>(null);
    const [users, setUsers] = useState<Array<{ user_details: { email: string; id: string; profile_pic: string | null; }; }>>([]);

    useEffect(() => {
        getOpportunityDetails(state.opportunityId);
    }, [state.opportunityId]);

    const getOpportunityDetails = (id: string) => {
        const Header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Token'),
            org: localStorage.getItem('org')
        };
        fetchData(`${OpportunityUrl}/${id}/`, 'GET', null as any, Header)
            .then((res) => {
                console.log(res, 'edd');
                if (!res.error) {
                    setOpportunityDetails(res?.opportunity_obj);
                    setUsers(res?.users || []);
                }
            })
            .catch((err) => {
                console.error('Error:', err);
                <Snackbar open={true} autoHideDuration={4000} onClose={() => navigate('/app/opportunities')}>
                    <Alert onClose={() => navigate('/app/opportunities')} severity="error" sx={{ width: '100%' }}>
                        Failed to load!
                    </Alert>
                </Snackbar>;
            });
    };

    const editHandle = () => {
        navigate('/app/opportunities/edit-opportunity', {
            state: {
                value: {
                    name: opportunityDetails?.name,
                    account: opportunityDetails?.account?.id,
                    amount: opportunityDetails?.amount,
                    currency: opportunityDetails?.currency,
                    stage: opportunityDetails?.stage,
                    teams: opportunityDetails?.teams,
                    lead_source: opportunityDetails?.lead_source,
                    probability: opportunityDetails?.probability,
                    description: opportunityDetails?.description,
                    assigned_to: opportunityDetails?.assigned_to,
                    contact_name: opportunityDetails?.contact_name,
                    due_date: opportunityDetails?.closed_on,
                    tags: opportunityDetails?.tags,
                    opportunity_attachment: opportunityDetails?.opportunity_attachment,
                },
                id: state?.opportunityId,
                contacts: state?.contacts || [],
                leadSource: state?.leadSource || [],
                currency: state?.currency || [],
                tags: state?.tags || [],
                account: state?.account || [],
                stage: state?.stage || [],
                users: state?.users || [],
                teams: state?.teams || [],
                countries: state?.countries || []
            }
        });
    };

    const backbtnHandle = () => {
        navigate('/app/opportunities');
    };
    interface AssignedToItem {
        id: string;
    }
    const isAssignedToAccount = (opportunityDetails?.assigned_to ?? []).some(item => item.user_details.id === userId);
    const isSalesManager = userRole === "SALES MANAGER";
    const isCreatedByUser = opportunityDetails?.created_by.id === userId;
    const showEditButton = !isSalesManager || isAssignedToAccount || isCreatedByUser;

    const module = 'Opportunities';
    const crntPage = 'Opportunity Details';
    const backBtn = 'Back To Opportunities';

    return (
        <Box sx={{ mt: '60px' }}>
            <div>
                <CustomAppBar backbtnHandle={backbtnHandle} module={module} backBtn={backBtn} crntPage={crntPage} editHandle={showEditButton ? editHandle : null} />
                <Box sx={{ mt: '110px', p: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Box sx={{ width: '65%' }}>
                        <Box sx={{ borderRadius: '10px', border: '1px solid #80808038', backgroundColor: 'white' }}>
                            <div style={{ padding: '20px', borderBottom: '1px solid lightgray', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontWeight: 600, fontSize: '18px', color: '#1a3353f0' }}>
                                    Opportunity Information
                                </div>
                                <div style={{ color: 'gray', fontSize: '16px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginRight: '15px' }}>
                                        created &nbsp;
                                        {FormateTime(opportunityDetails?.created_at)} &nbsp; by &nbsp;
                                        <Avatar
                                            src={opportunityDetails?.created_by?.profile_pic || ''}
                                            alt={opportunityDetails?.created_by?.email}
                                        />
                                        &nbsp;
                                        &nbsp;
                                        {opportunityDetails?.created_by?.email}
                                    </div>
                                </div>
                            </div>
                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'row', marginTop: '10px' }}>
                                <div className='title2'>
                                    {opportunityDetails?.name}
                                    <Stack sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mt: 1 }}>
                                        {users.length ? users.map((val) =>
                                            <Avatar
                                                key={val.user_details.id}
                                                alt={val.user_details.email}
                                                src={val.user_details.profile_pic || ''}
                                                sx={{ mr: 1 }}
                                            />
                                        ) : null}
                                    </Stack>
                                </div>
                                <Stack sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    {opportunityDetails?.tags?.length ? opportunityDetails.tags.map((tagData, i) => (
                                        <Label
                                            key={i}
                                            tags={tagData}
                                        />)) : null}
                                </Stack>
                            </div>
                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <div style={{ width: '32%' }}>
                                    <div className='title2'>Name</div>
                                    <div className='title3'>
                                        {opportunityDetails?.name || '----'}
                                    </div>
                                </div>
                                <div style={{ width: '32%' }}>
                                    <div className='title2'>Lead Source</div>
                                    <div className='title3'>
                                        {opportunityDetails?.lead_source || '----'}
                                    </div>
                                </div>
                                <div style={{ width: '32%' }}>
                                    <div className='title2'>Account</div>
                                    <div className='title3'>
                                        {opportunityDetails?.account?.name || '----'}
                                    </div>
                                </div>
                            </div>
                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <div style={{ width: '32%' }}>
                                    <div className='title2'>Amount</div>
                                    <div className='title3'>
                                        {opportunityDetails?.amount || '----'}
                                    </div>
                                </div>
                                <div style={{ width: '32%' }}>
                                    <div className='title2'>Currency</div>
                                    <div className='title3'>
                                        {opportunityDetails?.currency || '----'}
                                    </div>
                                </div>
                                <div style={{ width: '32%' }}>
                                    <div className='title2'>Stage</div>
                                    <div className='title3'>
                                        {opportunityDetails?.stage || '----'}
                                    </div>
                                </div>
                            </div>
                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <div style={{ width: '32%' }}>
                                    <div className='title2'>Probability</div>
                                    <div className='title3'>
                                        {opportunityDetails?.probability || '----'}
                                    </div>
                                </div>
                                <div style={{ width: '32%' }}>
                                    <div className='title2'>Close Date</div>
                                    <div className='title3'>
                                        {formatDate(opportunityDetails?.closed_on) || '----'}
                                    </div>
                                </div>
                            </div>
                            {/* Description */}
                            <div style={{ marginTop: '2%' }}>
                                <div style={{ padding: '20px', borderBottom: '1px solid lightgray', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <div style={{ fontWeight: 600, fontSize: '18px', color: '#1a3353f0' }}>
                                        Description
                                    </div>
                                </div>
                                <Box sx={{ p: '15px' }}>
                                    {opportunityDetails?.description ? <div dangerouslySetInnerHTML={{ __html: opportunityDetails?.description }} /> : '---'}
                                </Box>
                            </div>

                        </Box>
                    </Box>
                    <Box sx={{ width: '34%' }}>
                        <Box sx={{ borderRadius: '10px', border: '1px solid #80808038', backgroundColor: 'white' }}>
                            <div style={{ padding: '20px', borderBottom: '1px solid lightgray', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontWeight: 600, fontSize: '18px', color: '#1a3353f0' }}>
                                    Attachments
                                </div>
                                <Button
                                    type='submit'
                                    variant='text'
                                    size='small'
                                    startIcon={<FaPlus style={{ fill: '#3E79F7', width: '12px' }} />}
                                    style={{ textTransform: 'capitalize', fontWeight: 600, fontSize: '16px' }}
                                >
                                    Add Attachments
                                </Button>
                            </div>

                            <div style={{ padding: '10px 10px 10px 15px', marginTop: '5%' }}>
                                {opportunityDetails?.opportunity_attachment?.length ? opportunityDetails?.opportunity_attachment.map((pic: any, i: any) =>
                                    <Box key={i} sx={{ width: '100px', height: '100px', border: '0.5px solid gray', borderRadius: '5px' }}>
                                        <img src={pic} alt={pic} />
                                    </Box>
                                ) : ''}
                            </div>
                        </Box>
                    </Box>
                </Box>
            </div>
        </Box>
    );
};
