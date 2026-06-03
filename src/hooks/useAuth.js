import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";

export function useAuth() {
  const { user, token, isAuthenticated, setAuth, updateUser, logout: storeLogout } = useAuthStore();
  const navigate = useNavigate();

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setAuth(data.user, data.accessToken, data.refreshToken);
    navigate(ROUTES.DASHBOARD);
  };

  const register = async ({ name, username, email, password, role, expertise }) => {
    const data = await authService.register({ name, username, email, password, role, expertise });
    setAuth(data.user, data.accessToken, data.refreshToken);
    navigate(ROUTES.DASHBOARD);
  };

  // Google OAuth login — sets needsOnboarding flag if new user
  const googleLogin = async (idToken) => {
    const data = await authService.googleAuth(idToken);
    setAuth(data.user, data.accessToken, data.refreshToken);
    if (data.isNewUser) {
      // Store flag so App.jsx can show onboarding modal
      useAuthStore.setState({ needsOnboarding: true });
    }
    navigate(ROUTES.DASHBOARD);
  };

  const completeOnboarding = async (role, expertise) => {
    const updatedUser = await authService.completeOnboarding(role, expertise);
    updateUser(updatedUser);
    useAuthStore.setState({ needsOnboarding: false });
  };

  const logout = () => {
    storeLogout();
    navigate(ROUTES.LOGIN);
  };

  return { user, token, isAuthenticated, login, register, logout, googleLogin, completeOnboarding };
}
