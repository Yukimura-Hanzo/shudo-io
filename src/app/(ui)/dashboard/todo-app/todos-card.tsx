"use client";

//? REACT MODULES
import React, { useState, useEffect } from "react";
//? NANOID - Utility import to generate unique IDs
import { nanoid } from "nanoid";
//? SHADCN UI
import { Button } from "@/components/ui/button";
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
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
//? UI COMPONENTS
import Form from "./form";
import Todo from "@/app/(ui)/dashboard/todo-app/todo";
import FilterButton from "@/app/(ui)/dashboard/todo-app/filter-button";

// -----------------------------
// Types & Constants
// -----------------------------

//? Represents a single todo item
interface TodoType {
  id: string;
  title: string;
  completed: boolean;
  xp: number;
  createdAt: string;
  completedAt?: string;
  timeTaken?: string;
}

interface AppProps {
  todos: TodoType[];
}

//? Filter types and functions
type FilterName = "All" | "Active" | "Completed";
type FilterFunction = (todo: TodoType) => boolean;

//? Map each filter to a function that filters the todo list accordingly
const FILTER_MAP: Record<FilterName, FilterFunction> = {
  All: () => true,
  Active: (todo) => !todo.completed,
  Completed: (todo) => todo.completed,
};

//? Extract the filter names from the filter map
const FILTER_NAMES = Object.keys(FILTER_MAP) as FilterName[];

//* Helper to calculate time difference in h:m:s format
function calculateTimeTaken(start: string, end: string): string {
  const diffMs = new Date(end).getTime() - new Date(start).getTime();
  const seconds = Math.floor((diffMs / 1000) % 60);
  const minutes = Math.floor((diffMs / 1000 / 60) % 60);
  const hours = Math.floor(diffMs / 1000 / 60 / 60);
  return `${hours}h ${minutes}m ${seconds}s`;
}

//* XP required for the next level
function getXpForNextLevel(level: number) {
  return 100 + level * 50;
}

