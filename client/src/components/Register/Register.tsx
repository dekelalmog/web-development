import { useState, useMemo, FC, FormEvent } from 'react';
import UserService from '../../services/user-service';

const Register: FC = () => {
    const { register } = useMemo(() => new UserService(), []);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();

        try {
            await register(username, password);
            console.log('User registered successfully!');
            // Add any additional logic or redirect here
        } catch (error) {
            console.error('Error registering user:', error);
            // Handle error state or display error message
        }
    };

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
        </div>
    );
};

export default Register;