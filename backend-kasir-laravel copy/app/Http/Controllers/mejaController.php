<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\meja;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class mejaController extends Controller
{
    public function index()
    {
        $posts = Meja::get();
        return response()->json([
            'success' => true,
            'message' => 'List data meja',
            'data'    => $posts,
            'count'   => count($posts)
        ], 200);
    }

    public function show($id)
    {
        $post = DB::table('meja')
            ->where('id',$id)->get();
        return response()->json([
            'success' => true,
            'message' => 'Data meja',
            'data'    => $post
        ], 200);
    }

    public function statusKosong()
    {
        $post = DB::table('meja')
            ->where('status', 'Kosong')->get();
        return response()->json([
            'success' => true,
            'message' => 'Data meja',
            'data'    => $post
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nomer' => 'required'
        ]);
        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }
        $post = Meja::create([
            'nomer' => $request->nomer
        ]);
        if ($post) {
            return response()->json([
                'success' => true,
                'message' => 'Data Meja Berhasil Ditambahkan',
                'data'    => $post
            ], 201);
        }
        return response()->json([
            'success' => false,
            'message' => 'Data gagal ditambahkan'
        ]);
    }

    public function updateMeja(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nomer'      => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson());
        }
        $post = Meja::where('id', $id)->update([
            'nomer'    => $request->nomer
        ]);
        if ($post) {
            return response()->json([
                'status'  => true,
                'message' => 'Data Meja Berhasil Diperbarui',
            ], 200);
        } else {
            return response()->json([
                'status'  => false,
                'message' => 'Data Meja Gagal Diperbarui'
            ], 404);
        }
    }

    public function destroy($id)
    {
        $post = DB::table('meja')
            ->where('id', $id)->delete();
        if($post){
            return response()->json([
                'success' => true,
                'message' => 'Data berhasil dihapus'
            ], 200);
        }
        //data post tidak ditemukan
        return response()->json([
            'success' => false,
            'message' => 'Data tidak ditemukan'
        ]);
    }
}
