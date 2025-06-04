import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"eventjoy-76f8f","appId":"1:777475666587:web:704978c13dfa2276b2cc3e","databaseURL":"https://eventjoy-76f8f-default-rtdb.europe-west1.firebasedatabase.app","storageBucket":"eventjoy-76f8f.firebasestorage.app","apiKey":"AIzaSyAotlAk9xpxAymQMKj1-MnfZogjkXxAgqY","authDomain":"eventjoy-76f8f.firebaseapp.com","messagingSenderId":"777475666587","measurementId":"G-S2NX203WBM"})), provideAuth(() => getAuth()), provideDatabase(() => getDatabase()), provideMessaging(() => getMessaging())]
};
