import { dev } from "$app/environment";

export const delay = () => {
  if (!dev) {
    return Promise.resolve();
  }

  return new Promise((resolve) => setTimeout(resolve, 2000));
};
