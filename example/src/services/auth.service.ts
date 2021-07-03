import { Auth, fireauth, FirebaseUser } from './firebase.service'

export const signInWithEmailAndPassword = (email: string, password: string) =>
  fireauth.signInWithEmailAndPassword(email, password)

export const onAuthStateChanged = (observer: Parameters<Auth['onAuthStateChanged']>[0]) =>
  fireauth.onAuthStateChanged(observer)

export const currentUser = fireauth.currentUser

export const authorized = () => {
  return new Promise<FirebaseUser | null>((resolve, _) =>
    fireauth.onAuthStateChanged(
      (user) => {
        if (user) {
          resolve(user)
        }
        resolve(null)
      },
      (_) => resolve(null)
    )
  )
}

export const signOut = async () => {
  await fireauth.signOut()
}
