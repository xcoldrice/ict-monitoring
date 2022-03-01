<?php

namespace App\Models\Parsers;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RadarParser extends Model
{
    use HasFactory;


    public $location;
	public $radar;
	public $type;
	public $file;
	public $key;
	public $radars;
	public $interval;
	public $threshold;
	public $unix;
	public $rType;

	public function __construct($message){

        var_dump($message);


		// $this->location  = $message->location;
		// $this->radar 	 = $message->radar;
		// $this->type 	 = $message->type;
		// $this->file 	 = $message->file;
		// $this->key 		 = $message->radar . "-" . $message->location . "-" . $message->type;

		// self::getRadarConfig();
		// self::selectRadar();

    }
    
    // public function process() {
	// 	// return $this;
	// 	self::getTimeFromFile();
	// 	$return = [
	// 			'key'        => $this->key,
	// 			'file' 		 => $this->file,
	// 			'unix'       => $this->unix,
	// 	];
		
	// 		\Cache::forever($this->key, $return);
	// 		event(new \App\Events\PublishRadar($return));
	// }

	// public function getTimeFromFile() {

	// 	$date_format = 'YmdHi';
	// 	$date_offset = 28800;
	// 	$date_string = preg_replace('/[^0-9]/s','',$this->file);

	// 	if($this->type == 'com') {
	// 		$this->type = 'cappi';
	// 	}

	// 	if($this->type == 'kml'){
	// 		$this->unix = (int)explode("_",$this->file)[2];
	// 		return;
	// 	}
	// 	if($this->type == "cappi" || $this->type == "cmax") {
	// 		$date_offset = 0;
	// 	}
	// 	if($this->type != "cappi" && $this->type != "cmax") {
	// 		if($this->rType == 'jrc') {
	// 			$date_offset = 0;
	// 			$date_string = substr($date_string,17,12);
	// 		}elseif($this->rType == 'rainbow') {
	// 			if ($this->radar == "baguio" || $this->radar == "baler") {
	// 				$date_string = substr($date_string, 0,12);
	// 			}else{
	// 				$date_string = $this->type == "netcdf" ? "20" . substr($date_string,2,10) : "20" . substr($date_string,0,10);
	// 			}
	// 		}elseif($this->rType == 'edge') {
	// 			if($this->radar == 'iloilo' || $this->radar == 'bohol') {
	// 				$date_string = substr($date_string,4,12);
	// 			}else{
	// 				$date_string = substr($date_string,0,12);
	// 			}
	// 		}

	// 	}

	// 	$dateandtime = date_create_from_format($date_format,substr($date_string,0,12))->format(DATE_ATOM);
	// 	$this->unix  = strtotime($dateandtime) + $date_offset;
	// }


	// public function selectRadar(){
	// 	foreach($this->radars as $key => $radar) {
	// 		if(in_array($this->radar,$radar['radars'])) {
	// 			$this->key = $this->key . '-' . $key;
	// 			$this->interval = $radar['interval'];
	// 			$this->threshold = $radar['threshold'];
	// 			$this->rType = $key;
	// 		}
	// 	}
	// }

	// public function getRadarConfig() {
	// 	$config  	 = config('radar.radars');
	// 	$this->radars = [
	// 						'edge'     => $config['edge'],
	// 						'jrc'  	   => $config['jrc'],
	// 						'rainbow'  => $config['rainbow'],
	// 						'mosaic'   => $config['mosaic'],
	// 	];
	// }




    
}
