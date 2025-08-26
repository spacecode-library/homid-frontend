import { Header } from "../components/common/Header"
import { Keypad } from "../components/keypad/Keypad"

export const HomePage = () => {
  return (
    <div className="flex flex-col h-screen justify-center">
      <Header />
      <Keypad />
    </div>
  )
}