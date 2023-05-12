// components
import Main from "./Main";
import Footer from "./Footer";
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
import { checkToken, login, register } from "../utils/auth";
import ProtectedRoute from "./ProtectedRoute";

// function App
function App() {
  // const popups
  const [isEditAvatarPopupOpen, isSetEditAvatarPopupOpen] =
    React.useState(false);
  const [isEditProfilePopupOpen, isSetEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, isSetAddPlacePopupOpen] = React.useState(false);

  // const api
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);

  // const authorization (авторизация)
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [isInfoTooltipPopupOpen, isSetInfoTooltipPopupOpen] = React.useState(false);
  const navigate = useNavigate();

  // успешный вход
  function handleLogin() {
    setLoggedIn(true);
  }

  // // регистрация
  // function registerUser({email, password}) {
  //   register(email, password)
  //   .then(({token})=> {
  //     localStorage.setItem('jwt', token);
  //     setToken(token);
  //     isSetSuccess(true);
  //     navigate('/sign-in', {replace: true});
  //   })
  //   .catch((err) => {
  //     console.log(`Ошибка в App, registerUser: ${err}`);
  //   });
  // }

  // React.useEffect(() => {
	// 	if (!token) {
	// 		return;
	// 	}
	// }, [token]);

  // React.useEffect(() => {
  //   if(localStorage.getItem('jwt')) {
  //     const token = localStorage.getItem('jwt');
  //     checkToken(token)
  //     .then((res) => {
  //       const data = res.data;
  //       setCurrentUserEmail(data.email);
  //       setLoggedIn(true);
  //       navigate('/main')
  //     })
  //     .catch((err) => {
  //       console.log(`Ошибка в App, useEffect: ${err}`);
  //     });
  //   }
  // }, [])

  // function loginUser({email, password}) {
  //   login(email, password)
  //   .then(({token}) => {
  //     localStorage.setItem('jwt', token);
  //     setToken(token);
  //     setCurrentUser(email);
  //     setLoggedIn(true);
  //     navigate('/main');
  //   })
  //   .catch((err) => {
  //     console.log(`Ошибка в App, loginUser: ${err}`);
  //   });
  // }

  // проверка токена эффект
  React.useEffect(() => {
    handleTokenCheck();
  }, []);

  // проверка токена
  function handleTokenCheck() {
    if (localStorage.getItem("jwt")) {
      const jwt = localStorage.getItem("jwt");
      checkToken(jwt)
        .then((res) => {
          if (res) {
            setLoggedIn(true)
            navigate("/main", { replace: true });
          }
        })
        .catch((err) => {
          console.log(`Ошибка в App, handleTokenCheck: ${err}`);
        });
    }
  }

  // открытие попапа информации
  function handleInfoTooltipOpen() {
    isSetInfoTooltipPopupOpen(true);
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
                />}
            />
            <Route 
              path="/sign-up" 
              element={
                <Register 
                />} 
            />
            <Route
              path="*"
              element={
                loggedIn ? (
                  <Navigate to="/main" replace />
                ) : (
                  <Navigate to="/sign-in" replace />
                )
              }
            />
            <Route
              path="/main"
              element={
                <ProtectedRoute
                  element={
                    <Main
                      cards={cards}
                      onEditAvatar={handleEditAvatarClick}
                      onEditProfile={handleEditProfileClick}
                      onAddPlace={handleAddPlaceClick}
                      onCardClick={handleCardClick}
                      onCardLike={handleCardLike}
                      onCardDelete={handleCardDelete}
                      loggedIn={loggedIn}
                    />
                  }
                />
              }
            />
          </Routes>

          <Footer />
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
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;