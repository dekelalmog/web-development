import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import UserService from "../../services/user-service";
import { User } from "../../services/interfaces";


const UserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { getUserById } = useMemo(() => new UserService(), []);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = (await getUserById(id!)) as unknown as User;
        setUser(user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Page</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      {/* Add more user information here */}
    </div>
  );
};

export default UserPage;
