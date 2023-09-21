import React from 'react'
import axios from 'axios'
import {Button, Form, InputGroup} from 'react-bootstrap'
import Swal from 'sweetalert2'

import {
    CAvatar,
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CInputGroup,
    CProgress,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CInputGroupText,
    CFormInput,
    CForm
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilFilter, cilPencil, cilPizza, cilPlus, cilSearch, cilTrash } from '@coreui/icons'
import Modal from 'react-bootstrap/Modal';

export default class Menu extends React.Component {
    constructor() {
        super();
        this.state = {
            menu : [],
            isModalOpen: false,
            nama: "",
            jenis: "",
            deskripsi: "",
            gambar: null,
            harga: "",
            action: "insert",
            token: "",
            check: [],
            keyword: "",
            countMenu: ""
        }
        if (localStorage.getItem("role") != 'admin') {
            Swal.fire({
                title: 'Izin Ditolak!',
                html: 'Maaf Hanya Role Admin Yang Bisa Mengakses Menu Ini',
                icon: 'error'
            })
            window.location = '/#/dashboard'
        }
        if (localStorage.getItem("token")) {
            this.state.token = localStorage.getItem("token")
        } 
        else {
            window.location = "/#/login"
        }
    }

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    getMenu = () => {
        axios.get(`http://localhost:8000/api/menu`, this.headerConfig())
        .then(res => {
            this.setState({
                menu: res.data.data,
                countMenu: res.data.count
            })
        })
        .catch(err => {
            console.log(err.message)
        })
    }

    handleSearch = (e) => {
        e.preventDefault()  
        let form = new FormData()
        form.append("keyword", this.state.keyword)
        axios.post(`http://localhost:8000/api/searchMenu`,form, this.headerConfig())
        .then(res => {
            this.setState({
                menu: res.data.data,
                countMenu: res.data.count
            })
        })
        .catch(err => {
            // console.log(err.message)
        })
    }

    handleClose = () => {
        this.setState({
            isModalOpen : false
        })
    }

    handleFile = (e) => {
        this.setState({
            gambar: e.target.files[0]
        })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleEdit = (item) => {
        this.setState({
            isModalOpen : true,
            id_menu: item.id,
            nama: item.nama ,
            jenis: item.jenis,
            deskripsi: item.deskripsi,
            gambar: item.gambar,
            harga: item.harga,
            action : "update",
        })
    } 

    handleAdd = () => {
        this.setState({
            isModalOpen : true,
            nama: "",
            jenis: "",
            deskripsi: "",
            gambar: null,
            harga: "",
            action : "insert"
        })
    }

    handleSave = (e) => {
        e.preventDefault()  
        let form = new FormData()
        form.append("nama", this.state.nama)
        form.append("jenis", this.state.jenis) 
        form.append("deskripsi", this.state.deskripsi) 
        form.append("gambar", this.state.gambar) 
        form.append("harga", this.state.harga) 

        if(this.state.action == "insert") {
            axios.post(`http://localhost:8000/api/menu`, form, this.headerConfig())
            .then(res => {
                console.log('pppp')
                this.getMenu()
                this.handleClose()
                Swal.fire({
                    title: 'Berhasil !',
                    html: res.data.message,
                    icon: 'success'
                })
            })
            .catch(err => {
                console.log(err.message)
            })
        }

        else if(this.state.action == "update"){
            axios.post(`http://localhost:8000/api/menu/`+this.state.id_menu, form, this.headerConfig())
            .then(res => {
                this.getMenu()
                this.handleClose()
                Swal.fire({
                    title: 'Berhasil !',
                    html: res.data.message,
                    icon: 'success'
                })
            })
            .catch(err => {
                console.log(err.message)
            })
        }
    }

    handleDrop = (id) => {
        Swal.fire({
            title: 'Apakah anda yakin ingin menghapus data ini ?',
            text: 'Anda tidak bisa mengembalikan data yang dihapus !',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Iya',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if(result.isConfirmed){
                axios.delete(`http://localhost:8000/api/menu/`+ id, this.headerConfig())
                .then(res => {
                    this.getMenu()
                    Swal.fire({
                        title: 'Berhasil !',
                        html: res.data.message,
                        icon: 'success'
                    })
                })
                .catch(err => {
                    console.log(err.message)
                })
            }
        }) 
    }

    componentDidMount(){
        this.getMenu()
    }

