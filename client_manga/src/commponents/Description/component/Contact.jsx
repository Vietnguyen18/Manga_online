import React, { useState } from "react";

const Contact = () => {
  const [content, setContent] = useState({
    full_name: "",
    email: "",
    message: "",
  });

  console.log("content", content);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent((prevContent) => ({
      ...prevContent,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", content);
    setContent({
      full_name: "",
      email: "",
      message: "",
    });
    alert(`Thank you, ${content.full_name}, for contacting us!`);
  };

  return (
    <section id="contact">
      <div className="contact-page-wrapper">
        <p className="primary-subheading">Liên hệ</p>
        <h1 className="primary-heading">Liên hệ với chúng tôi</h1>

        <form onSubmit={handleSubmit}>
          <div className="contact-form-container">
            <input
              type="text"
              placeholder="Full name"
              name="full_name"
              value={content.full_name}
              onChange={handleChange}
            />
          </div>
          <div className="contact-form-container">
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={content.email}
              onChange={handleChange}
            />
          </div>
          <div className="contact-form-container">
            <input
              type="text"
              placeholder="Message"
              name="message"
              value={content.message}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="secondary-button">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
