import { getAuth } from 'firebase/auth';
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
    
    // Create a small test file
    const blob = new Blob(['test'], { type: 'text/plain' });
    const testFile = new File([blob], 'test-permissions.txt', { type: 'text/plain' });
    
    // Test different path formats
    const paths = [
      `shirts/${user.uid}/test-${Date.now()}.txt`,
      `shirts/test-${Date.now()}.txt`
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
