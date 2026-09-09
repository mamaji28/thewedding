// Reuse Firebase app that is already initialized by src/firebase.ts
import '../firebase'
import { getApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'

export const cameraFirebaseApp = getApp()
export const cameraDb = getDatabase(cameraFirebaseApp)
export const cameraStorage = getStorage(cameraFirebaseApp)
