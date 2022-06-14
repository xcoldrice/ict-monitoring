<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
class DashboardController extends Controller
{
    public function index() {

        $userName = Auth::user()->name?? "Guest";
        return view('react', compact('userName'));
    }
}
