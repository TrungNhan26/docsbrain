export class EditorState {
    constructor() {
      this.history = [];
      this.redoStack = [];
      this.content = '';
    }
  
    saveState(content) {
      this.history.push(this.content);
      this.content = content;
      this.redoStack = []; // Reset redo stack khi có chỉnh sửa mới
    }
  
    undo(editor) {
      if (this.history.length > 0) {
        this.redoStack.push(this.content);
        this.content = this.history.pop();
        editor.value.innerHTML = this.content;
      }
    }
  
    redo(editor) {
      if (this.redoStack.length > 0) {
        this.history.push(this.content);
        this.content = this.redoStack.pop();
        editor.value.innerHTML = this.content;
      }
    }
  
    get wordCount() {
      return this.content.trim() ? this.content.trim().split(/\s+/).length : 0;
    }
  
    get characterCount() {
      return this.content.length;
    }
  }
  