import axios from "axios";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "../firebase";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const loginWithFirebaseProvider = async (providerName = "google") => {
  const provider =
    providerName === "facebook" ? facebookProvider : googleProvider;

  try {
    const firebaseResult = await signInWithPopup(auth, provider);

    const firebaseUser = firebaseResult.user;

    if (!firebaseUser) {
      throw new Error("Firebase user not found");
    }

    const idToken = await firebaseUser.getIdToken(true);

    const res = await axios.post(`${API_BASE_URL}/api/auth/firebase-login`, {
      idToken,
    });

    if (!res.data?.success) {
      throw new Error(res.data?.message || "Firebase login failed");
    }

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("authUser", JSON.stringify(res.data.user));
    localStorage.setItem("user", JSON.stringify(res.data.user));

    window.dispatchEvent(new Event("storage"));

    return res.data;
  } catch (error) {
    console.error(`${providerName} login failed:`, error);

    const backendMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.code;

    const firebaseMessage =
      error.code === "auth/popup-closed-by-user"
        ? "Login popup was closed before completing login"
        : error.code === "auth/cancelled-popup-request"
        ? "Another login popup is already open"
        : error.code === "auth/account-exists-with-different-credential"
        ? "An account already exists with the same email using another login method"
        : error.code === "auth/unauthorized-domain"
        ? "This domain is not authorized in Firebase Authentication"
        : error.code === "auth/configuration-not-found"
        ? "Firebase Authentication provider is not configured"
        : error.message;

    throw new Error(
      backendMessage || firebaseMessage || "Firebase login failed"
    );
  }
};

export const logoutFirebaseUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.warn("Firebase sign out failed:", error.message);
  }

  localStorage.removeItem("token");
  localStorage.removeItem("authUser");
  localStorage.removeItem("user");

  window.dispatchEvent(new Event("storage"));
};