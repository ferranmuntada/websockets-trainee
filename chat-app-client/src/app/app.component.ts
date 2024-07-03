import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  socket: any;
  message: string = '';
  messages: { sender: string; message: string }[] = [];
  username: string = '';
  recipient: string = '';
  registered: boolean = false;

  ngOnInit() {
    this.socket = io('http://localhost:3000');

    this.socket.on(
      'private message',
      ({ sender, message }: { sender: string; message: string }) => {
        this.messages.push({ sender, message });
      }
    );
  }

  register() {
    if (this.username) {
      this.socket.emit('register', this.username);
      this.registered = true;
    }
  }

  sendMessage() {
    if (this.recipient && this.message) {
      this.socket.emit('private message', {
        recipient: this.recipient,
        message: this.message,
      });
      this.messages.push({ sender: 'You', message: this.message });
      this.message = '';
    }
  }
}
