
<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

Route::get('/linkstorage', function () {
  Artisan::call('storage:link');
});
