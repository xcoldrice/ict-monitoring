<?php

namespace App\Models\Parsers;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WeatherStationParser extends Model
{
    use HasFactory;

    public $siteId;
    public $siteName;
    public $type;
    public $time;

    public function __construct($message) {
        $this->siteId    = $message->station_id;
        $this->siteName  = $message->location;
        $this->type      = $message->type;
        $this->time      = $message->unix * 1000;
    }
    
    public function process() {
        self::publish();
    }   

    private function publish () {

        $this->toPublish = [
            'siteId'   => $this->siteId,  
            'siteName' => $this->siteName,  
            'type'     => $this->type,  
            'time'     => $this->time,  
            'class'    => $this->type . "-" .$this->siteId,
        ];

        if($this->siteId != "0") {
            self::cacheEachSite();
            event(new \App\Events\PublishWeatherStation($this->toPublish));
        }
    }

    private function cacheEachSite() {
        $cachekey = $this->type .'-'. $this->siteId;

        \Cache::forever($cachekey,$this->toPublish);

    }


}
