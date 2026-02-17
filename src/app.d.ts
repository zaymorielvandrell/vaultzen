import type { Session, User } from "better-auth";

declare global {
  namespace App {
    interface Locals {
      user?: User;
      session?: Session;
    }

    namespace Superforms {
      type Message = {
        type: "error" | "success";
        text: string;
      };
    }

    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
