import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, connectAuthEmulator } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, enableNetwork, disableNetwork } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
// Add scopes and custom parameters for better performance
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({
  prompt: 'select_account',
  hd: '', // Allow any domain
});

// Optimization: Enable offline persistence for better performance
// Check network connectivity and enable/disable accordingly
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    enableNetwork(db).catch(() => {/* Network enable failed */});
  });
  
  window.addEventListener('offline', () => {
    disableNetwork(db).catch(() => {/* Network disable failed */});
  });
}

// Auth functions
export const createUserAccount = async (email: string, password: string, name: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update the user's profile with their name
    await updateProfile(user, {
      displayName: name
    });
    
    // Store additional user data in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      createdAt: new Date(),
      uid: user.uid
    });
    
    return user;
  } catch (error) {
    console.error('Error creating user account:', error);
    throw error;
  }
};

export const signInUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Google Sign-In function with enhanced error handling
export const signInWithGoogle = async () => {
  try {
    // Use a more optimized approach with error handling for blocked popups
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Don't block UI with database operations - do them in background
    // This makes login feel instant for users
    Promise.resolve().then(async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          await setDoc(doc(db, 'users', user.uid), {
            name: user.displayName || 'Google User',
            email: user.email,
            createdAt: new Date(),
            uid: user.uid
          });
        }
      } catch (error) {
        // PRODUCTION: User data sync failed - non-critical
        // Don't throw error here as auth already succeeded
      }
    });
    
    return user;
  } catch (error: any) {
    // PRODUCTION: Google sign-in error logged
    
    // Provide more specific error messages
    if (error?.code === 'auth/popup-blocked') {
      throw new Error('Popup blocked. Please allow popups for this site and try again.');
    } else if (error?.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in was cancelled. Please try again.');
    } else if (error?.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your connection and try again.');
    } else if (error?.code === 'auth/too-many-requests') {
      throw new Error('Too many attempts. Please wait a moment and try again.');
    }
    
    throw error;
  }
};

export const getUserData = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};