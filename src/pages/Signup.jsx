import { createUserWithEmailAndPassword } from 'firebase/auth';  
import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom"; 
import styled from "styled-components";
import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";
import { firebaseAuth } from '../utils/firebase-config';


export default function Signup(){

    const navigate = useNavigate();
    //Hooks
    const [showPassword, setShowPassword] = useState(false);
    const [formValues, setFormValues] = useState({
      email: "",
      password: "",
    })

  const handleSignIn = async () => {
  try{
    const { email, password } = formValues;
    await createUserWithEmailAndPassword(firebaseAuth, email, password);
    navigate("/"); // Redirect only after successful signup
  }
  catch(err)
  {
    console.log(err);
  }
}

    // useEffect(() => {
    //   onAuthStateChanged(firebaseAuth, (user) => {
    //     if(user) navigate("/");
    //   });
    // }, [navigate]);


    return (

    <Container showPassword = {showPassword}>
        <BackgroundImage />
        <div className="content">
        <Header login />

        <div className="body flex column a-center j-center">
           
            <div className="text flex column">
            <h1>Unlimited Movies, TV shows and more</h1>
            <h4>Watch anywhere. Cancel anytime.</h4>
            <h6>Ready to watch? Enter your email to create or restart membership. </h6>
            </div>

            <div className="form">
                <input 
                type="email" 
                placeholder="Email Address" 
                name="email" 
                value={formValues.email} 
                onChange={(e) => 
                  setFormValues({...formValues, [e.target.name] : e.target.value})}
                />

                {
                  showPassword && 
                  (<input 
                    type="password" 
                    placeholder="Password" 
                    name="password"
                    value={formValues.password} 
                    onChange={(e) => 
                    setFormValues({...formValues, [e.target.name] : e.target.value})}
                    />
                  )
                }
  
                {
                  !showPassword &&
                  (
                    <button onClick = {() => setShowPassword(true)}>Get Started</button>
                  )
                }

            </div>
            <button onClick={handleSignIn}>Sign Up</button>
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
  
  .body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    padding-top: 80px;
    position: relative;
    z-index: 10;
  }
  
  .text {
    display: flex;
    flex-direction: column;
    text-align: center;
    margin-bottom: 30px;
    max-width: 600px;
  }
  
  .text h1 {
    font-size: 3.2rem;
    font-weight: 900;
    margin-bottom: 20px;
    color: white;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  }
  
  .text h4 {
    font-size: 1.6rem;
    font-weight: 400;
    margin-bottom: 15px;
    color: white;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
  }
  
  .text h6 {
    font-size: 1.2rem;
    font-weight: 400;
    color: white;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
  }
  
  .form {
    display: flex;
    gap: 2px;
    margin-bottom: 20px;
    max-width: 600px;
  }
  
   .form input {
    padding: 15px;
    font-size: 16px;
    border: none;
    flex: 1;
    min-width: 250px;
    border-radius: 4px;
    color: black !important;  /* Add this line */
    background-color: white;  /* Add this line */
  }
  
  .form input::placeholder {
    color: #666;  /* Add this for placeholder text */
  }
  
  .form input:first-child {
    border-radius: 4px 0 0 4px;
  }
  
  .form input[type="password"] {
    border-radius: 0;
  }
  
  .form button {
    padding: 15px 30px;
    background-color: #e50914;
    color: white;
    border: none;
    border-radius: 0 4px 4px 0;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
  }
  
.form button:hover {
    background-color: #f40612;
  }
  
  .body > button {
    background-color: #e50914;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 20px;
  }
  
  .body > button:hover {
    background-color: #f40612;
  }
`;