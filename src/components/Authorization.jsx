import React from "react";

function Authorization({
  title,
  children,
  registerChildren,
  buttonName,
  onSubmit
}) {
  return (
    <div className="root">
      <div className="page">
        <main className="content">
        
            <div className="authorization__form-content">
              <div className="authorization__form-box">
                <h1 className="authorization__heading">{title}</h1>
                <form name='auth-form' className="authorization__form" onSubmit={onSubmit}>
                  <fieldset className="authorization__form-fieldset">
                    {children}
                  </fieldset>
                  <button type='submit' className="button button_type_authorization">
                    {buttonName}
                  </button>
                </form>
              </div>
              {registerChildren}
            </div>
         
        </main>
      </div>
    </div>
  );
}

export default Authorization;
