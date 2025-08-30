import React, { useState } from "react";

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [callSetting, setCallSetting] = useState("everyone");
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  const sections = {
    profile: (
      <>
        <h2>Edit Profile</h2>
        <p>Manage your public profile information.</p>
        <form
          className="settings-form"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Profile updated (dummy action).");
          }}
        >
          <div className="form-group">
            <label htmlFor="nameInput">Update Name</label>
            <input
              id="nameInput"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="profilePicInput">Update Profile Picture</label>
            <input
              id="profilePicInput"
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePic(e.target.files[0])}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </form>
      </>
    ),
    about: (
      <>
        <h2>About</h2>
        <p>Welcome to Talkie.</p>
      </>
    ),
    call: (
      <>
        <h2>Call Settings</h2>
        <p>Control who is able to call you on this app.</p>
        <form
          className="settings-form"
          onSubmit={(e) => {
            e.preventDefault();
            alert(`Call setting updated to: ${callSetting}`);
          }}
        >
          <div className="form-group radio-group">
            <div className="radio-option">
              <input
                type="radio"
                id="everyone"
                name="callSetting"
                value="everyone"
                checked={callSetting === "everyone"}
                onChange={(e) => setCallSetting(e.target.value)}
              />
              <label htmlFor="everyone">Everybody</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                id="anyone"
                name="callSetting"
                value="anyone"
                checked={callSetting === "anyone"}
                onChange={(e) => setCallSetting(e.target.value)}
              />
              <label htmlFor="anyone">Nobody</label>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </form>
      </>
    ),
    deleteAccount: (
      <>
        <h2>Delete Account</h2>
        <p>
          Warning: This action is irreversible. Deleting your account will
          permanently remove all your data and cannot be undone. Please be
          certain before proceeding.
        </p>
        <button
          className="btn btn-danger"
          onClick={() => {
            if (
              window.confirm(
                "Are you sure you want to delete your account? This action cannot be undone."
              )
            ) {
              alert("Account deleted (dummy action).");
            }
          }}
        >
          Delete Account
        </button>
      </>
    ),
    logout: (
      <>
        <h2>Log out</h2>
        <p>
          Are you sure you want to log out from this device? You will need to
          re-enter your credentials to access your account again.
        </p>
        <button
          className="btn btn-danger"
          onClick={() => alert("Logged out (dummy action).")}
        >
          Logout
        </button>
      </>
    ),
  };

  return (
    <div className="settings-container">
      <aside className="sidebar" aria-label="Settings navigation">
        <div className="search-container">
          <input
            type="search"
            placeholder="Search settings"
            aria-label="Search settings"
          />
        </div>

        <div className="profile-summary">
          <img
            src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=200"
            alt="User profile"
          />
          <div className="profile-info">
            <div className="name">User Name</div>
            <div className="status">Online</div>
          </div>
        </div>

        <nav>
          <ul className="settings-nav" role="list">
            <li
              className={activeSection === "profile" ? "active" : ""}
              onClick={() => setActiveSection("profile")}
            >
              <svg viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              Profile
            </li>
            <li
              className={activeSection === "about" ? "active" : ""}
              onClick={() => setActiveSection("about")}
            >
              <svg viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-2h2zm0-4h-2V7h2z" />
              </svg>
              About
            </li>
            <li
              className={activeSection === "call" ? "active" : ""}
              onClick={() => setActiveSection("call")}
            >
              <svg viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.28-.28.67-.36 1.02-.25 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.46.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              Call Settings
            </li>
            <li
              data-section="deleteAccount"
              className={activeSection === "deleteAccount" ? "active" : ""}
              onClick={() => setActiveSection("deleteAccount")}
            >
              <svg viewBox="0 0 24 24">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z" />
              </svg>
              Delete Account
            </li>
            <li
              data-section="logout"
              className={activeSection === "logout" ? "active" : ""}
              onClick={() => setActiveSection("logout")}
            >
              <svg viewBox="0 0 24 24">
                <path d="M16 13v-2H7V8l-5 4 5 4v-3zM17 3v2h2v14h-2v2h4V3z" />
              </svg>
              Log out
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        {sections[activeSection] || (
          <div className="empty-state">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l3 3" />
            </svg>
            <h2>Select a setting</h2>
            <p>Click on an item in the left sidebar to manage your settings.</p>
          </div>
        )}
      </main>
    </div>
  );
}
