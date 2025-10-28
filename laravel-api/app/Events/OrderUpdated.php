<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $order;
    public $action;

    public function __construct(Order $order, string $action)
    {
        $this->order = $order->load('orderItems.item');
        $this->action = $action;
    }

    public function broadcastOn()
    {
        return new Channel('orders'); // public channel
    }

    public function broadcastAs()
    {
        return 'order.updated';
    }

    public function broadcastWith()
    {
        return [
            'action' => $this->action,
            'order' => [
                'id' => $this->order->id,
                'status' => $this->order->status,
                'total_price' => $this->order->total_price,
                'user_id' => $this->order->user_id,
                'created_at' => $this->order->created_at,
                'updated_at' => $this->order->updated_at,
                'order_items' => $this->order->orderItems->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'item_id' => $item->item_id,
                        'quantity' => $item->quantity,
                        'price' => $item->price,
                        'item' => [
                            'id' => $item->item->id,
                            'name' => $item->item->name,
                            'price' => $item->item->price,
                            'photo_path' => $item->item->photo_path ?? null,
                        ],
                    ];
                }),
            ],
        ];
    }
}
