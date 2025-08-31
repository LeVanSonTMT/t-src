
import { styled } from "@mui/material";
import { StepIconProps } from "@mui/material/StepIcon";
import { Check as CheckIcon } from "@mui/icons-material";

import Constants from "constants/constants";



const StepIconRoot = styled("div")<{
    ownerState: { completed?: boolean; active?: boolean; color?: string };
}>(({ theme, ownerState }) => {
    const { completed, active } = ownerState;

    return {
        backgroundColor: "#ccc",
        zIndex: 1,
        width: 35,
        height: 35,
        color: "#fff",
        display: "flex",
        borderRadius: "50%",
        alignItems: "center",
        justifyContent: "center",
        ...(active && {
            backgroundColor: Constants.Colors.primary.main,
            boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
        }),
        ...(completed && {
            backgroundColor: Constants.Colors.primary.main,
        }),
    };
});

function StepIcon(props: StepIconProps) {
    const { active, completed, className, color } = props;

    return (
        <StepIconRoot ownerState={{ completed, active, color }} className={className}>
            <CheckIcon />
        </StepIconRoot>
    );
}

export default StepIcon;
