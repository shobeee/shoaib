import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Login() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // If a token is found, navigate to Home directly
      navigate('/');
    }
  }, [navigate]);

  async function encryptDataWithWebCrypto(obj, publicKey) {
    try {
      const binaryDerString = window.atob(publicKey);
      const binaryDer = Uint8Array.from(binaryDerString, c => c.charCodeAt(0));

      const importedPublicKey = await window.crypto.subtle.importKey(
        "spki",
        binaryDer.buffer,
        {
          name: "RSA-OAEP",
          hash: { name: "SHA-256" },
        },
        true,
        ["encrypt"]
      );

      const encodedData = new TextEncoder().encode(JSON.stringify(obj));
      const encryptedData = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        importedPublicKey,
        encodedData
      );

      return btoa(String.fromCharCode(...new Uint8Array(encryptedData)));
    } catch (error) {
      console.error("Error during encryption:", error);
      throw error;
    }
  }

  const login = async () => {
    if (!publicKey) {
      try {
        const response = await axios.get(`http://localhost:3001/getPublicKey`);
        const key = response.data.cleanedPublicKey;
        setPublicKey(key);
      } catch (error) {
        console.error("Error fetching public key:", error);
      }
    }
    setAttempts(prevAttempts => prevAttempts + 1);
  };

  useEffect(() => {
    if (attempts > 0) {
      handleEncryptedData();
    }
  }, [attempts]);

  const handleEncryptedData = async () => {
    const credentials = {
      name: name,
      password: password,
    };

    try {
      const encryptedData = await encryptDataWithWebCrypto(credentials, publicKey);
      const response = await axios.post(`http://localhost:3001/gettingEncryptedData`, {
        encryptedData,
      });

      if (response.data.message === 'Invalid Credentials') {
        setErrorMessage(response.data.message);
        return;
      }

      const receivedToken = response.data.message;
      localStorage.setItem('token', receivedToken); // Store token for future sessions

      // Navigate to the Home page after successful login
      navigate('/');
    } catch (error) {
      console.error("Error while sending the encrypted data", error);
    }
  };

  return (
    <div className="login">
      <div style={{
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '20px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '5px' }}>
          <label>Name</label>
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Enter name"
            style={{ padding: '8px', width: '200px', borderRadius: '10px' }}
          />
          <span style={{ color: 'red', fontSize: '10px', display: 'inline-block' }}>{errorMessage}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '5px' }}>
          <label>Password</label>
          <input
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter password"
            style={{ padding: '8px', width: '200px', borderRadius: '10px' }}
          />
        </div>
        <button id="login-btn" style={{ borderRadius: '5px', height: '30px', width: '100px' }} onClick={login}>Login</button>
      </div>
    </div>
  );
}

export default Login;
