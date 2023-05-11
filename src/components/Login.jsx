import React, { useState } from "react";
import Authorization from "./Authorization";
import Header from "./Header";
import { login } from "../utils/auth";
import { useNavigate } from "react-router-dom";

function Login({ handleLogin }) {
  const [formValue, setFormValue] = useState({
    username: "",
    password: ""
  });

  function handleChange(evt) {
    const { name, value } = evt.target;

    setFormValue({
      ...formValue,
      [name]: value
    });
  }

  const navigate = useNavigate();

  function handleSubmit(evt) {
    evt.preventDefault();
    if(!formValue.email || !formValue.password) {
      return;
    }
    login(formValue.email, formValue.password)
      .then((res) => {
        if (res.token) {
          setFormValue({ email: "", password: "" });
          handleLogin();
          navigate("/main", { replace: true });
        }
      })
      .catch(err => console.log(err));
  }

  return (
    <>
      <Header headerButton={"Регистрация"} />
      <Authorization
        title={"Вход"}
        buttonName={"Войти"}
        onSubmit={handleSubmit}
      >
        <input
          id="email"
          name="email"
          type="email"
          className="authorization__input"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          id="password"
          name="password"
          type="password"
          className="authorization__input"
          placeholder="Password"
          onChange={handleChange}
        />
      </Authorization>
    </>
  );
}

export default Login;
