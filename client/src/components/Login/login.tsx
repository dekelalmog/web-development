import { useState, useMemo } from "react";
import userSerivce from "../../services/user-service";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const { login, googleSignin } = useMemo(() => new userSerivce(), []);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await login(username, password);
      // Redirect or perform any other action upon successful login
    } catch (error) {
      setError("Invalid username or password");
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
    <div>
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <GoogleLogin onSuccess={googleResponse} onError={googleError} />
    </div>
  );
};

export default Login;
