import React from 'react';

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <p style={styles.message}>{message}</p>
        <div style={styles.buttonContainer}>
          <button onClick={onCancel} style={styles.cancelBtn}>Cancel</button>
          <button onClick={onConfirm} style={styles.confirmBtn}>Delete</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    background: '#1e1e1e',
    padding: '20px 30px',
    borderRadius: '8px',
    color: '#fff',
    textAlign: 'center',
    maxWidth: '400px',
    width: '80%'
  },
  message: {
    fontSize: '18px',
    marginBottom: '20px'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px'
  },
  cancelBtn: {
    padding: '10px 20px',
    background: '#666',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer'
  },
  confirmBtn: {
    padding: '10px 20px',
    background: '#ff4d4d',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer'
  }
};

export default ConfirmDialog;
