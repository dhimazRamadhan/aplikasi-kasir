<?php

namespace App\Http\Controllers; 

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator; 
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function getUser()
    {
        $posts = User::get();
        return response()->json([
            'success' => true,
            'message' => 'List data user',
            'data'    => $posts,
            'count'   => count($posts)
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required',
            'role' => 'required',
            'username' => 'required',
            'password' => 'required|string|min:6'
        ]);
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }
        $post = User::create([
            'nama' => $request->get('nama'),
            'role' => $request->get('role'),
            'username' => $request->get('username'),
            'password' => Hash::make($request->get('password')),
        ]); 
        if ($post) {
            return response()->json([
                'status'  => true,
                'message' => 'Data User Berhasil Ditambahkan',
            ], 200);
        } else {
            return response()->json([
                'status'  => false,
                'message' => 'Data User Gagal Ditambahkan'
            ], 404);
        }
    }

    public function updateUser(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nama'     => 'required',
            'role'     => 'required',
            'username' => 'required',
            'password' => 'required|string|min:6'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson());
        }
        $post = User::where('id', $id)->update([
            'nama'      => $request->nama,
            'role'      => $request->role,
            'username'  => $request->username,
            'password'  => Hash::make($request->get('password'))
        ]);
        if ($post) {
            return response()->json([
                'status'  => true,
                'message' => 'Data User Berhasil Diperbarui',
                'data'    => $post
            ], 200);
        } else {
            return response()->json([
                'status'  => false,
                'message' => 'Data User Gagal Diperbarui'
            ], 404);
        }
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required',
            'role' => 'required',
            'username' => 'required',
            'password' => 'required|string|min:6'
        ]);
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }
        $user = User::create([
            'nama' => $request->get('nama'),
            'role' => $request->get('role'),
            'username' => $request->get('username'),
            'password' => Hash::make($request->get('password')),
        ]);
        $token = JWTAuth::fromUser($user);
        return response()->json(compact('user','token'),201); 
    }

    public function login(Request $request)
    {
        $credentials = $request->only('username','password');
        try {
            if(! $token = JWTAuth::attempt($credentials)){
                return response()->json([
                    'error' => 'Email Atau Password Salah'
                ], 400);
            }
        } catch (JWTException $e) {
            return response()->json([
                'error' => 'Gagal Membuat Token'
            , 500]);
        }
            $user = JWTAuth::user();
            return response()->json([
                'message' => 'Berhasil login',
                'token' => $token,
                'user' => $user
            ]);
    }

    public function getAuthenticatedUser() {
        try{
            if (! $user = JWTAuth::parseToken()->authenticate()) {
            return response()->json(['user_not_found'], 404);
            } 
        }
        catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['token_expired'], $e->getStatusCode()); }
        catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['token_invalid'], $e->getStatusCode()); }
        catch (Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['token_absent'], $e->getStatusCode());
        }
        return response()->json(compact('user')); 
    }

    public function destroy($id)
    {
        $post = DB::table('user')
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

    public function logout(Request $request)
    {
		if(JWTAuth::invalidate(JWTAuth::getToken())) {
			return response()->json(['message' => 'Berhasil Logout!']);
        } else {
            return response()->json(['message' => 'Gagal Logout !']);
        }
    }

    public function search(Request $request){
        $keyword = $request->input('keyword');
        $result = User::where('nama','LIKE','%'.$request->keyword.'%')
            ->orWhere('username','LIKE','%'.$request->keyword.'%')
            ->orWhere('role', $request->keyword)
            ->get();
        if(count($result)){
            return Response()->json(['data' => $result, 'count' => count($result)]);
        }else{
            return response()->json([
                'message' => 'Tidak Ada Data Yang Ditemukan'
            ], 404);
        }            
    }

    public function getKasir() {
        $post = User::where('role','kasir')
                ->get();
        return response()->json([
            'data' => $post
        ]);
    }
}

