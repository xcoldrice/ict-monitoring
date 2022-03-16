<?php

namespace App\Models\Parsers;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WeatherStationParser extends Model
{
    use HasFactory;

    public $type;
    public $file;
    public $station;
    public $time;

    public function __construct($message) {
        $this->type = $message->station_id;
        $this->file = $message->location;
        $this->station = $message->type;
        $this->time = $message->unix * 1000;
    }
    
    public function process() {
        self::publish();
    }   

    private function publish () {

        $toPublish = [
                        'station'=>$this->station,  
                        'file'=>$this->file,  
                        'type'=>$this->type,  
                        'time'=>$this->time,  
        ];
        event(new \App\Events\PublishWeatherStation($toPublish));
    }
}
