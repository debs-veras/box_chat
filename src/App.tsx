import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Chat } from './pages/Chat'

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        rtl={false}
        draggable
        pauseOnHover
        closeButton={true}
        style={{ width: "fit-content" }}
      />
      <Chat />
    </>
  )
}

export default App
