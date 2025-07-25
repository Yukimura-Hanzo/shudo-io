"use client";

//? REACT MODULES
import React, { useState, ChangeEvent, FormEvent } from "react";
//? SHADCN UI
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
//? ICONS
import { MoreHorizontal } from "lucide-react";

//? TS Types
type TodoProps = {
  id: string;
  title: string;
  xp: number;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  editTodo: (id: string, newTitle: string) => void;
  deleteTodo: (id: string) => void;
  toggleTodoCompleted: (id: string) => void;
};

export default function Todo(props: TodoProps) {

  //? State VAR - store boolean value for editing
  const [isEditing, setIsEditing] = useState<boolean>(false);
  //? State VAR - hold the new title entered during editing
  const [newTitle, setNewTitle] = useState<string>("");

  //? FUNCTION - to handle input changes
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    //* Update the `title` state with the current input value
    setNewTitle(e.target.value);
  }
  
  //? FUNCTION - to handle form submission
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    //* prevent page reload
    e.preventDefault();
    //* call parent's editTodo with the updated title
    props.editTodo(props.id, newTitle);
    setNewTitle(""); //* clear input field
    setIsEditing(false); //* exit editing mode
  }

  //? FUNCTION - calculate the time taken to complete a task
  function getTimeTaken(): string | null {
    //* If the task is not completed, return null
    if (!props.completedAt) return null;
    const created = new Date(props.createdAt);              //* convert creation timestamp
    const completed = new Date(props.completedAt);          //* convert completion timestamp
    const diffMs = completed.getTime() - created.getTime(); //* get difference in ms
    const seconds = Math.floor(diffMs / 1000);              //* convert ms to seconds
    const minutes = Math.floor(seconds / 60);               //* convert seconds to minutes
    const remainingSeconds = seconds % 60;                  //* remaining seconds
    return `${minutes}m ${remainingSeconds}s`;              //* return formatted duration
  }

  //* --- TEMPLATE WHEN EDITING IS TRUE ---
  const editingTemplate = (
    <form onSubmit={handleSubmit}>
      <small>Experience Points: {props.xp}+</small>
      {/* Input field bound to newName state */}
      <Input
        id={props.id}
        type="text"
        value={newTitle}
        onChange={handleChange}
        placeholder={props.title} //* placeholder shows current todo title
        className="mt-4"
      />
      <div className="flex items-center justify-between w-full mt-4">
      {/* Delete button */}
      <Button 
        type="button"
        variant="destructive"
        onClick={() => props.deleteTodo(props.id)}
      > Delete
      </Button>
      {/* Save button to submit the changes */}
      <Button type="submit" className="mt-4">Save</Button>
      </div>
    </form>
  );

  //* --- TEMPLATE WHEN EDITING IS FALSE (DEFAULT VIEW) ---
  const viewTemplate = (
    <>
    <div className="flex items-center justify-between w-full">
      <span>
      <div className="flex items-center gap-3 mb-3">
        {/* Checkbox to toggle completed state */}
        <Checkbox
          id={props.id}
          checked={props.completed} //* reflects current completed state
          defaultChecked={props.completed} //* initial value for uncontrolled behavior
          onChange={() => props.toggleTodoCompleted(props.id)} //* mark completed/uncompleted
          onCheckedChange={() => props.toggleTodoCompleted(props.id)} //* some libraries use this
        />
        {/* Label showing the task name */}
        <Label className="form-label" htmlFor={props.id}>{props.title}</Label>
      </div>
      </span>
      <span>
        <Dialog>
          <form>
            <DialogTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader className="text-left">
                <DialogTitle>&#x1F4DD;Edit task</DialogTitle>
                <DialogDescription>
                  Make changes to your task here. Click save when you&apos;re done.
                </DialogDescription>
              </DialogHeader>
              {editingTemplate}
              <DialogFooter>
                <DialogClose asChild>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </span>
    </div>
    {/* Show time taken to complete the task if completed */}
    {props.completed && props.completedAt && (
      <div className="text-sm text-muted-foreground mb-2">
        Time taken: {getTimeTaken()}
      </div>
    )}
    </>
  );

  //? Conditionally render either the edit or view template inside a list item
  return <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>;
}
