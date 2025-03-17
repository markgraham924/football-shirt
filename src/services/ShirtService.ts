import { db, storage, auth } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface Shirt {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  userId: string;
  userDisplayName: string;
  createdAt: any;
  team?: string;
  league?: string;
  season?: string;
  kitType?: string;
}

interface ShirtMetadata {
  team?: string;
  league?: string;
  season?: string;
  kitType?: string;
}

export const addShirt = async (
  name: string, 
  description: string, 
  imageFile: File,
  metadata?: ShirtMetadata
): Promise<string> => {
  try {
    if (!auth.currentUser) throw new Error('User not authenticated');
    
    // Upload image to Firebase Storage
    const storageRef = ref(storage, `shirts/${auth.currentUser.uid}/${Date.now()}_${imageFile.name}`);
    const snapshot = await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(snapshot.ref);
    
    // Add shirt data to Firestore
    const shirtData = {
      name,
      description,
      imageUrl,
      userId: auth.currentUser.uid,
      userDisplayName: auth.currentUser.displayName || 'Unknown User',
      createdAt: serverTimestamp(),
      team: metadata?.team || null,
      league: metadata?.league || null,
      season: metadata?.season || null,
      kitType: metadata?.kitType || null
    };
    
    const docRef = await addDoc(collection(db, "shirts"), shirtData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding shirt: ", error);
    throw error;
  }
};

export const getUserShirts = async (userId: string): Promise<Shirt[]> => {
  try {
    const q = query(
      collection(db, "shirts"), 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const shirts: Shirt[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      shirts.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date()
      } as Shirt);
    });
    
    return shirts;
  } catch (error) {
    console.error("Error getting shirts: ", error);
    throw error;
  }
};

export const getAllShirts = async (): Promise<Shirt[]> => {
  try {
    const q = query(
      collection(db, "shirts"), 
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const shirts: Shirt[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      shirts.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date()
      } as Shirt);
    });
    
    return shirts;
  } catch (error) {
    console.error("Error getting all shirts: ", error);
    throw error;
  }
};

export const getShirtById = async (shirtId: string): Promise<Shirt | null> => {
  try {
    const shirtDoc = await getDoc(doc(db, "shirts", shirtId));
    
    if (shirtDoc.exists()) {
      const data = shirtDoc.data();
      return {
        id: shirtDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date()
      } as Shirt;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting shirt: ", error);
    throw error;
  }
};
