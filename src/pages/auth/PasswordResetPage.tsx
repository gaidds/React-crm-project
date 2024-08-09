import { useParams } from "react-router-dom";
import PasswordResetForm from "../../components/PasswordResetForm";


const PasswordResetPage: React.FC = () => {
    const { uidb64, token } = useParams<{ uidb64: string; token: string }>();
  
    return <PasswordResetForm uidb64={uidb64 || ''} token={token || ''} />;
  };
  
  export default PasswordResetPage;