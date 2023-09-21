<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailTransaksi extends Model
{
    use HasFactory;
    protected $table = 'detail_transaksi';
    protected $primarykey = 'id';
    public $timestamps = false;
    protected $fillable = [
        'id', 'id_transaksi', 'id_menu', 'harga', 'qty', 'subtotal'
    ];
    // protected $guarded = ['id'];
    
    public function transaksi() : belongsTo 
    {
        return $this->belongsTo(detailTransaksi::class, 'id_transaksi', 'id');
    }

    public function menu() : belongsTo
    {
        return $this->belongsTo(detailTransaksi::class, 'id_menu', 'id');
    }

}
