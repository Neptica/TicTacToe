import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router";
import Button from "react-bootstrap/Button";

const SignInPage = () => {
  const { loginWithRedirect } = useAuth0();
  const location = useLocation();

  const handleLogin = () => {
    loginWithRedirect({
      appState: {
        returnTo: location.state?.from?.pathname || "/",
      },
    });
  };

  return (
    <div className="d-flex flex-column justify-content-center">
      Please Sign In
      <Button variant="danger" onClick={handleLogin}>
        Sign In
      </Button>
    </div>
  );
};

export default SignInPage;
