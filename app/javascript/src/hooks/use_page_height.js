import React, { useEffect, useState } from 'react';

const usePageHeight = (ref) => {
    const [pageHeight, setPageHeight] = useState(window.innerHeight - 60);

    useEffect(() => {
        window.onresize = () => {
            setPageHeight(window.innerHeight - 60);
        };
    }, []);

    return pageHeight;
};

export default usePageHeight;
