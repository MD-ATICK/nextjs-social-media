"use client"
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface props {
    children: ReactNode
}
export default function template({ children }: props) {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0, filter: 'blur(10px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.5 }}
        >
            {children}
        </motion.div>
    )
}