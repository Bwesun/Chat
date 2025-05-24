import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonText,
  IonHeader,
  IonToolbar,
  IonTitle,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, UserPlus } from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig"; // Adjust path if needed

const Register: React.FC = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!name) return "Name is required";
    if (!email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Invalid email address";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      // Register user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = userCredential.user;

      // Create user document in Firestore
      await setDoc(doc(db, "users", uid), {
        uid,
        name,
        email,
        createdAt: new Date().toISOString(),
      });

      history.push("/messages");
    } catch (err: any) {
      setError(
        err.code === "auth/email-already-in-use"
          ? "Email already in use."
          : "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}>
        <form
          onSubmit={handleSubmit}
        >
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <UserPlus color="#6366f1" size={40} style={{ marginBottom: 8 }} />
            <h2 style={{ color: "#3730a3", fontWeight: 700, fontSize: 24 }}>Create Account</h2>
          </div>
          {error && (
            <IonText color="danger">
              <div style={{ marginBottom: 12, textAlign: "center" }}>{error}</div>
            </IonText>
          )}
          <IonItem color={"light"}className="ion-margin-bottom" style={{ borderRadius: 8, marginBottom: 16 }}>
            <span slot="start" style={{ marginRight: 8 }}>
              <User size={18} className="primary-color" />
            </span>
            <IonInput
              type="text"
              placeholder="Full Name"
              value={name}
              onIonChange={e => setName(e.detail.value!)}
              disabled={loading}
              required
              autoFocus
            />
          </IonItem>
          <IonItem color={"light"} className="ion-margin-bottom" style={{ borderRadius: 8, marginBottom: 16 }}>
            <span slot="start" style={{ marginRight: 8 }}>
              <Mail size={18} className="primary-color" />
            </span>
            <IonInput
              type="email"
              placeholder="Email"
              value={email}
              onIonChange={e => setEmail(e.detail.value!)}
              disabled={loading}
              required
            />
          </IonItem>
          <IonItem color={"light"} className="ion-margin-bottom" style={{ borderRadius: 8, marginBottom: 16 }}>
            <span slot="start" style={{ marginRight: 8 }}>
              <Lock size={18} className="primary-color" />
            </span>
            <IonInput
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onIonChange={e => setPassword(e.detail.value!)}
              disabled={loading}
              required
            />
            <IonButton
              fill="clear"
              slot="end"
              type="button"
              onClick={() => setShowPass(v => !v)}
              style={{ minWidth: 0 }}
              tabIndex={-1}
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </IonButton>
          </IonItem>
          <IonButton
            expand="block"
            type="submit"
            color="primary"
            disabled={loading}
            style={{ marginTop: 8, fontWeight: 600, fontSize: 16 }}
          >
            <UserPlus size={18} style={{ marginRight: 8 }} />
            {loading ? "Creating..." : "Create Account"}
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Register;