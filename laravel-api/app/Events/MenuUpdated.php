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
use Illuminate\Support\Facades\Log;

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
        return new Channel('menu');
    }

    // This gives the event a custom name when broadcasting
    // instead of App\Events\MenuUpdated your frontend will listen for "menu.updated"
    public function broadcastAs()
    {
        return 'menu.updated';
    }

    public function broadcastWith()
    {
        if (!$this->item) {
            return [
                'action' => $this->action,
                'item' => null,
            ];
        }

        // if item is array (like delete), use it directly
        if (is_array($this->item)) {
            return [
                'action' => $this->action,
                'item' => $this->item,
            ];
        }

        // if item is model (create/update), convert to array
        return [
            'action' => $this->action,
            'item' => [
                'id' => $this->item->id,
                'name' => $this->item->name,
                'price' => $this->item->price,
                'photo_path' => $this->item->photo_path ?? null,
                'is_available' => $this->item->is_available,
                'description' => $this->item->description,
                'category' => $this->item->category
            ],
        ];
    }
}
