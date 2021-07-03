import { firestore } from './firebase.service'

export const subscribeTodos = (userId: string, emit: (payload: { type: 'added' | 'modified' | 'removed', data: any }) => void) => {
  return firestore.collection('products').where('userId', '==', userId)
    .onSnapshot((snaps) => snaps.docChanges().forEach((it) => emit({ type: it.type, data: it.doc.exists ? it.doc.data() : null })))
}
