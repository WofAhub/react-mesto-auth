import React from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({onAddPlace, isOpen, onClose, ...commonProps}) {
  const [name, setName] = React.useState('');
  const [link, setLink] = React.useState('');

  function handleChangeName(evt) {
    setName(evt.target.value);
  }

  function handleChangeLink(evt) {
    setLink(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    onAddPlace({ 
      name, 
      link
    })
  }

  React.useEffect(() => {
    setName('');
    setLink('');
  }, [isOpen])

  return (
    <PopupWithForm
      title={'Новое место'}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonName={'Добавить'}
      {...commonProps}
    >
      <input 
        id="input-add-name"
        name="name"
        type="text"
        className="pop-up__input pop-up__input_type_img-name"
        placeholder="Название"
        minLength="2"
        maxLength="30"
        required
        value={name || ''}
        onChange={handleChangeName}  
      />
      <span
        className="pop-up__input-errormessage input-add-name-error">
      </span>

      <input
        id="input-add-url"
        name="link"
        type="url"
        className="pop-up__input pop-up__input_type_img-url"
        placeholder="Ссылка на картинку"
        required
        value={link || ''}
        onChange={handleChangeLink}  
      />
      <span
        className="pop-up__input-errormessage input-add-url-error">
      </span>
    </PopupWithForm>
  )
}

export default AddPlacePopup;