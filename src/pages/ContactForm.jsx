import axios from "axios";

function ContactForm() {
  const sendEmail = async (emailData) => {
    try {
      const response = await axios.get(
        "https://back-end-rent-app.onrender.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailData),
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email :", error);
    }
  };
}

export default ContactForm;
