<?php

namespace App\Http\Controllers;
use App\Models\menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class menuController extends Controller
{
    public function index()
    {
        $posts = menu::get();
        return response()->json([
            'success' => true,
            'message' => 'List data menu',
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

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required',
            'jenis' => 'required',
            'deskripsi' => 'required',
            'gambar' => 'required|image|mimes:png,jpg,jpeg',
            'harga' => 'required',
        ]);
        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }
        $post = Menu::create([
            'nama' => $request->nama,
            'jenis' => $request->jenis,
            'deskripsi' => $request->deskripsi,
            'gambar' => $request->file('gambar')->store('gambar-menu'),
            'harga' => $request->harga,
        ]);
        if ($post) {
            return response()->json([
                'success' => true,
                'message' => 'Data Menu Berhasil Ditambahkan',
                'data'    => $post
            ], 201);
        }
        return response()->json([
            'success' => false,
            'message' => 'Data Menu gagal ditambahkan'
        ]);
    }

    public function updateMenu(Request $request, $id)
    {    
        $validator = Validator::make($request->all(), [      
            'nama'      => 'required',
            'jenis'     => 'required',
            'deskripsi' => 'required',
            'gambar'    => 'required|image|mimes:png,jpg,jpeg',
            'harga'     => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        } 
        $get_item = DB::table('menu')
            ->where('id', $id)->first();
        if ($request->file('gambar')) {
            unlink('storage/'.$get_item->gambar);
        }    
        $post = menu::where('id', $id)->update([
            'nama'      => $request->nama,
            'jenis'     => $request->jenis, 
            'deskripsi' => $request->deskripsi,
            'gambar'    => $request->file('gambar')->store('gambar-menu'), 
            'harga'     => $request->harga
        ]);
        if ($post) {
            return response()->json([
                'status'  => true,
                'message' => 'Data Menu Berhasil Diperbarui',
            ], 200);
        } else {
            return response()->json([
                'status'  => false,
                'message' => 'Data Menu Gagal Diperbarui'
            ], 404);
        }
    }

    public function destroy($id)
    {
        $get_item = DB::table('menu')
            ->where('id', $id)->first();   
        $post = DB::table('menu')
            ->where('id', $id)->delete();
        if($post){
            unlink('storage/'.$get_item->gambar);
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

    public function search(Request $request){
        $keyword = $request->input('keyword');
        $result = Menu::where('nama','LIKE','%'.$request->keyword.'%')
            ->orWhere('deskripsi','LIKE','%'.$request->keyword.'%')
            ->get();
        if(count($result)){
            return Response()->json(['data' => $result,'count' => count($result)
        ]);
        }else{
            return response()->json([
                'message' => 'Tidak Ada Data Yang Ditemukan'
            ], 404);
        }            
    }
}
