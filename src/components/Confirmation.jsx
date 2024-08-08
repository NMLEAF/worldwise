import { useState } from 'react';
import Button from './Button';
import styles from './Confirmation.module.css';

const Confirmation = ({ children, setIsConfirmed, setShowCon }) => {
  function handleYes() {
    setShowCon(false);
    setIsConfirmed(true);
  }

  function handleNo() {
    setShowCon(false);
  }
  return (
    <>
      <div className={styles.overlay} onClick={handleNo}></div>
      <div className={`${styles.confirmation}`}>
        <p>{children}</p>
        <div>
          <Button type={'back'} onClick={handleNo}>
            No
          </Button>
          <Button type={'primary'} onClick={handleYes}>
            Yes
          </Button>
        </div>
      </div>
    </>
  );
};

export default Confirmation;
