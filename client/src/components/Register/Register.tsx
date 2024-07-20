import { useState, useMemo, FC, FormEvent } from 'react';
import UserService from '../../services/user-service';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';

const Register: FC = () => {
    const { register, googleSignin } = useMemo(() => new UserService(), []);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();

        try {
            await register(username, password, '', 'name');
            console.log('User registered successfully!');
            // Add any additional logic or redirect here
        } catch (error) {
            console.error('Error registering user:', error);
            // Handle error state or display error message
        }
    };

    const googleResponse = async (response: CredentialResponse) => {
        console.log(response);
        try {
            const res = await googleSignin(response);
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };

    const googleError = () => {
        console.error('google login failed');
    }

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <br />
                <button type="submit">Register</button>
            </form>
            <GoogleLogin onSuccess={googleResponse} onError={googleError} />
        </div>
    );
};

export default Register;