import Main from './Main';
import Footer from './Footer';
import Header from './Header';
import EditProfilePopup from './EditProfilePopup';
import ImagePopup from './ImagePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import React from 'react';
import { api } from '../utils/Api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function App() {

  const [isEditAvatarPopupOpen, isSetEditAvatarPopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, isSetEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, isSetAddPlacePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);

  // установка смены аватара
  function handleEditAvatarClick() {
    isSetEditAvatarPopupOpen(true);
  }

  // установка смены имени и описания
  function handleEditProfileClick() {
    isSetEditProfilePopupOpen(true);
  }

  // установка добавления карточки
  function handleAddPlaceClick() {
    isSetAddPlacePopupOpen(true);
  }
  
  // установка нажатия по карточке
  function handleCardClick(card) {
    setSelectedCard(card)
  }

  // закрыть все попапы
  function closeAllPopups() {
    isSetEditAvatarPopupOpen(false)
    isSetEditProfilePopupOpen(false)
    isSetAddPlacePopupOpen(false)
    setSelectedCard({})
  }

  // закрыть все попапы
  function handleUpdateUser(data) {
    api.editUserInfo(data)
    .then((res) => {
      setCurrentUser(res);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(`Ошибка в App, handleUpdateUser: ${err}`);
    })
  }

  // запрос обнолвения аватара
  function handleUpdateAvatar(data) {
    api.editUserAvatar(data)
    .then((res) => {
      setCurrentUser(res);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(`Ошибка в App, handleUpdateAvatar: ${err}`);
    })
  }

  function handleAddPlace(data) {
    api.createCardByPopup(data)
    .then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(`Ошибка в App, handleAddPlace: ${err}`);
    })
  }

  // запрос обновления лайков
  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    api.changeLikeCardStatus(card._id, !isLiked)
    .then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c))
    })
    .catch((err) => {
      console.log(`Ошибка в App, handleCardLike: ${err}`);
    })
  }

  // запрос удаления карточки
  function handleCardDelete(card) {
    api.deleteCard(card._id)
    .then(() => {
      setCards((state) => state.filter((c) => c._id !== card._id));
      closeAllPopups();
    })
    .catch((err) => {
      console.log(`Ошибка в App, handleCardDelete: ${err}`);
    })
  }

  // запрос на текущие данные о пользователе и получение карточек
  React.useEffect(() => {
    Promise.all([
      api.getCurrentUser(),
      api.getInitialCards(),
    ])
    .then(([user, card]) => {
      setCurrentUser(user)
      setCards(card);
    })
    .catch((err) => {
      console.log(`Ошибка в App, React.useEffect, PromiseAll: ${err}`);
    })
  }, [])

  return (
    <CurrentUserContext.Provider value={currentUser || ''}>
      <div className="root">
        <div className="page">
          <Header />
          <Main
            cards={cards}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
          />
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
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;