import React from "react";
import Card from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Main ({cards, onEditAvatar, onCardClick, onCardLike, onCardDelete, onEditProfile, onAddPlace}) {

  const currentUserContext = React.useContext(CurrentUserContext)

  return (
    <main className="content">
      <section className="profile">
  
        <img
          className="profile__avatar"
          src={currentUserContext.avatar}
          alt="аватар"
        />
  
        <button
          className="profile__avatar-button"
          type="button"
          onClick={onEditAvatar}> 
        </button>
  
        <div className="profile__info">
          <h1 className="profile__name">{currentUserContext.name}</h1>
          <p className="profile__description">{currentUserContext.about}</p>
          <button
            className="button button_type_edit-button"
            type="button"
            onClick={onEditProfile}>
          </button>
        </div>
  
        <button
          className="button button_type_add-button"
          type="button"
          onClick={onAddPlace}>  
        </button>

      </section>

      <section className="elements">
        {cards.map(card => {
          return(
            <Card key={card._id} card={card} onCardClick={onCardClick} onCardLike={onCardLike} onCardDelete={onCardDelete}/>
          )
        })}
      </section>
    </main>
  )
}

export default Main;