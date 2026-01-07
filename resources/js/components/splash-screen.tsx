import { motion, AnimatePresence } from "framer-motion"

export default function SplashScreen({ visible = false }: { visible?: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
          >
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600" />
            <div className="text-center">
              <div className="text-2xl font-bold">MasterTrade</div>
              <div className="text-sm text-muted-foreground">Formations & Licences</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
