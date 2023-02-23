import React, { useState, useEffect } from 'react';

const ScrollIndicator = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPos = window.scrollY;
      setScrollPercentage((scrollPos / docHeight) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return <div style={{ width: `${scrollPercentage}%`, height: '2px', borderBottom: '5px solid #f43f5e' }} />;
};

export default ScrollIndicator;
