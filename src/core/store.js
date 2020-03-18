// import createStore, applyMiddleware
import { createStore } from 'redux'

// import rootReducer
import rootReducer from './reducers'

// create initial state, an object
// const initialState = {}

function saveToLocalStorage(state) {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('state', serializedState)
  } catch (err) {
    console.log(err)
  }
}

function loadFromLocalStorage() {
  try {
    const serializedState = localStorage.getItem('state')
    if(serializedState === null ) return undefined
    return JSON.parse(serializedState)
  } catch (err) {
    console.log(err)
    return undefined
  }
}

const persistedState = loadFromLocalStorage()

// create store for provider
// const store = createStore(rootReducer, initialState, applyMiddleware(...middleware))

// if you want to monitor your redux state in your chrome browser

// create store for provider
const store = createStore(rootReducer, persistedState)

store.subscribe(() => saveToLocalStorage(store.getState()))

export default store