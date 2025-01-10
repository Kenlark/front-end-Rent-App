import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { useAuth } from "../authContext.jsx";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const loader = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/users`);
    console.log(response.data.allUsers);

    return response.data.allUsers;
  } catch (error) {
    console.log(error);
    throw new Error(
      "Impossible de charger le contenu. Veuillez réessayer plus tard"
    );
  }
};

function AllUsersAdmin() {
  const { isLoggedIn, setUser } = useAuth;
  const [isAdmin, setIsAdmin] = useState(false);
  const users = useLoaderData();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yy");
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/users/me`, {
          withCredentials: true,
        });
        if (response.data) {
          setIsAdmin(response.data.role === "admin");
        }
      } catch (error) {
        setIsAdmin(false);
      }
    };
    checkAuthStatus();
  }, [isLoggedIn]);

  return (
    <div>
      {isAdmin ? (
        <>
          <h1>All Users</h1>
          <table>
            <thead>
              <tr>
                <th>Prénom</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Adresse</th>
                <th>Numéro de téléphone</th>
                <th>Role</th>
                <th>Date de création du compte</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.postalCode}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.role}</td>
                  <td>{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div>Vous n'avez pas les droits pour accéder à cette page</div>
      )}
    </div>
  );
}

export default AllUsersAdmin;
