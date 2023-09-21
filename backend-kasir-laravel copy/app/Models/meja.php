<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meja extends Model
{
    use HasFactory;
    protected $table = 'meja';
    protected $primarykey = 'id';
    public $timestamps = false;
    protected $fillable = [
        'id', 'nomer'
    ];

    public function meja(): HasMany
    {
        return $this->hasMany(transaksi::class, 'id_meja', 'id');
    }
}
