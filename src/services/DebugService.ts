import { getAuth, signOut, signInAnonymously } from 'firebase/auth';
import { ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase/config';

export async function testStoragePermissions() {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      return { success: false, message: 'No user is signed in' };
    }
    
    console.log('Current user ID:', user.uid);
    console.log('Auth token:', await user.getIdToken());
    
    // Create a small test file
    const blob = new Blob(['test'], { type: 'text/plain' });
    const testFile = new File([blob], 'test-permissions.txt', { type: 'text/plain' });
    
    // Test different path formats
    const paths = [
      `shirts/${user.uid}/test-${Date.now()}.txt`,
      `shirts/test-${Date.now()}.txt`,
      `test-${Date.now()}.txt`  // Root level test
    ];
    
    const results = [];
    
    for (const path of paths) {
      try {
        const fileRef = ref(storage, path);
        await uploadBytes(fileRef, testFile);
        results.push({ path, success: true });
      } catch (error: any) {
        results.push({ 
          path, 
          success: false, 
          error: error.message,
          code: error.code
        });
      }
    }
    
    return {
      success: true,
      userId: user.uid,
      isAnonymous: user.isAnonymous,
      emailVerified: user.emailVerified,
      authTime: user.metadata.creationTime,
      lastSignInTime: user.metadata.lastSignInTime,
      results
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      code: error.code
    };
  }
}

export async function refreshAuth() {
  const auth = getAuth();
  try {
    // Sign out and sign in anonymously to refresh the token
    await signOut(auth);
    await signInAnonymously(auth);
    return { success: true, message: "Auth refreshed with anonymous account" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
