import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

firebase.initializeApp({
  // SET YOUR CREDENTIALS
})

export const fireauth = firebase.auth()
export const firestore = firebase.firestore()

export type Auth = ReturnType<typeof firebase.auth>
export type FirebaseUser = Auth['currentUser']
