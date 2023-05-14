// components
import Main from "./Main";
import EditProfilePopup from "./EditProfilePopup";
import ImagePopup from "./ImagePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";

// components-authorization
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";

// react and utils
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import React from "react";
import { api } from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import * as auth from '../utils/auth.js';
import ProtectedRoute from "./ProtectedRoute";

// function App
function App() {
  // const попапы
  const [isEditAvatarPopupOpen, isSetEditAvatarPopupOpen] =
    React.useState(false);
  const [isEditProfilePopupOpen, isSetEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, isSetAddPlacePopupOpen] = React.useState(false);
  const [isInfoTooltipPopupOpen, isSetInfoTooltipPopupOpen] = React.useState(false);

  // const api
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);

  // const авторизация
  const [isloggedIn, setLoggedIn] = React.useState(false);
  const [token, setToken] = React.useState('')
  const [userData, setUserData] = React.useState({
    _id: '',
    email: ''
  })
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    setToken(jwt);
  }, []);

  // получить контент
  React.useEffect(() => {
    if (!token) {
      return;
    }
    auth
      .getContent(token)
      .then((res) => {
        setUserData(res);
        setLoggedIn(true);
        navigate('/', { replace: true });
      })
      .catch((err) => {
        console.log(`Ошибка в App, useEffect2: ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }, [token])

  // регистрация
  function registerUser({ email, password }) {
    auth
      .register(email, password)
      .then(() => {
        setIsSuccess(true);
        navigate('/sign-in', { replace: true });
      })
      .catch((err) => {
        console.log(`Ошибка в App, registerUser: ${err}`);
        setIsSuccess(false);
      });
  }

  React.useEffect(() => {
    if (isInfoTooltipPopupOpen && isSuccess) {
      setTimeout(() => {
        closeAllPopups();
      }, 1200);

      setTimeout(() => {
        setIsSuccess(false);
      }, 1500);
    };

    return () => clearTimeout(setTimeout);
  }, [isInfoTooltipPopupOpen, isSuccess, closeAllPopups, setIsSuccess]);

  // логин
  function loginUser({ email, password }) {
    auth.login(email, password)
      .then((token) => {
        localStorage.setItem("jwt", token);
        setToken(token);
        setUserData(email);
        navigate('/', { replace: true });
      })
      .catch((err) => {
        console.log(`Ошибка в App, loginUser: ${err}`);
      });
  }

  // разлогин
  function logOut() {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    setToken("");
    setUserData({
      email: "",
      password: ""
    });
    navigate("/sign-in");
  };


  // попап информации о регистрации
  function handleInfoTooltipPopupClick() {
    isSetInfoTooltipPopupOpen(true)
  }

  // смена аватара
  function handleEditAvatarClick() {
    isSetEditAvatarPopupOpen(true);
  }

  // смена имени и описания
  function handleEditProfileClick() {
    isSetEditProfilePopupOpen(true);
  }

  // добавление карточки
  function handleAddPlaceClick() {
    isSetAddPlacePopupOpen(true);
  }

  // нажатие по карточке
  function handleCardClick(card) {
    setSelectedCard(card);
  }

  // закрыть все попапы
  function closeAllPopups() {
    isSetEditAvatarPopupOpen(false);
    isSetEditProfilePopupOpen(false);
    isSetAddPlacePopupOpen(false);
    isSetInfoTooltipPopupOpen(false);
    setSelectedCard({});
  }

  // запрос обновления информации юзера
  function handleUpdateUser(data) {
    api
      .editUserInfo(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка в App, handleUpdateUser: ${err}`);
      });
  }

  // запрос обновления аватара
  function handleUpdateAvatar(data) {
    api
      .editUserAvatar(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка в App, handleUpdateAvatar: ${err}`);
      });
  }

  // запрос добавления карточки
  function handleAddPlace(data) {
    api
      .createCardByPopup(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка в App, handleAddPlace: ${err}`);
      });
  }

  // запрос обновления лайков
  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(`Ошибка в App, handleCardLike: ${err}`);
      });
  }

  // запрос удаления карточки
  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка в App, handleCardDelete: ${err}`);
      });
  }

  // запрос на текущие данные о пользователе и получение карточек
  React.useEffect(() => {
    Promise.all([api.getCurrentUser(), api.getInitialCards()])
      .then(([user, card]) => {
        setCurrentUser(user);
        setCards(card);
      })
      .catch((err) => {
        console.log(`Ошибка в App, React.useEffect, PromiseAll: ${err}`);
      });
  }, []);


  return (
    <CurrentUserContext.Provider value={currentUser || ""}>
      <div className="root">
        <div className="page">
          <Routes>
            <Route
              path="/sign-in"
              element={
                <Login
                  onLogin={loginUser}
                />}
            />
            <Route
              path="/sign-up"
              element={
                <Register
                  onRegister={registerUser}
                  onInfoTooltipClick={handleInfoTooltipPopupClick}
                />}
            />
            <Route
              path="*"
              element={
                isloggedIn ? (
                  <Navigate to="/" replace />
                ) : (
                  <Navigate to="/sign-up" replace />
                )
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute
                  loggedIn={isloggedIn}
                  element=
                  {Main}
                  cards={cards}
                  onEditAvatar={handleEditAvatarClick}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}

                  userData={userData}
                />
              }
            />
          </Routes>

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlace}
          />
          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}
          />
          <InfoTooltip
            isOpen={isInfoTooltipPopupOpen}
            onClose={closeAllPopups}
            isSuccess={isSuccess}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;