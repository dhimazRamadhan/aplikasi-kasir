<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    use HasFactory;
    protected $table = 'transaksi';
    protected $primarykey = 'id';
    public $timestamps = false;
    protected $fillable = [
        'id', 'tgl_transaksi', 'id_user', 'id_meja', 'nama_pelanggan', 'status'
    ];

    public function user() : belongsTo
    {
        return $this->belongsTo(Transaksi::class, 'id_user', 'id');
    }

    public function transaksi() : hasMany
    {
        return $this->hasMany(detailTransaksi::class, 'id_transaksi', 'id');
    }
}
