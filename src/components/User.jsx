import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/FakeAuthContext';
import styles from './User.module.css';
import { useEffect, useState } from 'react';
import Confirmation from './Confirmation';

function User() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showCon, setShowCon] = useState(false);

  function handleClick() {
    setShowCon(true);

    // const confirmLogout = confirm('Are you sure you want to logout');

    // if (confirmLogout) {
    //
    // }
  }

  useEffect(
    function () {
      if (isConfirmed) {
        logout();
        navigate('/');
      }
    },
    [isConfirmed]
  );

  return (
    <>
      <div className={styles.user}>
        <img src={user.avatar} alt={user.name} />
        <span>Welcome, {user.name}</span>
        <button onClick={handleClick}>Logout</button>
      </div>

      {showCon && (
        <div>
          <Confirmation setIsConfirmed={setIsConfirmed} setShowCon={setShowCon}>
            Are you sure you want to logout ?
          </Confirmation>
        </div>
      )}
    </>
  );
}

export default User;
