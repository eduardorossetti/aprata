import AppRoutes from './routes/AppRoutes'
import { ToastContainer, Slide } from 'react-toastify'

function App() {
  return (
    <div className="App">
      <AppRoutes />
      <ToastContainer
        position="bottom-left"
        transition={Slide}
        autoClose={2500}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover={true}
        theme="light"
      />
    </div>
  )
}

export default App
