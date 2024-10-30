import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss'
})

export class ChatInputComponent {
  chatForm: FormGroup;

  @Output() messageSent = new EventEmitter<string>();

  constructor(private fb: FormBuilder) {
    this.chatForm = this.fb.group({
      message: ['', Validators.required]
    });
  }

  sendMessage() {
    if (this.chatForm.valid) {
      this.messageSent.emit(this.chatForm.value.message);
      this.chatForm.reset();
    }
  }
}
