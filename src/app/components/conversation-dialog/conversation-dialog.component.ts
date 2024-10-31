import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-conversation-dialog',
  templateUrl: './conversation-dialog.component.html'
})
export class ConversationDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { conversationHistory: string }) {}
}
