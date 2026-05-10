import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../services/ai.service';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-assistant.component.html',
  styleUrl: './ai-assistant.component.scss'
})
export class AiAssistantComponent {
  aiService = inject(AiService);
  
  isOpen = false;
  isMinimized = false;
  userInput = '';
  isLoading = false;
  
  messages: ChatMessage[] = [
    { role: 'assistant', content: 'Hello! I am Nextrip AI, your personal luxury travel assistant. Where would you like to travel next?' }
  ];

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  toggleChat() {
    this.isOpen = !this.isOpen;
    this.isMinimized = false;
    if (this.isOpen) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  minimizeChat(event: Event) {
    event.stopPropagation();
    this.isMinimized = !this.isMinimized;
  }

  closeChat(event: Event) {
    event.stopPropagation();
    this.isOpen = false;
  }

  sendMessage() {
    if (!this.userInput.trim() || this.isLoading) return;

    const message = this.userInput.trim();
    this.userInput = '';
    
    this.messages.push({ role: 'user', content: message });
    this.isLoading = true;
    this.scrollToBottom();

    // Prepare history (excluding system prompt as backend handles it)
    const history = this.messages.slice(0, -1).map(m => ({ role: m.role, content: m.content }));

    this.aiService.chatWithAi(message, history).subscribe({
      next: (res) => {
        if (res && res.reply) {
          this.messages.push({ role: 'assistant', content: res.reply });
        } else if (res && res.isError) {
          this.messages.push({ role: 'assistant', content: res.message });
        }
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: (err) => {
        console.error(err);
        this.messages.push({ role: 'assistant', content: 'Sorry, I am having trouble connecting to my servers. Please try again later.' });
        this.isLoading = false;
        this.scrollToBottom();
      }
    });
  }

  scrollToBottom(): void {
    try {
      setTimeout(() => {
        if (this.myScrollContainer) {
          this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        }
      }, 50);
    } catch(err) { }
  }
}
