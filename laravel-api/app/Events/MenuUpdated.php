<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// MenuUpdated::dispatch("updated", $item) => Notify all clients in real-time
class MenuUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    // public variables you want to send to the frontend
    public $action; // 'created', 'updated', 'deleted'
    public $item;

    // the constructor runs when you create the event
    /**
     * Create a new event instance.
     */
    public function __construct(string $action, $item = null)
    {
        $this->action = $action;
        $this->item = $item;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        return new Channel('menu-channel');
    }

    // This gives the event a custom name when broadcasting
    // instead of App\Events\MenuUpdated your frontend will listen for "menu.updated"
    public function broadcastAs()
    {
        return 'menu.updated';
    }
}
