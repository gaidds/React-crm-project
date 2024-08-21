import React, { createContext, useContext, useEffect, useState , ReactNode} from 'react';
import { fetchData } from '../components/FetchData';
import { ProfileUrl } from '../services/ApiUrls';


// interface MyContextData {
//   screen: string;
//   drawerWidth: number;
  // count: number;
  // updateCount: (newCount: number) => void;
// }

const MyContext = createContext<any>(undefined);

export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('');
  }
  return context;
};

export default MyContext;


// Define the context type
interface UserContextType {
  userId: string | null;
  role: string | null;
  loading: boolean;
  profileId: string | null;
}

interface UserProfile {
  user_id: string;
  role: string; // Include role
  // Add other profile fields if necessary
}


// Create the context with default values
const UserContext = createContext<UserContextType>({ userId: null, role: null, loading: true, profileId: null  });

// Define the props type for the provider component
interface UserProviderProps {
  children: ReactNode;
}

// Create the provider component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('Token'));
  const [org, setOrg] = useState<string | null>(localStorage.getItem('org'));

  useEffect(() => {
    const token = localStorage.getItem('Token');
    const org = localStorage.getItem('org');
    console.log('Current Token:', token);
    console.log('Current Org:', org);
    
    if (token && org) {
      const fetchProfile = async () => {
        const headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token,
          org: org,
        };

        try {
          const response = await fetchData(`${ProfileUrl}/`, 'GET', null as any, headers);
          console.log('Profile fetch response:', response);
          if (!response.error) {
            setRole(response.user_obj.role);
            setUserId(response.user_obj.user_details.id);
            setProfileId(response.user_obj.id);
          } else {
            console.error('Failed to fetch profile:', response.error);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    } else {
      setLoading(false); // Set loading to false if token or org is not present
    }
  }, [localStorage.getItem('Token'), localStorage.getItem('org')]);

  return (
    <UserContext.Provider value={{ userId, role, loading, profileId }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the context
export const useUser = () => useContext(UserContext);