import { motion } from 'framer-motion';

export const Header = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-[45px]"
    >
      <h1 className="text-[36px] sm:text-[36px] font-bold leading-tight">
        <span className="text-[#1F54B0]">Hom</span>
        <span className="text-[#1F54B0]">.</span>
        <span className="text-[#1F54B0]">ID</span>
      </h1>
      <p className="text-[16px] text-[#379AE6] leading-none">The Homepage Connector</p>
    </motion.div>
  )
}