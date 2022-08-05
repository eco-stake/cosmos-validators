import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cibAtom,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import ChainImage from './components/ChainImage'

const _nav = (chains) => {
  let nav = [
    {
      component: CNavItem,
      name: 'Overview',
      to: '/',
      icon: <CIcon icon={cibAtom} customClassName="nav-icon" />,
      // badge: {
      //   color: 'info',
      //   text: 'NEW',
      // },
    },
    {
      component: CNavTitle,
      name: 'Networks',
    },
  ]

  nav = nav.concat(chains.map(chain => {
    return {
      // component: CNavGroup,
      component: CNavItem,
      name: chain.pretty_name,
      to: '/' + chain.path,
      icon: <ChainImage chain={chain} className="me-4" />,
      // items: [
      //   {
      //     component: CNavItem,
      //     name: 'Chain',
      //     to: '/base/accordion',
      //   },
      //   {
      //     component: CNavItem,
      //     name: 'Validators',
      //     to: '/base/breadcrumbs',
      //   },
      //   {
      //     component: CNavItem,
      //     name: 'Nodes',
      //     to: '/base/cards',
      //   },
      // ],
    }
  }))

  return nav
}

export default _nav