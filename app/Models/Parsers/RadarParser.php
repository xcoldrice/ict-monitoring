<?php

namespace App\Models\Parsers;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class RadarParser extends Model
{
    use HasFactory;


    public $location;
	public $radar;
	public $type;
	public $file;
	public $category;
	public $unix;
	public $config;
	public $key;
	public $dataToCache;

	public function __construct($message){


		$this->location  = $message->location;
		$this->radar 	 = $message->radar;
		$this->type 	 = $message->type;
		$this->file 	 = $message->file;
		$this->category  = $message->category ?? false;
		$this->config    = config(\App::Environment().'.radars');
		self::getRadarCategory();
    }
    
    public function process() {
        if(Str::contains($this->file, "QuezonPalawan")) {
            return;
        }

		if($this->file != "" && $this->category) {
			$this->getTimeFromFile();

			$this->key = $this->radar . '-' . $this->category . '-' . $this->location. '-' . $this->type;
			
			$this->dataToCache = [
						'name' 		=> $this->radar,
						'type'      => $this->type,
						'recipient' => $this->location,
						'file'      => $this->file,
						'time'      => $this->unix * 1000,
						'category'  => $this->category,
						'class'     => $this->radar .'-'.$this->category .'-'. $this->location . '-' . $this->type,
			];

			event(new \App\Events\PublishRadar($this->dataToCache));

            if($this->location == "dic" && !in_array($this->type, ['netcdf', 'img', 'kml'])) {
                var_dump($this->type, date("F j, Y g:i a", $this->unix));
                // var_dump($this->dataToCache);
            }

			self::cacheData();

		}
	}

	private function getTimeFromFile() {
		$fourDigits = ['iloilo','bohol','mactan', 'tagaytay'];

		$date_format = 'YmdHi';
		$date_offset = 28800;
		$date_string = preg_replace('/[^0-9]/s','',$this->file);
		if($this->type == 'com') $this->type = 'cappi';

		if($this->type == 'kml'){
			$this->unix = (int)explode("_",$this->file)[3];
			return;
		}



		if($this->type == "cappi"  || $this->category == 'jrc') {
			$date_offset = 0;
		}

        if($this->type == "cmax" || $this->type == "hybrid") {
            $date_offset = 43200;
        }


		if($this->type != "cappi" && $this->type != "cmax" && $this->type != "hybrid") {
			if($this->category == 'jrc') {
				$date_string = substr($date_string,17,12);
			}elseif($this->category == 'eec') {
				if(in_array($this->radar,$fourDigits)) {
					$date_string = substr($date_string,4,12);
				}else{
					$date_string = substr($date_string,0,12);
				}
			}elseif($this->category == 'selex') {
				
				if ($this->radar == "baguio" || $this->radar == "baler" || $this->radar == 'daet') {
					$date_string = substr($date_string, 0,12);
				}else{
					$date_string = $this->type == "netcdf" ? "20" . substr($date_string,2,10) : "20" . substr($date_string,0,10);
				}


			}elseif($this->category == 'vaisala') {
				if($this->type == 'netcdf') {
					$date_string = "20".substr($date_string,2,12);
				}elseif($this->type == 'img'){
					$date_string = "20".substr($date_string,1,12);
                }else {
					$date_string = "20".substr($date_string,0,12);
				}
			}
		}

        if($this->type == 'cmax' || $this->type == "hybrid") {
            $date_string = substr($date_string,0,12);

            // $date_string = substr($date_string,1,12);
        }


		$dateandtime = date_create_from_format($date_format,substr($date_string,0,12))->format(DATE_ATOM);
        
		$this->unix  = (strtotime($dateandtime) + $date_offset);
	}

	private function getRadarCategory() {
		if(!$this->category) {
			foreach($this->config as $key => $value) {
				if(in_array($this->radar,$value['radars'])) {
					$this->category = $key;
					return;
				}
			}
		}
	}    

	private function cacheData() {
		$cacheKey = $this->radar.'-'.$this->category;	
		$data = \Cache::get($cacheKey) ?? [];
		if(!empty($data)) {
			if(isset($data[$this->location])) {
				$key = array_search($this->type,array_column($data[$this->location],'type'));
				if(gettype($key) == 'integer' && $data[$this->location][$key]) {
					$data[$this->location][$key] = $this->dataToCache;
				}else{
					$data[$this->location][] = $this->dataToCache;
				}
			}else {
				$data[$this->location][] = $this->dataToCache;
			}
		}else {
			$data[$this->location][] = $this->dataToCache;
		}
		\Cache::forever($cacheKey,$data);
	}

}
