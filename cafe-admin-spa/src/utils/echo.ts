import Echo from "laravel-echo";
import Pusher from "pusher-js";

(window as any).Pusher = Pusher;

export const echo = new Echo({
  broadcaster: "pusher",
  key: "11b2f8b4b1424401d93c",
  cluster: "ap2",
  forceTLS: true,
});
