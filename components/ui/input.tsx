import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "block w-full px-4 py-2 text-sm font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

export { Input };
