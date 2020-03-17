// import createStore, applyMiddleware
import { createStore, applyMiddleware, compose } from 'redux'
// import thunk
import thunk from 'redux-thunk'
// import rootReducer
import rootReducer from './reducers'

// create initial state, an object
// const initialState = {}

// use thunk as middleware
const middleware = [thunk]

// create store for provider
// const store = createStore(rootReducer, initialState, applyMiddleware(...middleware))

// if you want to monitor your redux state in your chrome browser

function saveToLocalStorage(state) {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('checkdc', serializedState)
  } catch (err) {
    console.log(err)
  }
}

function loadFromLocalStorage() {
  try {
    const serializedState = localStorage.getItem('checkdc')
    if(serializedState === null ) return undefined
    return JSON.parse(serializedState)
  } catch (err) {
    console.log(err)
    return undefined
  }
}

const persistedState = loadFromLocalStorage()

// create store for provider
const store = createStore(rootReducer, persistedState, 
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
)

store.subscribe(() => saveToLocalStorage(store.getState()))

export default store