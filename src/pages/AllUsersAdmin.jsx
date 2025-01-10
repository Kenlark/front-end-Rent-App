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
  const { isLoggedIn, setUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const users = useLoaderData();
  const [sortedUsers, setSortedUsers] = useState(users);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

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

  useEffect(() => {
    let sortedArray = [...users];
    if (sortConfig.key) {
      sortedArray.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    setSortedUsers(sortedArray);
  }, [users, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div>
      {isAdmin ? (
        <>
          <h1 className="title-all-users">Liste de tous les utilisateurs</h1>
          <table className="all-users-table">
            <thead>
              <tr>
                <th onClick={() => requestSort("firstName")}>Prénom</th>
                <th onClick={() => requestSort("lastName")}>Nom</th>
                <th onClick={() => requestSort("email")}>Email</th>
                <th onClick={() => requestSort("postalCode")}>Adresse</th>
                <th onClick={() => requestSort("phoneNumber")}>
                  Numéro de téléphone
                </th>
                <th onClick={() => requestSort("role")}>Role</th>
                <th onClick={() => requestSort("createdAt")}>
                  Date de création du compte
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
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
          <p className="total-users">
            Nombre total d'utilisateurs : {users.length}
          </p>
        </>
      ) : (
        <p>Vous n'êtes pas autorisé à voir cette page.</p>
      )}
    </div>
  );
}

export default AllUsersAdmin;
