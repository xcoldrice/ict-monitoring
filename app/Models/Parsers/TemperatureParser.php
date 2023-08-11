<?php

namespace App\Models\Parsers;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TemperatureParser extends Model {
    use HasFactory;

    public $room;
    public $datetime;
    public $temperature;
    public $humidity;

    public function __construct(Object $message){
        $this->room = $message->name;
        $this->datetime = $message->datetime;
        $this->temperature = $message->temperature;
        $this->humidity = $message->humidity;
    }

    public function process() {
        $temperatures = [];

        if(\Cache::has('temperatures')) {
            $temperatures = \Cache::get('temperatures');
        }

        $data = [
            'room'        => $this->room,
            'datetime'    => $this->datetime,
            'humidity'    => $this->humidity,
            'temperature' => $this->temperature,
        ];

        $temperatures[$this->room] = $data;
        
        \Cache::forever('temperatures', $temperatures);

        event(new \App\Events\PublishTemperature($data));
    }
}