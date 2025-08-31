import CircularProgress from "@mui/material/CircularProgress"
import Constants from "constants/constants";

interface IProps {
    color?: string;
    visible: boolean;
}

const Loading = ({ color, visible }: IProps) => {
    return (
        <>
            {
                visible && <div style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9999,
                    width: "100%",
                    height: "100%",
                    margin: "auto",
                    display: "flex",
                    position: "fixed",
                    minHeight: "100vh",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}>
                    <div style={{
                        width: "60px",
                        height: "60px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#ffffff",
                        border: 1,
                        borderRadius: "30px",
                    }}>
                        <CircularProgress style={{ color: color ?? Constants.Colors.primary.main }} />
                    </div>
                </div>
            }
        </>
    );
};

export default Loading