import React, { createContext, useContext, useEffect, useState , ReactNode} from 'react';
import { jwtDecode } from 'jwt-decode';
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
}

interface UserProfile {
  user_id: string;
  role: string; // Include role
  // Add other profile fields if necessary
}


// Create the context with default values
const UserContext = createContext<UserContextType>({ userId: null, role: null, loading: true  });

// Define the props type for the provider component
interface UserProviderProps {
  children: ReactNode;
}

// Create the provider component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('Token');
    if (token) {
      try {
        // Define the fetchProfile function
        const fetchProfile = async () => {
          const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: token, // Adjust the token format if needed
            org: localStorage.getItem('org') || '',
          };

          const profileUrl = `${ProfileUrl}/`;
          console.log('Fetching profile from:', profileUrl);

          try {
            const response = await fetchData(profileUrl, 'GET', null as any, headers);
            console.log('Profile fetch response:', response);

            if (!response.error) {
              setRole(response.user_obj.role);
              setUserId(response.user_obj.user_details.id)
            } else {
              console.error('Failed to fetch profile:', response.error);
            }
          } catch (error) {
            console.error('Error fetching profile:', error);
          }finally {
            setLoading(false); 
          }
        };

        fetchProfile();
      } catch (error) {
        console.error('Failed to decode token:', error);
        setLoading(false);
      }
    } else {
      setLoading(false);  // Set loading to false if no token is present
    }
  }, []);

  return (
    <UserContext.Provider value={{ userId, role, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the context
export const useUser = () => useContext(UserContext);