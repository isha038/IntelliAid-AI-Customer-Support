import React, { useState } from "react";
import "./SignUp.scss";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { doc, setDoc } from "firebase/firestore";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save additional user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
        uid: user.uid,
      });

      console.log("User signed up:", user);
      router.push("/landingPage");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Email is already in use. Please sign in.");
      } else {
        console.error("Error during sign up:", error);
      }
    }
  };

  return (
    <div className="container">
      <div className="left-section">
        <div className="welcome-text">
          <h1>Join IntelliAid</h1>
          <p>Create an account to get started</p>
        </div>
      </div>
      <div className="right-section">
        <div className="card">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-container">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-container">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Sign Up</button>
            <div className="links">
              <Link href="/signin">Already have an account? Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