    render(){
        return (         
            <CRow>
                <CCol xs>
                    <CCard className="mb-4">
                        <CCardBody>                   
                            <CRow>
                                <CCol md="5">
                                    <h4 id="traffic" className="card-title mb-0">
                                        Data Menu
                                    </h4>
                                    <div className="small text-medium-emphasis mb-5">{this.state.countMenu} Data</div>
                                </CCol>
                                <CCol md="7">
                                    <CButton className="btn btn-primary btn float-end" onClick={() => this.handleAdd()}>Tambah Data <CIcon icon={cilPlus}/></CButton>
                                </CCol>
                            </CRow>
                            <CRow>                           
                                <CCol md="12">
                                    {/* search button */}
                                    <CForm onSubmit={(e) => this.handleSearch(e)}>
                                        <CInputGroup>
                                            <CFormInput type="text" placeholder="Cari Berdasarkan Nama / Deskripsi" name="keyword" onChange={this.handleChange} value={this.state.keyword}/> 
                                            <CButton type='submit' className='btn border border-secondary' style={{backgroundColor:"transparent"}}>
                                                <CIcon icon={cilSearch} className="light" style={{color:'black'}}/>
                                            </CButton>
                                        </CInputGroup>
                                    </CForm>
                                </CCol>
                            </CRow>
                            <CRow className='mt-4'>
                                <CTable align="middle" className="mb-0 border" hover responsive>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell className="text-center" style={{width: "50px"}}>
                                            <CIcon icon={cilPizza} />
                                            </CTableHeaderCell>
                                            <CTableHeaderCell className="text-center">ID</CTableHeaderCell>
                                            <CTableHeaderCell className="text-center">Nama</CTableHeaderCell>
                                            <CTableHeaderCell className="text-center">Jenis</CTableHeaderCell>
                                            <CTableHeaderCell className="text-center">Deskripsi</CTableHeaderCell>
                                            <CTableHeaderCell className="text-center">Gambar</CTableHeaderCell>
                                            <CTableHeaderCell className="text-center">Harga</CTableHeaderCell>
                                            <CTableHeaderCell className="text-center">Edit | Delete</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {this.state.menu.map((item, index) => {
                                            return(
                                            <CTableRow key={index}>   
                                            <CTableDataCell className='text-center'>
                                                <div>#</div>
                                            </CTableDataCell>                               
                                            <CTableDataCell className='text-center'>
                                                <div>{item.id}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className='text-center'>
                                                <div>{item.nama}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className='text-center'>
                                                <div style={{textTransform: "capitalize"}}>{item.jenis}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className='text-center' style={{width: "300px"}}>
                                                <div>{item.deskripsi}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className='text-center'>
                                                <div><img src={`http://localhost:8000/storage/${item.gambar}`} width='150px'/> </div>
                                            </CTableDataCell>
                                            <CTableDataCell className='text-center'>
                                                <div>Rp.{item.harga}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className='text-center'>
                                                <div className='text-center'>
                                                    <CButton className='border border-0' onClick={() => this.handleEdit(item)}  style={{backgroundColor:"transparent"}}>
                                                        <CIcon icon={cilPencil} className='sm' style={{color:"blue"}} size={'lg'}/> 
                                                    </CButton>
                                                    <CButton className='border border-0' onClick={() => this.handleDrop(item.id)} style={{backgroundColor:"transparent"}}>
                                                        <CIcon icon={cilTrash} style={{color:"red"}} size={'lg'}/>
                                                    </CButton>
                                                </div>
                                            </CTableDataCell>
                                        </CTableRow>
                                        )
                                        })}                         
                                    </CTableBody>
                                </CTable>
                            </CRow>
                            <br />
                        </CCardBody>
                    </CCard>
                </CCol>

                 {/* iki modal */}
                <Modal show={this.state.isModalOpen} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Form Data Menu</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={(e) => this.handleSave(e)}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label >Nama Menu</Form.Label>
                            <Form.Control type="text" name="nama" placeholder="" value={this.state.nama} onChange={this.handleChange} required/>
                        </Form.Group>  
                        <Form.Group className="mb-3">
                            <Form.Label>Jenis</Form.Label>
                            <Form.Select name="jenis" value={this.state.jenis} onChange={this.handleChange} required>
                                <option></option>
                                <option value={'makanan'}>Makanan</option>
                                <option value={'minuman'}>Minuman</option>
                            </Form.Select>
                        </Form.Group>  
                        <Form.Group className="mb-3">
                            <Form.Label>Deskripsi</Form.Label>
                            <Form.Control type="text" name="deskripsi" placeholder="" value={this.state.deskripsi} onChange={this.handleChange} required/>
                        </Form.Group>   
                        <Form.Group className="mb-3">
                            <Form.Label>Gambar</Form.Label>
                            <Form.Control type="file" placeholder="" name='gambar' onChange={this.handleFile} required/>
                        </Form.Group> 
                        <Form.Group className="mb-3">
                            <Form.Label>Harga</Form.Label>
                            <Form.Control type="text" name="harga" placeholder="" value={this.state.harga} onChange={this.handleChange} required/>
                        </Form.Group> 
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                        Close
                        </Button>
                        <Button variant="primary" type="submit">
                        Save
                        </Button>
                    </Modal.Footer>
                    </Form>
                </Modal>
            </CRow>
        )
    }
}