// -----------------------------
// Component
// -----------------------------
export default function TodosCard({ todos: initialTodos }: AppProps) {
  //* State: full todo list
  const [todos, setTodos] = useState<TodoType[]>([
    {
      id: "todo-0",
      title: "Eat",
      xp: 10,
      completed: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      completedAt: new Date().toISOString(),
    },
    {
      id: "todo-1",
      title: "Sleep",
      xp: 20,
      completed: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "todo-2",
      title: "Repeat",
      xp: 40,
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ]);

  //? State to manage the current filter (All, Active, Completed)
  const [filter, setFilter] = useState<FilterName>("All");
  //? State to track the total XP earned from completed todos
  const [totalXp, setTotalXp] = useState<number>(0);
  //? State to store the current level based on XP
  const [level, setLevel] = useState<number>(1);
  //? State to track progress (in %) toward the next level
  const [xpProgress, setXpProgress] = useState<number>(0);

  //? useEffect to recalculate total XP every time todos change
  useEffect(() => {
    //* Filter completed todos and sum their XP
    const xpEarned = todos.filter((t) => t.completed).reduce((acc, t) => acc + t.xp, 0);
    //* Update the total XP state
    setTotalXp(xpEarned);
  }, [todos]); //* Re-run whenever `todos` array changes

  //? useEffect to calculate XP progress bar and user level
  useEffect(() => {
    //* Calculate XP earned from completed todos
    const earnedXp = todos.filter((t) => t.completed).reduce((acc, t) => acc + t.xp, 0);
    setTotalXp(earnedXp); //* Set total lifetime XP

    let currentLevel = 1;
    let remainingXp = earnedXp;

    //* Calculate current level by subtracting XP needed for each level
    while (remainingXp >= getXpForNextLevel(currentLevel)) {
      remainingXp -= getXpForNextLevel(currentLevel);
      currentLevel++;
    }

    setLevel(currentLevel); //* Update the current level

    //* Calculate XP progress toward next level
    const nextLevelXp = getXpForNextLevel(currentLevel);
    const progress = (remainingXp / nextLevelXp) * 100;
    setXpProgress(progress); //* Set progress as percentage
  }, [todos]); //* Re-run when todos change

  //* Function to toggle the completion status of a todo
  function toggleTodoCompleted(id: string) {
    //* Map through all todos to find the one to update
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        //* Toggle completion status
        const isNowCompleted = !todo.completed;
        //* Set completion timestamp if completed, else undefined
        const completedAt = isNowCompleted ? new Date().toISOString() : undefined;
        //* Calculate time taken if just completed
        const timeTaken = isNowCompleted && todo.createdAt
          ? calculateTimeTaken(todo.createdAt, completedAt!)
          : undefined;
        //* Return updated todo object
        const updated = {
          ...todo,
          completed: isNowCompleted,
          completedAt,
          timeTaken,
        };
        return updated; //* Return modified todo
      }
      return todo; //* Leave unchanged todos as is
    });
    //* Update todos state with modified array
    setTodos(updatedTodos);
  }

  //* Function to delete a todo by its ID
  function deleteTodo(id: string) {
    //* Filter out the todo with the matching ID
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  //* Function to edit the title of a specific todo
  function editTodo(id: string, newTitle: string) {
    //* Map through todos and update the matching one
    const updated = todos.map((todo) =>
      todo.id === id ? { ...todo, title: newTitle } : todo
    );
    //* Update state with edited list
    setTodos(updated);
  }

  //* Function to create a new todo item
  function createTodo(title: string) {
    //* Generate a random XP value between 0 and 99
    const randomXp = Math.floor(Math.random() * 100);
    //* Create a new todo object
    const newTodo: TodoType = {
      id: `todo-${nanoid()}`,            //* Unique ID using nanoid
      title,                             //* Title from input
      xp: randomXp,                      //* Random XP
      completed: false,                    //* Default to not completed
      createdAt: new Date().toISOString(), //* Current timestamp
    };
    //* Add the new todo to the current list
    setTodos([...todos, newTodo]);
  }

  //* Filter todos based on the selected filter (All, Active, Completed)
  const filteredTodos = todos.filter(FILTER_MAP[filter]);

  //* Map filtered todos into individual Todo components
  const todoList = filteredTodos.map((todo) => (
    <Todo
      key={todo.id}                         //* Unique key for React rendering
      id={todo.id}                          //* ID prop
      title={todo.title}                    //* Title prop
      xp={todo.xp}
      completed={todo.completed}            //* Completed status
      createdAt={todo.createdAt}            //* Creation timestamp
      completedAt={todo.completedAt}        //* Completion timestamp
      toggleTodoCompleted={toggleTodoCompleted} //* Handler to toggle
      deleteTodo={deleteTodo}              //* Handler to delete
      editTodo={editTodo}                  //* Handler to edit
    />
  ));

  //* Create filter buttons dynamically for each filter name
  const filterList = FILTER_NAMES.map((name) => (
    <ToggleGroup type="single" variant="outline" key={name}> {/* key moved here to avoid React warning */}
      <FilterButton
        key={name}                   //* Key still needed here for stable child identity
        name={name}                  //* Button label
        isPressed={filter === name}  //* Highlight selected filter
        setFilter={setFilter}        //* Handler to change filter
      />
    </ToggleGroup>
  ));

  //* Determine whether to use "todo" or "todo's" based on the count
  const todosNoun = todoList.length !== 1 ? "todo's" : "todo";

  //* Create heading text showing how many todos are remaining
  // const headingText = `${todoList.length} ${todosNoun} remaining`;

  return (
    <div className="todos-card-container border-3 m-4">
      <div className="todos-card-content p-4">
        <div className="flex items-center justify-between w-full">
          <span className="flex items-center">
            <h2 className="font-semibold">&#x1F4D4;	To-Do's App</h2>
        <Badge className="h-5 min-w-5 rounded-full px-1 mx-2 font-mono tabular-nums">
          {todoList.length}
        </Badge>
          </span>
          <span>
            <Dialog>
              <form>
                <DialogTrigger asChild>
                  <Button variant="outline">Create</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader className="text-left">
                    <DialogTitle>&#x1F3AF; Create a task</DialogTitle>
                    <DialogDescription>
                      Add a new task here. Click save when you&apos;re done.
                    </DialogDescription>
                  </DialogHeader>
                  {/* Create todo form */}
                  <Form createTodo={createTodo} />
                  <DialogFooter>
                    <DialogClose asChild>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
          </span>
        </div>
        <div className="flex items-center w-full mt-3">
          <span><Badge className="mb-3">Level {level}</Badge></span>
          <span className="w-full mx-2">
          <Progress value={xpProgress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-1">
            Progress: {Math.round((xpProgress / 100) * getXpForNextLevel(level))} / {getXpForNextLevel(level)} XP
          </p>
          <p className="text-xs text-muted-foreground">Total XP: {totalXp}</p>
          </span>
        </div>
        {/* Filter buttons */}
        <div className="flex items-center my-4">{filterList}</div>
        {/* Todo list */}
        <ul role="list" aria-labelledby="todo-remaining">
          {todoList}
        </ul>
      </div>
    </div>
  );
}