import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";

export function useAuth() {
  const { user, token, isAuthenticated, setAuth, logout: storeLogout } = useAuthStore();
  const navigate = useNavigate();

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setAuth(data.user, data.accessToken, data.refreshToken);
    navigate(ROUTES.DASHBOARD);
  };

  const register = async ({ name, username, email, password }) => {
    const data = await authService.register({ name, username, email, password });
    setAuth(data.user, data.accessToken, data.refreshToken);
    navigate(ROUTES.DASHBOARD);
  };

  const logout = () => {
    storeLogout();
    navigate(ROUTES.LOGIN);
  };

  return { user, token, isAuthenticated, login, register, logout };
}
