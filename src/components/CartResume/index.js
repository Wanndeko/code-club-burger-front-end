import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

import { useCart } from '../../hooks/CartContext'
import api from '../../services/api'
import formatCurrency from '../../utils/formatCurrency'
import { Button } from '../Button'
import { Container } from './styles'

export function CartResume() {
  const [finalPrice, setFinalPrice] = useState(0)
  const [deliveryTax] = useState(5)
  const { cartProducts } = useCart()

  useEffect(() => {
    const sumAllItems = cartProducts.reduce((acc, current) => {
      return current.price * current.quantity + acc
    }, 0)

    setFinalPrice(sumAllItems)
  }, [cartProducts])

  const subtmitOrder = async () => {
    const order = cartProducts.map(product => {
      return { id: product.id, quantity: product.quantity }
    })

    await toast.promise(api.post('orders', { products: order }), {
      pending: 'realizando seu pedido...',
      success: 'pedido realizado com sucesso',
      error: 'falha ao tentar realiar seu pedido'
    })
  }
  return (
    <div>
      <Container>
        <div className="containerTop">
          <h2 className="title">Resumo do pedido</h2>
          <p className="items">items</p>
          <p className="priceTotal">{formatCurrency(finalPrice)}</p>
          <p className="delivery">taxa de entrega</p>
          <p className="deliveryPrice">{formatCurrency(deliveryTax)}</p>
        </div>
        <div className="containerBotton">
          <p>Total</p>
          <p>{formatCurrency(finalPrice + deliveryTax)}</p>
        </div>
      </Container>

      <Button
        style={{ width: '100%', marginTop: '30px' }}
        onClick={subtmitOrder}
      >
        Finalizar Pedido
      </Button>
    </div>
  )
}
