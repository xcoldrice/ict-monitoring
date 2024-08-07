<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Redis;
class ListenTemperature extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'temperature:listen';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

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
        Redis::psubscribe(['TEMP'],function($message,$channel){

            var_dump($message);

            (new \App\Models\Parsers\TemperatureParser(json_decode($message)))->process();
            
        });
    }
}
