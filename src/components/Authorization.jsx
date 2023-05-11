import React from "react";

function Authorization({
  title,
  children,
  registerChildren,
  buttonName,
  onSubmit
}) {
  return (
    <section className="authorization">
      <div className="authorization__form-content">
        <div className="authorization__form-box">
          <h1 className="authorization__heading">{title}</h1>
          <form className="authorization__form" onSubmit={onSubmit}>
            <fieldset className="authorization__form-fieldset">
              {children}
            </fieldset>
            <button className="button button_type_authorization">
              {buttonName}
            </button>
          </form>
        </div>
        {registerChildren}
      </div>
    </section>
  );
}

export default Authorization;
