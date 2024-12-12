import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "../authContext.jsx";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import logoGoogle from "../assets/images/icons8-google.svg";
import logoApple from "../assets/images/icons8-apple.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formType, setFormType] = useState("login");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams();
  const { setIsLoggedIn, setUser, loginUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setFormType("resetPassword"); // Basculer directement sur le formulaire de réinitialisation si un token est présent
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/users/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true, // Permet à Axios d'envoyer les cookies avec la requête
        }
      );

      const { token, user: loggedUser } = response.data;

      if (!loggedUser) {
        throw new Error("L'utilisateur n'est pas défini dans la réponse.");
      }

      Cookies.set("token", token, { expires: 7, path: "/" });

      loginUser(loggedUser);
      setIsLoggedIn(true);
      setUser(loggedUser);
      setEmail("");
      setPassword("");

      toast.success("Connexion réussie !");
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Erreur lors de la connexion";

      if (error.response?.status === 401) {
        toast.error(
          "Identifiants invalides. Veuillez vérifier votre e-mail et votre mot de passe."
        );
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/reset-password/request-reset`,
        {
          email,
        },
        {
          withCredentials: true,
        }
      );
      toast.success(
        "Si cet e-mail est enregistré, un lien de réinitialisation a été envoyé"
      );
      setEmail("");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Erreur lors de l'envoi de l'email";
      toast.error(errorMessage);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/v1/reset-password/reset${token}`, {
        password,
      });
      toast.success("Mot de passe réinitialisé avec succès");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error("Erreur lors de la réinitialisation du mot de passe", error);
    }
  };

  return (
    <>
      <section className="test">
        <div className="form-card">
          {formType === "login" ? (
            <form onSubmit={handleSubmit} className="form">
              <h1>Se connecter</h1>
              <p className="new-user">
                Vous êtes un nouvel utilisateur ?{" "}
                <a href="/register">Créez un compte</a>
              </p>
              <label htmlFor="email" className="label-mail">
                Adresse e-mail
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="password" className="label-password">
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="forgot-password">
                <button
                  type="button"
                  className="btn-forgot-password"
                  onClick={() => setFormType("forgotPassword")}
                >
                  Mot de passe oublié ?
                </button>
                <button type="submit" className="btn-submit">
                  Continuer
                </button>
              </div>
              <div className="flex-underline">
                <div className="underline-login1"></div>
                <p>ou</p>
                <div className="underline-login2"></div>
              </div>
              <div className="flex-btn-oauth">
                <button className="btn-oauth-google">
                  <img
                    src={logoGoogle}
                    alt="logo google"
                    className="logo-google"
                  />
                  Continuer avec Google
                </button>
                <button className="btn-oauth-apple">
                  <img
                    src={logoApple}
                    alt="logo apple"
                    className="logo-apple"
                  />
                  Continuer avec Apple
                </button>
              </div>
            </form>
          ) : formType === "forgotPassword" ? (
            <form onSubmit={handleForgotPasswordSubmit} className="form">
              <h1>Réinitialiser le mot de passe</h1>
              <p>
                Veuillez entrer votre adresse e-mail pour recevoir un lien de
                réinitialisation.
              </p>
              <label htmlFor="email">Adresse e-mail</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn-submit">
                Envoyer
              </button>
              <button
                type="button"
                className="btn-back"
                onClick={() => setFormType("login")}
              >
                Retour à la connexion
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPasswordSubmit} className="form">
              <h1>Réinitialiser le mot de passe</h1>
              <label htmlFor="password">Nouveau mot de passe</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="submit" className="btn-submit">
                Réinitialiser
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
};

export default Login;
