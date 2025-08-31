import { isMobile } from "react-device-detect";
import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useMemo, useRef, useState } from "react";
import { Box, IconButton, Typography, useMediaQuery } from "@mui/material";
import {
    Add, ArrowLeft, ArrowRight, Download, Menu,
    MenuOpen, Print, Remove, ZoomIn, ZoomOut
} from "@mui/icons-material";

import {
    actionBtn,
    pdf_viewer,
    pdf_viewer_thumbnail,
    pdf_sidebar_thumbnail,
    pdf_sidebar,
    pdf_toolbar_action,
    pdf_toolbar_title,
    pdf_toolbar,
    gach_phan_cach,
    input_show,
} from "./styles";

import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;



const ViewerPDF = ({
    dataFile,
    fileName,
    hideActionPrint,
    hideActionDownLoad,
}: {
    dataFile: any,
    fileName: string,
    hideActionPrint?: boolean;
    hideActionDownLoad?: boolean;
}) => {

    const viewerRef = useRef(null);

    const [scale, setScale] = useState(1.0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageNumber, setPageNumber] = useState(1);
    const [openSidebar, setOpenSidebar] = useState(true);
    const [minMaxZoom, setMinMaxZoom] = useState<{ min: number, max: number }>({ min: 0.5, max: 3 });

    const matcheLG = useMediaQuery("(min-width: 1200px)");
    const matcheXS = useMediaQuery("(min-width: 0px) and (max-width: 450px)");
    const matcheSM = useMediaQuery("(min-width: 450px) and (max-width: 900px)");
    const matcheMD = useMediaQuery("(min-width: 900px) and (max-width: 1200px)");

    const urlFile = useMemo(() => (window.URL.createObjectURL(dataFile)), [dataFile]);

    useEffect(() => {
        if (matcheLG) {
            setScale(1.2);
            setOpenSidebar(true);
            setMinMaxZoom({ min: 0.5, max: 3 });
        } else if (matcheMD) {
            setScale(1);
            setOpenSidebar(false);
            setMinMaxZoom({ min: 0.4, max: 2.5 });
        } else if (matcheSM) {
            setScale(0.6);
            setOpenSidebar(false);
            setMinMaxZoom({ min: 0.3, max: 2 });
        } else if (matcheXS) {
            setScale(0.45);
            setOpenSidebar(false);
            setMinMaxZoom({ min: 0.1, max: 0.9 });
        } else {
            setScale(1);
            setOpenSidebar(false);
            setMinMaxZoom({ min: 0.5, max: 3 });
        }
    }, [matcheXS, matcheSM, matcheMD, matcheLG]);

    const onDocumentLoadSuccess = ({ numPages }: any) => {
        setTotalPages(numPages);
    };

    const handleZoomIn = () => {
        setScale(prev => Math.min(prev + 0.1, minMaxZoom.max));
    };
    const handleZoomOut = () => {
        setScale(prev => Math.max(prev - 0.1, minMaxZoom.min));
    };

    const handlePrint = () => {
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = urlFile;
        document.body.appendChild(iframe);

        iframe.onload = () => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
        };
    };
    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = urlFile;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(urlFile);
    };

    const pageRefs = useRef<any>({});
    // Scroll đến trang khi pageNumber thay đổi
    useEffect(() => {
        const ref = pageRefs.current[pageNumber];
        if (ref && ref.scrollIntoView) {
            ref.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [pageNumber]);

    return (
        <Box sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
        }} >
            {/* Header */}
            <Box sx={pdf_toolbar}>
                <Box sx={pdf_toolbar_title}>
                    <Box sx={{ display: { xs: "none", sm: "block" } }}>
                        <IconButton onClick={() => { setOpenSidebar(p => !p); }} >
                            {openSidebar ? <Menu htmlColor="#ffffff" /> : <MenuOpen htmlColor="#ffffff" />}
                        </IconButton>
                    </Box>
                    <Typography sx={{
                        width: { xs: "100%", sm: "calc(100% - 44px)" },
                        overflow: "hidden",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                    }}>
                        {fileName}
                    </Typography>
                </Box>
                {/* Action */}
                <Box sx={pdf_toolbar_action}>
                    <Box sx={{
                        gap: { xs: "6px", sm: "16px" },
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                    }}>
                        <Box sx={{
                            gap: "4px",
                            display: "flex",
                            alignItems: "center",
                        }}>
                            <Box
                                component={"div"}
                                sx={(theme) => actionBtn(theme, { disabled: pageNumber === 1 })}
                                onClick={() => {
                                    if (pageNumber > 1) {
                                        setPageNumber(prev => Math.max(prev - 1, 1));
                                    }
                                }}
                            >
                                <ArrowLeft htmlColor={pageNumber === 1 ? "#777" : "#fff"} />
                            </Box>
                            <Box sx={input_show}>
                                <span>{pageNumber} / {totalPages}</span>
                            </Box>
                            <Box
                                component={"div"}
                                sx={(theme) => actionBtn(theme, { disabled: pageNumber === totalPages })}
                                onClick={() => {
                                    if (pageNumber < totalPages) {
                                        setPageNumber(prev => Math.min(prev + 1, totalPages));
                                    }
                                }}
                            >
                                <ArrowRight htmlColor={pageNumber === totalPages ? "#777" : "#fff"} />
                            </Box>
                        </Box>
                        <Box sx={gach_phan_cach}><span>|</span></Box>
                        <Box sx={{
                            gap: "4px",
                            alignItems: "center",
                            display: { xs: "none", sm: "flex" },
                            visibility: { xs: "hidden", sm: "visible" },
                        }}>
                            <Box
                                component={"div"}
                                onClick={handleZoomOut}
                                sx={(theme) => actionBtn(theme, { disabled: scale === minMaxZoom.min })}
                            >
                                <Remove htmlColor={scale === minMaxZoom.min ? "#777" : "#fff"} />
                            </Box>
                            <Box sx={input_show}>
                                <span>{Math.round(scale * 100)}%</span>
                            </Box>
                            <Box
                                component={"div"}
                                onClick={handleZoomIn}
                                sx={(theme) => actionBtn(theme, { disabled: scale === minMaxZoom.max })}
                            >
                                <Add htmlColor={scale === minMaxZoom.max ? "#777" : "#fff"} />
                            </Box>
                        </Box>
                        <Box sx={gach_phan_cach}><span>|</span></Box>
                    </Box>
                    {!isMobile && (!hideActionDownLoad || !hideActionPrint) &&
                        <Box sx={{
                            gap: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                        }}>
                            {!hideActionDownLoad &&
                                <Box
                                    component={"div"}
                                    onClick={handleDownload}
                                    sx={(theme) => actionBtn(theme, { circle: true })}
                                >
                                    <Download />
                                </Box>
                            }
                            {!hideActionPrint &&
                                <Box
                                    component={"div"}
                                    onClick={handlePrint}
                                    sx={(theme) => actionBtn(theme, { circle: true })}
                                >
                                    <Print />
                                </Box>
                            }
                        </Box>
                    }
                </Box>
            </Box>

            {/* Content */}
            <Box sx={{
                position: "relative",
                height: "calc(100% - 50px)",
            }} >
                {openSidebar &&
                    <Document key={"pdf_sidebar"} file={dataFile} error={<></>} loading={<></>}>
                        <Box sx={pdf_sidebar}>
                            {[...Array(totalPages || 0)].map((_, index) => (
                                <Box key={`pdf_sidebar_thumbnail_${index}`}>
                                    <Box
                                        component={"div"}
                                        onClick={() => { setPageNumber(index + 1); }}
                                        sx={theme => pdf_sidebar_thumbnail(theme, { actived: pageNumber === (index + 1) })}
                                    >
                                        <Page pageNumber={index + 1} width={100} />
                                    </Box>
                                    <Typography sx={{ color: "#ffffff", textAlign: "center" }}>
                                        {index + 1}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Document>
                }
                <Document key={"pdf_viewer"} file={dataFile} error={<></>} loading={<></>}>
                    <Box ref={viewerRef} sx={pdf_viewer}  >
                        <Box sx={pdf_viewer_thumbnail} >
                            {[...Array(totalPages || 0)].map((_, index) => (
                                <Box
                                    key={`pdf_viewer_thumbnail_${index}`}
                                    ref={el => (pageRefs.current[index + 1] = el)}
                                >
                                    <Page pageNumber={index + 1} scale={scale} />
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Document>
            </Box>

            <Box sx={{ display: "none", visibility: "hidden" }}>
                <Document
                    key={"droot"} file={dataFile}
                    error={<></>} loading={<></>}
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    <Page pageNumber={pageNumber} scale={scale} />
                </Document>
            </Box>

            <Box sx={{
                right: 3,
                bottom: 16,
                zIndex: 10,
                gap: "4px",
                position: "fixed",
                alignItems: "center",
                display: { xs: "flex", sm: "none" },
                visibility: { xs: "visible", sm: "hidden" },
            }}>
                <Box sx={{
                    gap: "4px",
                    display: "grid",
                    alignItems: "center",
                }}>
                    <IconButton
                        onClick={handleZoomIn}
                        sx={{
                            backgroundColor: "#d4d4d496",
                            ":hover": {
                                backgroundColor: "#d3d3d3",
                            },
                        }}
                    >
                        <ZoomIn />
                    </IconButton>
                    <IconButton
                        onClick={handleZoomOut}
                        sx={{
                            backgroundColor: "#d4d4d496",
                            ":hover": {
                                backgroundColor: "#d3d3d3",
                            },
                        }}
                    >
                        <ZoomOut />
                    </IconButton>
                </Box>
            </Box>
        </Box >
    );
};

export default ViewerPDF;