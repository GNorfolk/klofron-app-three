import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "./button"

export function Form<Inputs>({ children, onSubmit, styling }) {
  const methods = useForm<Inputs>();
  const { handleSubmit } = methods;

  return (
    <form className="space-y-6">
      <div className={styling}>
        {React.Children.map(children, child => {
          return child.props.name
            ? React.createElement(child.type, {
                ...{
                  ...child.props,
                  register: methods.register,
                  key: child.props.name
                }
              })
            : child;
        })}
      </div>
      <div className={"grid gap-4 sm:grid-cols-" + onSubmit.length}>
        {
          onSubmit.map(({ name, func }) => {
            return <Button type="submit" onClick={handleSubmit(func)} className="w-full">{name}</Button>
          })
        }
      </div>
    </form>
  );
}

export function Input({ register = null, name, defaultValue, ...rest }) {
  return <input defaultValue={defaultValue} {...register(name)} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1" {...rest} />;
}

export function Select({ children, register = null, name, ...rest }) {
  return (
    <div>
      <select {...register(name)} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1" {...rest}>
        {children}
      </select>
    </div>
  );
}
