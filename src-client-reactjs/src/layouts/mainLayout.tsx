import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import Navbar from "components/Navbar";
import FooterApp from "components/FooterApp";

const MainLayout = () => {
    const elementRef = useRef(null);
    const [flexContent, setFlexContent] = useState<any>(false);

    useEffect(() => {

        const updateElementSize = () => {
            const m = document.getElementById("id_main")?.clientHeight;
            const f = document.getElementById("id_footer")?.clientHeight;
            const c = document.getElementById("id_content")?.clientHeight;

            if ((c + f) < m) {
                setFlexContent(true);
            } else {
                setFlexContent(false);
            };

            if (elementRef && elementRef.current) {

            } else {

            }
        };
        // Add event listener to update element size on window resize
        window.addEventListener("resize", updateElementSize);
        // Initial update
        updateElementSize();
        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener("resize", updateElementSize);
        };
    }, []);

    return (
        <Box ref={elementRef}>
            {/* Child screen element */}
            <Box
                boxShadow={2}
                height={"96px"}
                bgcolor={"#ffffff"}
                padding={{ xs: "0px", sm: "0px 16px" }}
            >
                <Navbar />
            </Box>
            <Box
                id={"id_main"}
                component={"main"}
                sx={{
                    p: 0,
                    m: 0,
                    flexGrow: 1,
                    width: "100%",
                    minHeight: "calc(100vh - 96px)",
                    ...(flexContent && {
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    })
                }}
            >
                <Box id={"id_content"}>
                    <Outlet />
                </Box>
                <Box
                    id={"id_footer"}
                    sx={{
                        width: "100%",
                        padding: { xs: "0px", sm: "0px 16px" },
                        boxShadow: 2,
                        backgroundColor: "#ffffff",
                    }}
                >
                    <FooterApp />
                </Box>
            </Box>
        </Box>
    );
};

export default MainLayout;
