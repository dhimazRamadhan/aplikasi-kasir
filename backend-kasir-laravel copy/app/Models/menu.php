<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;
    protected $table = 'menu';
    protected $primarykey = 'id';
    public $timestamps = false;
    protected $fillable = [
        'id', 'nama', 'jenis', 'deskripsi', 'gambar', 'harga'
    ];

    /**
     * Get all of the comments for the menu
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function menu(): HasMany
    {
        return $this->hasMany(detailTransaksi::class, 'id_menu', 'id');
    }
}
