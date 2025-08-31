import CameraIcon from "@mui/icons-material/Camera";

import { useRef } from "react";
import { camera, hoverBox, avatarBox } from "./styles";
import { Avatar, Box, Typography } from "@mui/material";



interface IProps {
    src?: string;
    size?: number;
    label?: string;
    disabled?: boolean;
    onChange?: (imageUrl: string, imageId: string) => void;
}

const AvatarPicker = ({ size, src, label, onChange, disabled }: IProps) => {
    const getSize = () => {
        return size ? [size, size / 2] : [100, 50];
    };

    const [avatarSize, iconSize] = getSize();

    const onFileChange = async (event: any) => {
        try {
            if (event.target.files && event.target.files[0]) {

            }
        } catch (error: any) {
        }
    };

    const imageInputRef = useRef<any>(null);

    return (
        <Box sx={avatarBox}>
            <input
                type="file"
                accept="image/*"
                id="icon-button-file"
                ref={imageInputRef}
                disabled={disabled}
                onChange={onFileChange}
                style={{ display: "none" }}
            />
            <label
                htmlFor="icon-button-file"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Avatar
                    alt="upload-image"
                    sx={{
                        fontSize: 75,
                        width: avatarSize,
                        height: avatarSize,
                        fontWeight: "bold",
                        alignItems: "center",
                    }}
                />
                <Box id="hoverBox" sx={(theme: any) => hoverBox(theme, { size: avatarSize })} />
                <CameraIcon sx={(theme: any) => camera(theme, { size: iconSize })} />
            </label>
            {label && (
                <Box mt={1} display="flex" justifyContent="center">
                    <Typography variant="caption" fontWeight="bold">
                        {label}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default AvatarPicker;
