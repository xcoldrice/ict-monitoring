<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ListenRadarChannel extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'radartransfer:listen';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Listen to Radar Transfer';

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
        while (1) {
            (new \App\Models\Parsers\RadarTransfer())->process();
            sleep(5);
        }
    }
}
