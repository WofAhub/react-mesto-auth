import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Authorization from "./Authorization";
import Header from "./Header";
import { register } from "../utils/auth";

function Register() {
  const [formValue, setFormValue] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  function handleChange(evt) {
    const { name, value } = evt.target;

    setFormValue({
      ...formValue,
      [name]: value
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
      const { email, password } = formValue;
      register( email, password )
      .then((res) => {
        navigate('/sign-in', {replace: true});
      })
      .catch((err) => {
        console.log(`Ошибка в Register, handleSubmit: ${err}`);
      });
  } 

  return (
    <>
      <Header 
        headerButton={
          <Link 
            to='/sign-in'
            className="button button_type_header"
          >
            Вход
          </Link>} 
      />
      <Authorization
        title={"Регистрация"}
        buttonName={"Зарегистрироваться"}
        onSubmit={handleSubmit}
        registerChildren={
          <div className="register">
            <p className="register__already-registered">
              Уже зарегистрированы?
            </p>
            <Link
              to="/sign-in"
              type="button"
              className="button button_type_register"
            >
              Войти
            </Link>
          </div>
        }
      >
        <input
          id="email"
          name="email"
          type="email"
          className="authorization__input"
          placeholder="Email"
          value={formValue.email}
          onChange={handleChange}
          required
        />
        <input
          id="password"
          name="password"
          type="password"
          className="authorization__input"
          placeholder="Password"
          value={formValue.password}
          onChange={handleChange}
          required
        />
      </Authorization>
    </>
  );
}

export default Register;
