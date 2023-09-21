import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Data
const Meja = React.lazy(() => import('./views/data/meja'))
const User = React.lazy(() => import('./views/data/user'))
const Menu = React.lazy(() => import('./views/data/menu'))

//Transaksi
const TransaksiKasir = React.lazy(() => import('./views/transaksi/transaksiKasir'))
const TransaksiManajer = React.lazy(() => import('./views/transaksi/transaksiManajer'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/data/meja', name: 'Meja', element: Meja },
  { path: '/data/user', name: 'User', element: User },
  { path: '/data/menu', name: 'Menu', element: Menu },
  { path: '/transaksi/transaksiKasir', name: 'Transaksi Kasir', element: TransaksiKasir },
  { path: '/transaksi/transaksiManajer', name: 'Transaksi Manajer', element: TransaksiManajer },

]

export default routes
