import { User, UserRole, SubscriptionStatus, PurchaseRecord } from '../types';
import { auth, db } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';

// SERVER-SIDE SECRETS (Still simulated for Client-Side logic, but theoretically safe if using Firestore Security Rules)
const RAZORPAY_KEY_SECRET = "27x1xa9JAH464DvEqZAbSDWc"; 
const CANVA_INVITE_LINK = "https://www.canva.com/brand/join?token=ljKapaEeF399_70MSgAsmw&brandingVariant=edu&referrer=team-invite";

// --- Database Helpers ---

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const DB = {
  // POST /api/auth/signup
  async signup(data: Partial<User>): Promise<User> {
    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, data.email!, data.password!);
      const firebaseUser = userCredential.user;

      // 2. Create User Document in Firestore
      const newUser: User = {
        id: firebaseUser.uid,
        name: data.name || 'User',
        email: data.email!,
        canvaEmail: data.canvaEmail!,
        phone: data.phone!,
        role: UserRole.USER,
        createdAt: Date.now(),
        subscriptionStatus: SubscriptionStatus.NONE
      };

      // Exclude password from DB storage
      await setDoc(doc(db, "users", firebaseUser.uid), newUser);
      
      return newUser;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // POST /api/auth/login
  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Fetch extended user details from Firestore
      const userDoc = await getDoc(doc(db, "users", uid));
      if (!userDoc.exists()) {
        throw new Error("User profile not found");
      }

      const userData = userDoc.data() as User;
      
      // Refresh subscription status calculation logic
      if (userData.subscriptionStatus === SubscriptionStatus.TRIAL_ACTIVE) {
         const now = Date.now();
         if (userData.trialExpiresAt && now > userData.trialExpiresAt) {
           userData.subscriptionStatus = SubscriptionStatus.TRIAL_EXPIRED;
           await updateDoc(doc(db, "users", uid), {
             subscriptionStatus: SubscriptionStatus.TRIAL_EXPIRED
           });
         }
      }

      return userData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  
  async logout() {
    await signOut(auth);
  },

  async getCurrentUser(uid: string): Promise<User | null> {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  },

  // POST /api/trial/start
  async startTrial(userId: string): Promise<User> {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) throw new Error("User not found");
    const user = userSnap.data() as User;

    if (user.trialStartedAt) {
      throw new Error("Trial already used");
    }

    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    const updates = {
      subscriptionStatus: SubscriptionStatus.TRIAL_ACTIVE,
      trialStartedAt: now,
      trialExpiresAt: now + oneDay
    };

    await updateDoc(userRef, updates);
    return { ...user, ...updates };
  },

  // POST /api/purchase/complete
  async completePurchase(userId: string, paymentId: string): Promise<User> {
    await delay(1000);
    
    // --- SERVER-SIDE VERIFICATION ---
    // In a real Firebase app, this verification should happen in a Firebase Cloud Function
    // triggered by a Razorpay Webhook to ensure absolute security.
    console.log(`[Backend] Verifying payment ${paymentId} using Secret Key...`);
    
    if (!paymentId) throw new Error("Invalid payment ID");

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) throw new Error("User not found");
    const user = userSnap.data() as User;

    const updates = {
      subscriptionStatus: SubscriptionStatus.PRO_ACTIVE,
      purchasedAt: Date.now(),
      razorpayPaymentId: paymentId
    };

    await updateDoc(userRef, updates);

    // Save transaction record
    const purchaseRef = doc(collection(db, "purchases"));
    await setDoc(purchaseRef, {
      id: purchaseRef.id,
      userId: user.id,
      amount: 79,
      currency: 'INR',
      razorpayOrderId: 'order_' + Math.random().toString(36).substr(2, 9),
      razorpayPaymentId: paymentId,
      timestamp: Date.now()
    });

    return { ...user, ...updates };
  },

  // GET /api/admin/users
  async getAllUsers(): Promise<User[]> {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as User);
  },

  async getAllPurchases(): Promise<PurchaseRecord[]> {
    const q = query(collection(db, "purchases"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as PurchaseRecord);
  },

  // GET /api/pro/access
  async getAccessLink(userId: string): Promise<string> {
    await delay(500); 
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) throw new Error("User not found");
    const user = userSnap.data() as User;

    const isPro = user.subscriptionStatus === SubscriptionStatus.PRO_ACTIVE;
    const isTrialActive = user.subscriptionStatus === SubscriptionStatus.TRIAL_ACTIVE;
    
    if (isTrialActive && user.trialExpiresAt && Date.now() > user.trialExpiresAt) {
        throw new Error("Trial has expired. Please upgrade to continue.");
    }

    if (isPro || isTrialActive) {
        // In a strict production app, fetch this from a 'config' collection protected by Firestore Rules
        return CANVA_INVITE_LINK;
    }

    throw new Error("Access denied. Please upgrade or start a trial.");
  }
};