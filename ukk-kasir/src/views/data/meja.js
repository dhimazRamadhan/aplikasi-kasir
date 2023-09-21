import React from 'react'
import axios from 'axios'
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDinner, cilPencil, cilTrash, cilPlus } from '@coreui/icons'
import Modal from 'react-bootstrap/Modal';
import { check } from 'prettier'

export default class Meja extends React.Component {
    constructor() {
        super();
        this.state = {
            meja : [],
            isModalOpen: false,
            nomer: "",
            status: "",
            action: "insert",
            token: "",
            check:[],
            countMeja: ""
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

    getMeja = () => {
        axios.get(`http://localhost:8000/api/meja`, this.headerConfig())
        .then(res => {
            this.setState({
                meja: res.data.data,
                countMeja: res.data.count
            })
        })
        .catch(err => {
            console.log(err.message)
        })
    }
    
    handleClose = () => {
        this.setState({
            isModalOpen : false
        })
    }
    
    handleAdd = () => {
        this.setState({
            isModalOpen: true,
            nomer: "",
            status: "",
            action: "insert",
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
            id_meja: item.id,
            nomer: item.nomer,
            status: item.status,
            action: "update"
        })
    } 

    handleSave = (e) => {
        e.preventDefault()  
        let form = new FormData()
        form.append("nomer", this.state.nomer) 

        if(this.state.action == "insert") {
            axios.post(`http://localhost:8000/api/meja`, form, this.headerConfig())
            .then(res => {
                this.getMeja()
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
            axios.post(`http://localhost:8000/api/meja/`+this.state.id_meja, form, this.headerConfig())
            .then(res => {
                this.getMeja()
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
                axios.delete(`http://localhost:8000/api/meja/`+ id, this.headerConfig())
                .then(res => {
                    this.getMeja()
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
        // this.checkUser()
        this.getMeja()
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
                                    Data Meja
                                </h4>
                                <div className="small text-medium-emphasis mb-5">{this.state.countMeja} Data</div>
                            </CCol>
                            <CCol md="7">
                                <CButton className="btn btn-primary btn float-end" onClick={() => this.handleAdd()}><CIcon icon={cilPlus}/> Tambah Data </CButton>
                            </CCol>
                        </CRow>
                        <CRow className='mt-4'>
                            <CTable align="middle" className="mb-0 border" hover responsive>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell className="text-center">
                                        <CIcon icon={cilDinner} />
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="text-center" >ID Meja</CTableHeaderCell>
                                        <CTableHeaderCell className="text-center">Nomer Meja</CTableHeaderCell>
                                        <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                                        <CTableHeaderCell className="text-center">Edit | Delete</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {this.state.meja.map((item, index) => {
                                        return(
                                        <CTableRow key={index}>                                   
                                        <CTableDataCell className='text-center'>
                                            <div>#</div>
                                        </CTableDataCell>
                                        <CTableDataCell className='text-center'>
                                            <div>{item.id}</div>
                                        </CTableDataCell>
                                        <CTableDataCell className='text-center'>
                                            <div>{item.nomer}</div>
                                        </CTableDataCell>
                                        <CTableDataCell className='text-center'>
                                            <div>{item.status}</div>
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
                    <Modal.Title>Form Data Meja</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={(e) => this.handleSave(e)}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label >Nomer Meja</Form.Label>
                            <Form.Control type="text" name="nomer" placeholder="" value={this.state.nomer} onChange={this.handleChange} required/>
                        </Form.Group>  
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select label="status" disabled value={this.state.status} required>
                                <option>Kosong</option>
                                <option>Terisi</option>
                            </Form.Select>
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
//     return (
//     <>
//         <CRow>
//         <CCol xs>
//             <CCard className="mb-4">
//             <CCardHeader>Data Meja</CCardHeader>
//             <CCardBody>
//                 <CRow>
//                     <CInputGroup></CInputGroup>
//                 </CRow>
//                 <CRow className='mt-4'>
//                     <CTable align="middle" className="mb-0 border" hover responsive>
//                         <CTableHead>
//                             <CTableRow>
//                                 <CTableHeaderCell className="text-center">
//                                 <CIcon icon={cilDinner} />
//                                 </CTableHeaderCell>
//                                 <CTableHeaderCell className="text-center" >ID Meja</CTableHeaderCell>
//                                 <CTableHeaderCell className="text-center">Nomer Meja</CTableHeaderCell>
//                                 <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
//                                 <CTableHeaderCell className="text-center">Edit | Delete</CTableHeaderCell>
//                             </CTableRow>
//                         </CTableHead>
//                         <CTableBody>
//                             <CTableRow>
//                                 <CTableDataCell className='text-center'>
//                                     <div>#</div>
//                                 </CTableDataCell>
//                                 <CTableDataCell className='text-center'>
//                                     <div>1</div>
//                                 </CTableDataCell>
//                                 <CTableDataCell className='text-center'>
//                                     <div>1</div>
//                                 </CTableDataCell>
//                                 <CTableDataCell className='text-center'>
//                                     <div color='alert'>Kosong</div>
//                                 </CTableDataCell>
//                                 <CTableDataCell className='text-center'>
//                                     <div className='text-center'>
//                                         <CButton className='mx-1 btn btn-warning'>
//                                             <CIcon icon={cilPencil} className='sm'/> 
//                                         </CButton>|
//                                         <CButton className='mx-1 btn btn-danger'>
//                                             <CIcon icon={cilTrash} color='light'/>
//                                         </CButton>
//                                     </div>
//                                 </CTableDataCell>
//                             </CTableRow>
//                         </CTableBody>
//                     </CTable>
//                 </CRow>
//                 <br />
//             </CCardBody>
//             </CCard>
//         </CCol>
//         </CRow>
//     </>
//     )
// }

// export default Meja
