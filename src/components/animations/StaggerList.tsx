import { motion, HTMLMotionProps } from 'framer-motion';

interface StaggerListProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delayOffset?: number;
}

export function StaggerList({ children, delayOffset = 0.05, ...props }: StaggerListProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: delayOffset,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
