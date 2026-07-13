import { motion, HTMLMotionProps } from 'framer-motion';

interface PageTransitionProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

export function PageTransition({ children, ...props }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
