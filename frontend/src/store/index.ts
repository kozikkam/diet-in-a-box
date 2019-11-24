import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { logger } from 'src/middleware'
import rootReducer from './root-reducer'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

let middleware = applyMiddleware(logger)

if (process.env.NODE_ENV !== 'production') {
  middleware = composeWithDevTools(middleware)
}

export default () => {
  let store = createStore(persistedReducer, {}, middleware)
  let persistor = persistStore(store)
  return { store, persistor }
}
