import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";
import { signInWithEmailAndPassword } from 'firebase/auth'; 
import { firebaseAuth } from '../utils/firebase-config';


export default function Login() {
    const navigate = useNavigate();
    
    const [formValues, setFormValues] = useState({
        email: "",
        password: "",
    })

    const handleLogIn = async () => {
        try {
            const { email, password } = formValues;
            await signInWithEmailAndPassword(firebaseAuth, email, password);
            navigate("/netflix");
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <Container>
            <BackgroundImage />
            <div className="content">
                <Header />

                <div className="form-container flex column a-center j-center"> {/* Fix CSS class */}
                    <div className="form flex column a-center j-center">
                        <div className="title">
                            <h3>Login</h3>
                        </div>
                        <div className="container flex column">
                            <input
                                type="email"
                                placeholder="Email Address"
                                name="email"
                                value={formValues.email}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={formValues.password}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                            />

                            <button onClick={handleLogIn}>Log In</button>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}


const Container = styled.div`
  position: relative;
  height: 100vh;
  overflow: hidden;
  
  .content {
    position: relative;
    z-index: 10;
    height: 100%;
  }
  
  .form-container {
    height: 85vh;
    width: 100%;
  }
  
  .form {
    background: rgba(0, 0, 0, 0.8);
    padding: 60px 68px 40px;
    border-radius: 4px;
    width: 100%;
    max-width: 450px;
  }
  
  .title h3 {
    color: white;
    font-size: 32px;
    margin-bottom: 28px;
    font-weight: 500;
  }
  
  .container input {
    background: #333;
    color: white;
    border: none;
    padding: 16px 20px;
    border-radius: 4px;
    margin-bottom: 16px;
    font-size: 16px;
    width: 100%;
  }
  
  .container input::placeholder {
    color: #8c8c8c;
  }
  
  .container button {
    background: #e50914;
    color: white;
    border: none;
    padding: 16px;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    margin-top: 24px;
  }
  
  .container button:hover {
    background: #f40612;
  }
`;