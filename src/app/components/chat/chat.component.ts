import { Component, OnInit } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { ChatService } from '../../services/chat.service';
import { MessageInterface } from '../../interfaces/message.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  chats: Observable<MessageInterface[]>;
  message = '';
  domElement: any;

  constructor(db: AngularFirestore, public chatService: ChatService) {
    // this.chats = db.collection('chats').valueChanges();
    console.log(this.chats);
    chatService.loadMessages().subscribe(() => {
      setTimeout(() => {
      this.domElement.scrollTop = this.domElement.scrollHeight;
      }, 20);
    });
  }

  ngOnInit() {
    this.domElement = document.getElementById('app-messages');
  }

  sendMessage() {
    if (this.message.length > 0) {
      this.chatService.sendMessage(this.message).then( resp => {
        console.log('success ', resp);
        this.message = '';
      }).catch( err => {
        console.log('error al enviar ', err);
      });
      console.log(this.message);
    }
  }
}
