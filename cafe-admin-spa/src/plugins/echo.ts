// connects your Vue frontend to Laravel real-time events using Pusher and Laravel Echo
import Echo from "laravel-echo";
import Pusher from "pusher-js";

(window as any).Pusher = Pusher;

const echo = new Echo({
  broadcaster: "pusher",
  key: "11b2f8b4b1424401d93c",
  cluster: "ap2",
  forceTLS: true,
  enabledTransports: ["ws", "wss"],
});

export default echo;
