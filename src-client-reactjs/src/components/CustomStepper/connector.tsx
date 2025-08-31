import { styled } from "@mui/material";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import Constants from "constants/constants";

const Connector = styled(StepConnector)(({ theme }) => {
    return {
        [`&.${stepConnectorClasses.alternativeLabel}`]: {
            top: 22,
            left: 'calc(-50% + 16px)',
            right: 'calc(50% + 16px)',
        },
        [`&.${stepConnectorClasses.active}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundColor: Constants.Colors.primary.main,
            },
        },
        [`&.${stepConnectorClasses.completed}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundColor: Constants.Colors.primary.main,
            },
        },
        [`& .${stepConnectorClasses.line}`]: {
            height: 3,
            border: 0,
            borderRadius: 1,
            backgroundColor: Constants.Colors.secondary.main,
        },
    };
});

export default Connector;
