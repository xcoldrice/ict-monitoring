<?php

namespace App\Models\Parsers;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use DB;
use \App\Models\Parsers\RadarParser;

class RadarTransfer extends Model
{
    use HasFactory;

    protected $radars;
	protected $db;
	protected $config;
	protected $env;

	public function __construct(){
		$this->env = \App::Environment();
		$this->config = config($this->env.'.app');
		$this->radars = $this->config['RADAR_EDGE_DATABASE'];

	}

	public function process() {
		// self::check('Mactan');
		// return;
    

		foreach ($this->radars as $key => $radar) {
			echo var_dump("Connecting to " . $radar . ".. . .");
			self::check($radar);
		}
	}

	private function check($radar){
		$inPostgres = ['Iloilo','Bohol','Mactan'];

		\Log::warning("RADAR_TRANSFER: ". $radar);
		try{
			$sql="SELECT Host,MAX(SourceFile) as File FROM TransferList WHERE State = 'Completed' and Host != '192.168.30.11' GROUP BY TargetDir,Password,Host ORDER BY Host";
			if(in_array($radar,$inPostgres)){
				$sql="SELECT host,max(sourcefile) as File FROM transferlist where state ='Success' and host != '192.168.30.11' GROUP BY password,host,targetdir";
			}
			$tag = DB::connection($radar)->select($sql);
			dd($tag);
			$srv = $this->config['FTP_ADDRESS'];
			foreach ($tag as $key => $value) {
				if(in_array($radar,$inPostgres)){
					if(!isset($srv[$value->host]))
						continue;
						
					$host = $srv[$value->host];
					$file = basename($value->file);
					
					$code = substr($file,4,3);

					if($code == 'BOH') $radar = 'Bohol';

				}else{
					if(!isset($srv[$value->Host]))
						continue;
					$host = $srv[$value->Host];
					$file = basename($value->File);
				}


				$data = [
					'radar' => strtolower($radar),
					'file' => $file,
					'type' => self::getType($file),
					'location' => strtolower($host),
					'category' => 'eec',
				];
				
            	(New RadarParser((object)$data))->process();
			}

		} catch (\PDOException $e) {
			var_dump($e->getMessage());
			echo var_dump("Unable to Connect : " . $radar);
		}

	}

	private function getType($file) {

		if(preg_match("/.uf/", $file))
			return "uf";
		if(preg_match("/.nc|.hdf/", $file))
			return "netcdf";
		if(preg_match("/.vol/", $file))
			return "vol";
		if(preg_match("/.png/", $file))
			return "img";
		if(preg_match("/.kmz/", $file))
			return "kml";

	}



}
