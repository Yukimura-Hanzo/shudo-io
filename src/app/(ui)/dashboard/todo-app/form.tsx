"use client";

//? REACT MODULES
import React, { ChangeEvent, FormEvent, useState } from "react";
//? SHADCN UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//? TS Types
type FormProps = {
  createTodo: (todoText: string) => void;
};

function Form({ createTodo }: FormProps) {

  //? State VAR - store value of the input field
  const [title, setTitle] = useState<string>("");

  //? FUNCTION - to handle input changes
  //* when user types into input field
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    //? Optional debug: Log the current value of the input field
    //* console.log(e.target.value);
    //* Update the `title` state with the current input value
    setTitle(e.target.value);
  }

  //? FUNCTION - to handle form submission
  //* triggered when form submitted
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    //* prevent default form submission behaviour
    e.preventDefault();
    //* call `createTodo` function passed in props with current `title`
    createTodo(title);
    //* clear input field by resetting `title` to empty string
    setTitle("");
  }

  return (
    //? Form element w/ onSubmit handler
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center gap-2">
      <div className="grid w-full max-w-sm items-center gap-3">
        {/* label associated w/ input field cia `htmlFor` */}
        {/* <Label htmlFor="create-todo-input">Add a new task</Label> */}
        <div className="flex w-full max-w-sm items-center gap-2">
          {/* controlelled input field: value bound to `name`, changes handled by handleChange */}
          <Input 
            type="text"                   //? Set input type to text
            id="create-todo-input"        //? ID used to link the label
            name="text"                   //? Name used in form submission
            autoComplete="off"            //? Disable browser autocomplete
            value={title}                 //? Bind input value to state variable
            placeholder="Start creating"  //? Placeholder for input
            onChange={handleChange}       //? Call handleChange on user input
          />
          {/* submit button */}
          <Button type="submit" variant="default">Create</Button>
        </div>
      </div>
    </form>
  );
}

export default Form;