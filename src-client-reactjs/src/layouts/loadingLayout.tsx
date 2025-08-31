import CircularProgress from "@mui/material/CircularProgress"

interface IProps {
    color?: string;
    backgroundColor?: string;
}

const LoadingLayout = (props: IProps) => {
    return (
        <div style={{
            backgroundColor: props.backgroundColor || "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            position: "fixed",
            display: "flex",
            height: "100%",
            width: "100%",
            margin: "auto",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1900,
        }}>
            <div style={{
                border: 1,
                width: 100,
                height: 100,
                display: "flex",
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#ffffff",
            }}>
                <CircularProgress style={{ color: props.color || "black" }} />
            </div>
        </div>
    );
}

export default LoadingLayout