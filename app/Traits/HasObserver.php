<?php

namespace App\Traits;

trait HasObserver {

    public static function boot() {
        parent::boot();

        self::created(function($data) {
            event(new \App\Events\TriggerReload(true));

            dd($data);

            // event(new \App\Events\TriggerReload(true));
        });

        self::updated(function($data) { 
            event(new \App\Events\TriggerReload(true));

        });
    }
}

