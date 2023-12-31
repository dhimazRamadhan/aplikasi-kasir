import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilList,
  cilSofa,
  cilDinner,
  cilMoney,
  cilPlus,
  cilFastfood,
  cilPizza,
  cilPeople,
  cilAccountLogout,
  cilHome,
  cilWallet,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Data',
  },
  {
    component: CNavItem,
    name: 'Data Meja',
    to: '/data/meja',
    icon: <CIcon icon={cilDinner} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'Admin',
    },
  },
  {
    component: CNavItem,
    name: 'Data Menu',
    to: '/data/menu',
    icon: <CIcon icon={cilPizza} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'Admin',
    },
  },
  {
    component: CNavItem,
    name: 'Data User',
    to: '/data/user',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'Admin',
    },
  },
  {
    component: CNavTitle,
    name: 'Transaksi',
  },
  {
    component: CNavItem,
    name: 'Transaksi',
    to: '/transaksi/transaksiKasir',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
    badge: {
      color: 'success',
      text: 'Kasir',
    },
  },
  {
    component: CNavItem,
    name: 'Transaksi',
    to: '/transaksi/transaksiManajer',
    icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
    badge: {
      color: 'danger',
      text: 'Manager',
    },
  },
  {
    component: CNavTitle,
    name: 'Logout',
  },
  {
    component: CNavItem,
    name: 'Logout',
    to: '/login',
    icon: <CIcon icon={cilAccountLogout} customClassName="nav-icon" />,
  },
]

export default _nav
