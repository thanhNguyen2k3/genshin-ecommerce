'use client';
import { motion, useScroll } from 'framer-motion';

const ScrollAnimation = () => {
    const { scrollYProgress } = useScroll();

    return <motion.div style={{ scaleX: scrollYProgress }} />;
};

export default ScrollAnimation;
