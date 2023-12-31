import React from 'react'
import axios from 'axios'
import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import {Button, Form} from 'react-bootstrap'
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
    CForm,
    CFormInput
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDinner, cilPencil, cilPeople, cilPlus, cilTrash, cilFilter,cilSearch } from '@coreui/icons'
import { check } from 'prettier';

export default class User extends React.Component {
    constructor() {
        super();
        this.state = {
            user : [],
            nama: "",
            username: "",
            role: "",
            password: "",
            action: "insert",
            token: "",
            checkRole : [],
            keyword: "",
            countUser: ""
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

    getUser = () => {
        axios.get(`http://localhost:8000/api/getUser`, this.headerConfig())
        .then(res => {
            this.setState({
                user: res.data.data,
                countUser: res.data.count
            })
        })
        .catch(err => {
            console.log(err.message)
        })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleClose = () => {
        this.setState({
            isModalOpen : false
        })
    }

    handleEdit = (item) => {
        this.setState({
            isModalOpen: true,
            id_user: item.id,
            nama: item.nama,
            username: item.username,
            password: item.password,
            role: item.role,
            action: "update",
        })
    }

    handleAdd = () => {
        this.setState({
            isModalOpen: true,
            nama: "",
            username: "",
            password: "",
            role: "",
            action: "insert",
        })
    }

    handleSave = (e) => {
        e.preventDefault()  
        let form = new FormData()
        form.append("nama", this.state.nama)
        form.append("username", this.state.username) 
        form.append("role", this.state.role) 
        form.append("password", this.state.password)  

        if(this.state.action == "insert") {
            axios.post(`http://localhost:8000/api/createUser`, form, this.headerConfig())
            .then(res => {
                this.getUser()
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
            axios.post(`http://localhost:8000/api/updateUser/`+this.state.id_user, form, this.headerConfig())
            .then(res => {
                this.getUser()
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
                axios.delete(`http://localhost:8000/api/deleteUser/`+ id, this.headerConfig())
                .then(res => {
                    this.getUser()
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

    handleSearch = (e) => {
        e.preventDefault()  
        let form = new FormData()
        form.append("keyword", this.state.keyword)
        axios.post(`http://localhost:8000/api/searchUser`,form, this.headerConfig())
        .then(res => {
            this.setState({
                user: res.data.data,
                countUser: res.data.count
            })
        })
        .catch(err => {
            // console.log(err.message)
        })
    }

    componentDidMount(){
        this.getUser()
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
                            Data User
                        </h4>
                        <div className="small text-medium-emphasis mb-5">{this.state.countUser} Data</div>
                    </CCol>
                    <CCol md="7">
                        <CButton className="btn btn-primary btn float-end" onClick={() => this.handleAdd()}><CIcon icon={cilPlus}/> Tambah Data </CButton>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol md="12">
                        {/* search button */}
                        <CForm onSubmit={(e) => this.handleSearch(e)}>
                            <CInputGroup>
                                <CFormInput type="text" placeholder="Cari Berdasarkan Nama / Username" name="keyword" onChange={this.handleChange} value={this.state.keyword}/> 
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
                                <CTableHeaderCell className="text-center">
                                    <CIcon icon={cilPeople} />
                                </CTableHeaderCell>
                                <CTableHeaderCell className="text-center" >ID User</CTableHeaderCell>
                                <CTableHeaderCell className="text-center">Nama</CTableHeaderCell>
                                <CTableHeaderCell className="text-center">Username</CTableHeaderCell>
                                <CTableHeaderCell className="text-center">Role</CTableHeaderCell>
                                <CTableHeaderCell className="text-center">Edit | Delete</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {this.state.user.map((item, index) => {
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
                                    <div>{item.username}</div>
                                </CTableDataCell>
                                <CTableDataCell className='text-center'>
                                    <div style={{textTransform: 'capitalize'}}>{item.role}</div>
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

            <Modal show={this.state.isModalOpen} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Form User</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={(e) => this.handleSave(e)}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label >Nama</Form.Label>
                            <Form.Control type="text" name="nama" placeholder="" value={this.state.nama} onChange={this.handleChange} required/>
                        </Form.Group> 
                        <Form.Group className="mb-3">
                            <Form.Label >Username</Form.Label>
                            <Form.Control type="text" name="username" placeholder="" value={this.state.username} onChange={this.handleChange} required/>
                        </Form.Group>  
                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select name="role" value={this.state.role} onChange={this.handleChange} required>
                                <option></option>
                                <option value={'admin'}>Admin</option>
                                <option value={'kasir'}>Kasir</option>
                                <option value={'manajer'}>Manajer</option>
                            </Form.Select>
                        </Form.Group>  
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" placeholder="" value={this.state.password} onChange={this.handleChange} required/>
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
