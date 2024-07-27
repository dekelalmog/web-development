import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { googleSignin, login } from "../../services/user-service";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  const googleResponse = async (response: CredentialResponse) => {
    try {
      const res = await googleSignin(response);
      console.log("user logged in with google", res);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const googleError = () => {
    console.error("google login failed");
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <div className="login-content">
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="actions">
          <GoogleLogin onSuccess={googleResponse} onError={googleError} />
          <button onClick={handleLogin}>Login</button>
        </div>
        <div className="register-nav">
          Don't have an account?{" "}
          <span
            className="link"
            onClick={() => {
              navigate("/register");
            }}
          >
            Register
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
