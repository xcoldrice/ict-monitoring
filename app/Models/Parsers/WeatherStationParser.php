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
        $this->type    = $message->station_id;
        $this->file    = $message->location;
        $this->station = $message->type;
        $this->time    = $message->unix * 1000;
    }
    
    public function process() {
        self::publish();
    }   

    private function publish () {

        $this->toPublish = [
                        'category' => $this->station,  
                        'file'     => $this->file,  
                        'type'     => $this->type,  
                        'time'     => $this->time,  
        ];

        if($this->type != "0") {
            self::cacheData();
            event(new \App\Events\PublishWeatherStation( $this->toPublish));
        }
    }

    private function cacheData() {
        $cachekey = 'weather-station-data';

        $data = \Cache::get($cachekey) ?? [];

        if(!empty($data)) {
            $key = array_search($this->type, array_column($data,'type'));
            if(gettype($key) == 'integer' && $data[$key]) {
                $data[$key] = $this->toPublish;
            }else{
                $data[] =  $this->toPublish;
            }
        }else {
            $data[] =  $this->toPublish;
        }
        \Cache::forever($cachekey, $data);
    }

}
