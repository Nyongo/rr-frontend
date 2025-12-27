
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    // Clear any stored user data if needed
    localStorage.removeItem('minderSession');
    
    // Redirect to the sign-in page
    navigate("/minders-mobile");
  };

  return { logout };
};
