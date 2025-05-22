import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonIcon,
  IonText,
  IonLoading,
  IonHeader,
  IonToolbar,
  IonTitle,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig"; // Adjust path if needed

const Login: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
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
      await signInWithEmailAndPassword(auth, email, password);
      history.push("/chat");
    } catch (err: any) {
      setError(
        err.code === "auth/user-not-found"
          ? "No user found with this email."
          : err.code === "auth/wrong-password"
          ? "Incorrect password."
          : "Login failed. Please try again."
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
        background: "linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 100%)" 
      }}>
        <form
          onSubmit={handleSubmit}
        >
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <LogIn color="#6366f1" size={40} style={{ marginBottom: 8 }} />
            <h2 style={{ color: "#3730a3", fontWeight: 700, fontSize: 24 }}>Welcome Back</h2>
          </div>
          {error && (
            <IonText color="danger">
              <div style={{ marginBottom: 12, textAlign: "center" }}>{error}</div>
            </IonText>
          )}
          <IonItem color={"light"} lines="none" className="ion-margin-bottom" style={{ borderRadius: 8, marginBottom: 16 }}>
            <span slot="start" style={{ marginRight: 8 }}>
              <Mail size={18} color="#a1a1aa" />
            </span>
            <IonInput
              type="email"
              placeholder="Email"
              value={email}
              onIonChange={e => setEmail(e.detail.value!)}
              disabled={loading}
              required
              autoFocus
            />
          </IonItem>
          <IonItem lines="none" className="ion-margin-bottom" style={{ borderRadius: 8, marginBottom: 16 }}>
            <span slot="start" style={{ marginRight: 8 }}>
              <Lock size={18} color="#a1a1aa" />
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
            {loading ? (
              <IonLoading isOpen={loading} message="Signing in..." spinner="crescent" />
            ) : (
              <>
                <LogIn size={18} style={{ marginRight: 8 }} />
                Sign In
              </>
            )}
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Login;