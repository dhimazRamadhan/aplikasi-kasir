<?php

namespace App\Http\Controllers;
use App\Models\transaksi;
use App\Models\detailTransaksi;
use App\Models\menu;
use App\Models\meja;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class transaksiController extends Controller
{

    public function getDetail($id)
    {
        $posts = DB::table('detail_transaksi')
            ->where('id_transaksi', $id)
            ->join('menu','detail_transaksi.id_menu','=','menu.id')
            ->get();
            $total = DB::select("SELECT id_transaksi, SUM(subtotal) as 'total' from detail_transaksi WHERE id_transaksi = $id GROUP BY id_transaksi");
            $total_int = intval($total[0]->total);
            return response()->json([
            'success' => true,
            'count' => count($posts),
            'message' => 'List Data Detail Transaksi',
            'data' => $posts,
            'total' => $total_int
        ], 200);
    }
    
    public function index()
    {
        $posts = transaksi::join('user','user.id','=','transaksi.id_user')
        ->get();
        return response()->json([
            'success' => true,
            'count' => count($posts),
            'message' => 'List Data Transaksi',
            'data' => $posts,
            'count'   => count($posts)
        ], 200);
    }

    public function getByKasir($id)
    {
        $post = DB::table('transaksi')
            ->select('transaksi.*','user.id as userId','user.nama')
            ->where('id_user',$id)
            ->join('user','transaksi.id_user','=','user.id')
            ->get();
        return response()->json([
            'success' => true,
            'message' => 'Data Transaksi',
            'data'    => $post,
            'count'   => count($post)
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_user' => 'required',
            'id_meja' => 'required',
            'nama_pelanggan' => 'required',       
        ]);
        //get status meja
        $get_meja = DB::table('meja')->where('id', $request->id_meja)->get(); //cek status meja
        // print_r($get_meja);

        // get status meja
        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        } 
        else if ($get_meja[0]->status == 'Terisi'){
            return response()->json(['success' => false, 'message' => 'Meja Tidak Tersedia']);
            exit;
        }

        $update_meja = meja::where('id', $request->id_meja)->update([
            'status' => 'Terisi'
        ]);

        $transaksi = new transaksi();
		$transaksi->tgl_transaksi = now()->format('Y-m-d');
        $transaksi->id_user = $request->id_user;
        $transaksi->id_meja = $request->id_meja;
        $transaksi->nama_pelanggan = $request->nama_pelanggan;
        $transaksi->status = "belum_bayar";
		$transaksi->save();
        
        for($i = 0; $i < count($request->detail); $i++){
            $detail_transaksi = new detailTransaksi();
            $detail_transaksi->id_transaksi = $transaksi->id;
            $detail_transaksi->id_menu = $request->detail[$i]['id_menu'];
            $detail_transaksi->qty = $request->detail[$i]['qty'];
            $menu = Menu::where('id', '=', $detail_transaksi->id_menu)->first();
            $harga = $menu->harga;
            $detail_transaksi->subtotal = $request->detail[$i]['qty'] * $harga;
            $detail_transaksi->save();
        }
        $detail = detailTransaksi::where('id_transaksi', '=', $detail_transaksi->id_transaksi)->get();
        return response()->json([
            'data' => $transaksi,
            'detail lengkap' => $detail,
        ]);
    }

    public function Pembayaran(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'tunai' => 'required',    
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson());
        }
        $total = DB::select("SELECT id_transaksi, SUM(subtotal) as 'total' from detail_transaksi WHERE id_transaksi = $id GROUP BY id_transaksi");
        $total_akhir = intval($total[0]->total);
        // print_r($total);
        $kembali = $request->tunai - $total_akhir;

        if ($request->tunai < $total_akhir) {
            return response()->json(['success' => false, 'message' => 'Tunai kurang']);
            exit;
        }

        $update_bayar = transaksi::where('id', $id)->update([
            'status' => 'lunas'
        ]);

        $get_meja = DB::table('transaksi')->where('id', $id)->get(); //get status meja

        $update_meja = meja::where('id', $get_meja[0]->id_meja)->update([
            'status' => 'Kosong'
        ]);

        return response()->json([
            'message' => 'Pembayaran berhasil',
            'Total' => $total_akhir,
            'Tunai' => $request->tunai,
            'Kembali' => $kembali
        ]); 
    }

    public function filterTransaksiTgl(Request $request) {
        $validator = Validator::make($request->all(), [
            'start' => 'required',
            'end' => 'required',       
        ]);
        $post = Transaksi::whereBetween('tgl_transaksi', [$request->start, $request->end])
            ->get();
        return response()->json([
            'data' => $post
        ]);
    }

    public function filterTransaksiNama(Request $request) {
        $validator = Validator::make($request->all(), [
            'param' => 'required'            
        ]);
        $post = Transaksi::where('nama_pelanggan','like', '%'.$request->param.'%')
        // $post = Transaksi::where('id_user', $request->param)
                ->orWhere('id_user', $request->param)
                ->get();
        return response()->json([
            'data' => $post
        ]);
    }

    public function filterTransaksiKasir(Request $request) {
        $validator = Validator::make($request->all(), [
            'param' => 'required'            
        ]);
        $post = Transaksi::where('id_user', $request->param)
                ->get();
        return response()->json([
            'data' => $post
        ]);
    }
}
