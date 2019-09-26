import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { AngularFireAuth } from '@angular/fire/auth';
import { GoogleUserInterface } from '../interfaces/google-user.interface';
import { Injectable } from '@angular/core';
import { MessageInterface } from '../interfaces/message.interface';
import { auth } from 'firebase/app';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public chats: MessageInterface[] = [];
  public user: GoogleUserInterface;
  public loading = true;

  private itemsCollection: AngularFirestoreCollection<MessageInterface>;

  constructor(private angularFirestore: AngularFirestore, public angularFireAuth: AngularFireAuth) {
    this.angularFireAuth.authState.subscribe( (user: any) => {
      this.loading = false;
      if (!user) {return; }

      const tempUser = {
        displayName: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        uid: user.uid
      };


      this.user = tempUser;
      console.log('user state', this.user);
    });

   }

   login(provider: string) {
    this.angularFireAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then();
  }
  logout() {
    this.user = null;
    this.angularFireAuth.auth.signOut();
  }

  loadMessages() {
    this.itemsCollection = this.angularFirestore.collection<MessageInterface>('chats', ref => ref.orderBy('date', 'desc').limit(5));
    return this.itemsCollection.valueChanges().pipe(
                                map((messages: MessageInterface[]) => {
                                  console.log('mensajes ', messages);
                                  this.chats = [];
                                  for (const message of messages) {
                                    this.chats.unshift(message);
                                  }
                                  return this.chats;
                                })
                              );
  }

  sendMessage(text: string) {

    // falta el uuid
    const message: MessageInterface = {
      name: this.user.displayName,
      message: text,
      date: new Date().getTime(),
      photoUrl: this.user.photoUrl,
      uid: this.user.uid
    };

    return this.itemsCollection.add(message);
  }
}
