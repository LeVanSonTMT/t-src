import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import Switch, { SwitchProps } from '@mui/material/Switch';
import Constants from 'constants/constants';



const IOSSwitch = styled((props: SwitchProps & { colorCS?: any }) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme, colorCS }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        margin: 2,
        padding: 0,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                border: 0,
                opacity: 1,
                backgroundColor: (Constants.Colors as any)?.[colorCS || "primary"]?.focus,
                ...theme.applyStyles('dark', {
                    backgroundColor: (Constants.Colors as any)?.[colorCS || "primary"]?.main,
                }),
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: (Constants.Colors as any)?.[colorCS || "primary"]?.main,
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color: theme.palette.grey[100],
            ...theme.applyStyles('dark', {
                color: theme.palette.grey[600],
            }),
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.7,
            ...theme.applyStyles('dark', {
                opacity: 0.3,
            }),
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22,
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: '#00000051',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
        ...theme.applyStyles('dark', {
            backgroundColor: '#39393D',
        }),
    },
}));

const CustomSwitch = (props: {
    label: string;
    checked?: boolean;
    disabled?: boolean;
    onChangeValue?: (checked: boolean) => void;
    color?: "secondary" | "success" | "error" | "info" | "warning";
}) => {
    return (
        <Box
            component={"div"}
            onClick={() => {
                if (props.onChangeValue && !props.disabled)
                    props.onChangeValue(!props.checked)
            }}
            sx={{
                gap: 1,
                display: "flex",
                alignItems: "center",
            }}
        >
            <Typography variant="button" fontWeight="bold" >
                {props.label}
            </Typography>
            <IOSSwitch
                colorCS={props.color}
                checked={props.checked}
                disabled={props.disabled}
            />
        </Box>
    );
};

export default CustomSwitch;
