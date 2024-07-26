import { useState } from "react";
import { googleSignin, login } from "../../services/user-service";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { Navigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await login(email, password);
      return <Navigate to="/" />;
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  const googleResponse = async (response: CredentialResponse) => {
    try {
      const res = await googleSignin(response);
      console.log(res);
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
          <button onClick={handleLogin}>Login</button>
          <GoogleLogin onSuccess={googleResponse} onError={googleError} />
        </div>
      </div>
    </div>
  );
};

export default Login;
