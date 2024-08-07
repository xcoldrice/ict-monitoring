<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Redis;
use \App\Models\Parsers\RadarParser;

class ListenRadar extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'radar:listen';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Listen to Radar Channel';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        Redis::psubscribe(['RADAR'],function($message,$channel){

            var_dump($message);

            (new \App\Models\Parsers\RadarParser(json_decode($message)))->process();
            
        });
    }
}
