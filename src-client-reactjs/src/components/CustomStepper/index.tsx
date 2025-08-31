import StepIcon from "./stepIcon";
import Connector from "./connector";
import Constants from "constants/constants";

import { styled } from "@mui/material/styles";
import { Step, Stepper, StepButton, StepLabel, } from "@mui/material";

export const CustomStepButton = styled(StepButton)(({ theme }) => {
    return ({
        ":hover": {
            cursor: "pointer",
        },
        "& .Mui-active": {
            color: `${Constants.Colors.primary.main} !important`,
            fontWeight: `bold !important`,
        },
        "& .Mui-completed": {
            color: `${Constants.Colors.primary.main} !important`,
        },
    })
});

interface IProps {
    activeStep: number;
    stepLabels: string[];
    canChangeStep?: boolean;
    hiddenSequency?: boolean;
    onStepChange?: (index: number) => void;
    // [key: string]: any;
};

const CustomStepper = ({
    stepLabels,
    activeStep,
    canChangeStep,
    hiddenSequency,
    onStepChange,
    ...rest
}: IProps) => {
    return (
        <Stepper
            activeStep={activeStep}
            nonLinear={canChangeStep}
            connector={<Connector />}
            alternativeLabel={hiddenSequency}
            {...rest}
        >
            {stepLabels.map((lable, index: number) => (
                <Step color={Constants.Colors.primary.main} key={index}>
                    {hiddenSequency
                        ? (
                            canChangeStep
                                ? (
                                    <CustomStepButton
                                        color={Constants.Colors.primary.main}
                                        onClick={() => {
                                            onStepChange &&
                                                onStepChange(index)
                                        }}
                                    >
                                        {lable}
                                    </CustomStepButton>
                                )
                                : <StepLabel>{lable}</StepLabel>
                        )
                        : <StepLabel slots={{ stepIcon: StepIcon }}>{(index + 1) + ". " + lable}</StepLabel>
                    }
                </Step>
            ))}
        </Stepper>
    );
};

export default CustomStepper;
