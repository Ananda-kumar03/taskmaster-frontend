import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '../components/styles.css'; // Ensure styles are linked

const HowToUse = () => {
    const guideText = `
# How to Use TaskMaster

Welcome to TaskMaster! This guide will help you get started.

## 1. Getting Started

* **Register/Login:** If you're new, register for an account. Otherwise, log in with your credentials.
* **Logout:** Click the 'Logout' button in the header to end your session.

## 2. Managing Your Tasks

### Adding a New Task
* **Text:** Type your task description in the "Add a new todo..." input field.
* **Priority:** Select a priority (None, Low, Medium, High) from the dropdown.
* **Due Date:** Click the calendar icon to pick a due date.
* **Reminder Time:** Enter a specific time for a reminder (e.g., 10:00).
* **Tags:** Add tags (comma-separated, e.g., \`work, urgent, projectX\`).
* **Description:** Use the textarea for more detailed notes. You can use **Markdown** for formatting!
* **Add Todo:** Click the "Add Todo" button to save your task.

### Editing a Task
* Click the "Edit" button next to any task.
* Modify the task details in the expanded form.
* Click "Save" to apply changes or "Cancel" to discard them.

### Task Completion
* Click the checkbox next to a task to mark it as complete/incomplete.
* **Note:** If a task has uncompleted subtasks, its main checkbox will be disabled. Complete all subtasks first!

### Deleting a Task
* Click the trashcan icon (Delete button) next to a task. You will be asked for confirmation.

### Archiving/Restoring Tasks
* Click the archive icon to move a task to the 'Archived' list.
* In the 'Archived' filter, click the restore icon to bring a task back to your active list.

### Subtasks
* When editing a task, you can add, edit, or remove subtasks.
* Toggle individual subtask checkboxes to mark them complete/incomplete.

### Recurring Tasks
* When editing a task, you can set it to repeat daily, weekly, monthly, or yearly.
* Specify recurrence details (e.g., day of week for weekly, day of month for monthly/yearly).

### Pinned Tasks
* Click the pin icon 📌 next to a task to mark it as important.
* Pinned tasks will always appear at the top of the list regardless of other sorting filters.
* You can unpin a task at any time by clicking the pin icon again.

## 3. Organizing and Filtering Tasks

* **Search:** Use the "Search tasks..." input to find tasks by text, description, or tags.
* **Main Filters:**
    * **All Tasks:** View all active tasks.
    * **My Day:** Tasks due today.
    * **Upcoming:** Tasks with future due dates.
    * **Completed/Incomplete:** Filter by completion status.
    * **Archived:** View and restore archived tasks.
    * **By Priority:** Filter by Low, Medium, or High priority.
    * **By Tag:** Filter by a specific tag.
    * **By Date Range:** Filter by Today, This Week, This Month, or Past Due.

## 4. Drag and Drop Reordering

* Enable "Drag & Drop" using the toggle button in the header.
* Click and hold a task item to drag it to a new position in the list.

## 5. Themes

* Use the theme toggle in the header to switch between Light and Dark modes.

## 6. Productivity Insights

* View charts showing completed tasks, overdue percentage, and productivity over the past week.
* Use the dashboard to stay motivated with trends and stats.

If you have any questions or feedback, please visit the Feedback Form page!
`;
    return (
        <div className="page-content how-to-use">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{guideText}</ReactMarkdown>
        </div>
    );
};

export default HowToUse;
