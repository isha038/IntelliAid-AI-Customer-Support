import React, { useState } from "react";
import styles from "./SignUp.module.scss";
import { auth, db } from "../firebase";
import { getAuth } from 'firebase/auth';
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
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
        uid: user.uid,
      });
      console.log("User signed up:", user);
      router.push("/landingPage");
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          alert("Email is already in use. Please sign in.");
          break;
        case "auth/invalid-email":
          alert("Invalid email address. Please check the email format.");
          break;
        case "auth/weak-password":
          alert("Password should be at least 6 characters.");
          break;
        default:
          console.error("Error during sign up:", error.message);
          alert("An error occurred. Please try again.");
      }
      
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <div className={styles.welcomeText}>
          <h1>Join TrendyThreads</h1>
          <p>Create an account to get started</p>
        </div>
      </div>
      <div className={styles.rightSection}>
        <div className={styles.card}>
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputContainer}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputContainer}>
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
            <div className={styles.links}>
              <Link href="/signin">Already have an account? Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
