import { useState, FC, FormEvent } from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { googleSignin, register } from "../../services/user-service";
import { uploadFile } from "../../services/file-service";
import { imageFullPath } from "../../services/utils";
import "./Register.css";

const Register: FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File>();
  const [error, setError] = useState("");

  const handleRegister = async (e: FormEvent) => {
    console.log("Registering user...");
    
    e.preventDefault();

    try {
      if (!email || !password || !name) {
        setError("Please fill in all fields");
        return;
      }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    let imageRoute = "";
      if (imageFile) {
        imageRoute = await uploadFile(imageFile);
      }

      await register(email, password, name, imageRoute);
      console.log("User registered successfully!");
      navigate("/");
      // Add any additional logic or redirect here
    } catch (error) {
      console.error("Error registering user:", error);
      // Handle error state or display error message
    }
  };

  const googleResponse = async (response: CredentialResponse) => {
    try {
      const res = await googleSignin(response);
      console.log("user registered in with google",res);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const googleError = () => {
    console.error("google login failed");
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Profile Picture:
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files?.[0])}
          />
          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Selected Image"
              style={{ width: "100px", height: "100px" }}
            />
          )}
        </label>
      </form>
      <div className="actions">
        <GoogleLogin onSuccess={googleResponse} onError={googleError} />
        <button type="submit" title="Register" onClick={handleRegister}>
          Register
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="register-nav">
        Already have an account?{" "}
        <span
          className="link"
          onClick={() => {
            navigate("/login");
          }}
        >
          Login
        </span>
      </div>
    </div>
  );
};

export default Register;
