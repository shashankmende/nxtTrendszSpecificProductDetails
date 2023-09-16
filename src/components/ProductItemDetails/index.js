import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {updatedData: [], quantity: 1, apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getData()
  }

  convertToCamelCase = data => ({
    imageUrl: data.image_url,
    title: data.title,
    price: data.price,
    description: data.description,
    brand: data.brand,
    totalReviews: data.total_reviews,
    rating: data.rating,
    availability: data.availability,
    similarProducts: data.similar_products,
  })

  getData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    const {match} = this.props
    const {params} = match
    const {id} = params
    const response = await fetch(`https://apis.ccbp.in/products/${id}`, options)
    const data = await response.json()
    console.log('data=', data)
    if (response.ok === true) {
      this.setState(
        {
          updatedData: this.convertToCamelCase(data),
          apiStatus: apiStatusConstants.success,
        },
        this.returnSpecificDetails,
      )
    } else {
      console.log('this. props = ', this.props)
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onClickMinusBtn = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({
        quantity: prevState.quantity - 1,
      }))
    }
  }

  onClickPlusBtn = () =>
    this.setState(prevState => ({
      quantity: prevState.quantity + 1,
    }))

  returnSpecificDetails = () => {
    const {updatedData, quantity} = this.state

    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
    } = updatedData

    return (
      <div className="bg-container">
        <div className="product-details-container">
          <img src={imageUrl} alt="product" className="image" />
          <div className="details-container">
            <h1>{title}</h1>
            <p>Rs {price}/-</p>
            <div>
              <button type="button" className="buttons-container">
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </button>
              <p>{totalReviews} Reviews</p>
            </div>
            <p>{description}</p>
            <p>
              <b>Available:</b> {availability}
            </p>
            <p>
              <b>Brand:</b> {brand}
            </p>
            <hr className="horizontal-line" />
            <div className="quantity-container">
              <button
                type="button"
                onClick={this.onClickMinusBtn}
                data-testid="minus"
              >
                <BsDashSquare />
              </button>
              <p>{quantity}</p>
              <button
                type="button"
                onClick={this.onClickPlusBtn}
                data-testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button className="add-to-cart" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    )
  }

  returnSimilarProducts = () => {
    const {updatedData} = this.state

    const {similarProducts} = updatedData
    console.log('Similar Products=', similarProducts)
    if (similarProducts !== undefined) {
      return (
        <div className="similar-bg-container">
          <div className="similar-products-container">
            <h1 className="heading">Similar Products</h1>
            <ul className="unordered-container">
              {similarProducts.map(each => (
                <li className="list-item" key={each.id}>
                  <img
                    src={each.image_url}
                    alt={`similar product ${each.title}`}
                    className="similar-image"
                  />
                  <h1 className="item-heading">{each.title}</h1>
                  <p>{each.brand}</p>
                  <div className="price-container">
                    <p>
                      <b>Rs {each.price}/-</b>
                    </p>
                    <div className="rating-container">
                      <p>{each.rating}</p>
                      <img
                        src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                        alt="star"
                        className="star-image"
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    }
    return null
  }

  onClickContinueBtn = () => {
    const {history} = this.props
    history.push('/products')
  }

  returnFailureView = () => (
    <div className="failure-view-container">
      <div className="failure-inside-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png "
          alt="failure view"
          className="failure-image"
        />
        <h1>Product Not Found</h1>
        <button
          type="button"
          className="continue-shopping-button"
          onClick={this.onClickContinueBtn}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )

  LoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  overAllResult = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return (
          <>
            {this.returnSpecificDetails()}
            {this.returnSimilarProducts()}
          </>
        )

      case apiStatusConstants.inProgress:
        return this.LoadingView()
      case apiStatusConstants.failure:
        return this.returnFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.overAllResult()}
      </div>
    )
  }
}

export default ProductItemDetails
