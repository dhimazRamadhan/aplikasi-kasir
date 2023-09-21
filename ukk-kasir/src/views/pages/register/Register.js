import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilContact, cilDoor, cilSmile } from '@coreui/icons'
import { render } from '@testing-library/react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default class Register extends React.Component{
  constructor(){
    super();
    this.state = {
      nama: "",
      username: "",
      role: "",
      password: "",
    }
  }

  handleChange = (e) => {
    this.setState({
        [e.target.name]: e.target.value
    })
  }

  handleSave = (e) => {
    e.preventDefault()  
    let form = new FormData()
    form.append("nama", this.state.nama)
    form.append("username", this.state.username) 
    form.append("role", this.state.role) 
    form.append("password", this.state.password)  

    axios.post(`http://localhost:8000/api/register`, form)
    .then(res => {
      //set item
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      Swal.fire({
        title: 'Berhasil !',
        html: 'Berhasil Membuat Akun !',
        icon: 'success'
      })
      window.location = '/#/dashboard'
    })
    .catch((err) => {
      Swal.fire({
        title: 'Gagal Membuat Akun!',
        html: 'Terdapat Data Yang Tidak Sesuai',
        icon: 'error'
      })
      console.log(err.message)
  })
}

  render(){
    return(
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={(e) => this.handleSave(e)}>
                  <h1>Register</h1>
                  <p className="text-medium-emphasis">Buat akun untuk menjalankan aplikasi !</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput placeholder="Nama" onChange={this.handleChange} value={this.state.nama} name="nama" required/>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilDoor} /></CInputGroupText>
                    <CFormSelect name='role' onChange={this.handleChange} value={this.state.role} required >
                      <option>Role</option>
                      <option value={'admin'}>Admin</option>
                      <option value={'kasir'}>Kasir</option>
                      <option value={'manajer'}>Manajer</option>
                    </CFormSelect>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilSmile} />
                    </CInputGroupText>
                    <CFormInput placeholder="Username" onChange={this.handleChange} value={this.state.username} name="username" required/>
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput type='password' placeholder="Password" onChange={this.handleChange} value={this.state.password} name="password" required/>
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="success" type='submit' style={{color: "white"}}>Buat Akun</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
    )
  }
}