import { useAuth0 } from "@auth0/auth0-react";
import "./App.scss";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router";

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  console.log(user, isAuthenticated);
  const navigate = useNavigate();

  const redirect = () => {
    navigate("/game");
  };

  return (
    <>
      {isLoading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : isAuthenticated ? (
        <div>
          <p>Welcome, {user?.given_name}</p>
          <p>{user?.sub}</p>
          <Button onClick={() => console.log(user, isAuthenticated)}>
            Show User
          </Button>
          <Button onClick={redirect}>Play Game</Button>
        </div>
      ) : (
        <h3>Hi</h3>
      )}
    </>
  );
}

export default App;
